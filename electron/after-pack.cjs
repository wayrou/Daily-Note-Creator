const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

function stripAttributes(appPath) {
  try {
    execFileSync("xattr", ["-cr", appPath], { stdio: "inherit" });
  } catch (error) {
    console.warn(`Could not strip extended attributes from ${appPath}:`, error);
  }
}

// codesign refuses to sign a bundle that carries com.apple.FinderInfo, and iCloud
// Drive re-attaches it to bundles in synced folders faster than an in-place strip
// can beat, so sign a copy in a non-synced temp directory and move it back. On
// the same APFS volume ditto clones the tree, so the round trip is cheap.
function adHocSign(appPath) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "koala-adhoc-sign-"));
  const tempApp = path.join(tempDir, path.basename(appPath));

  try {
    execFileSync("ditto", [appPath, tempApp], { stdio: "inherit" });
    stripAttributes(tempApp);
    execFileSync("codesign", ["--force", "--deep", "--sign", "-", tempApp], { stdio: "inherit" });
    fs.rmSync(appPath, { recursive: true, force: true });
    execFileSync("ditto", [tempApp, appPath], { stdio: "inherit" });
    return true;
  } catch (error) {
    console.warn(`Could not ad-hoc sign ${appPath}:`, error);
    return false;
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

exports.default = async function afterPack(context) {
  if (context.electronPlatformName !== "darwin") {
    return;
  }

  const appName = context.packager.appInfo.productFilename;
  const appPath = path.join(context.appOutDir, `${appName}.app`);

  stripAttributes(appPath);

  // Without a Developer ID identity electron-builder skips signing entirely, and
  // the bundle keeps Electron's bare linker signature (Identifier=Electron,
  // "Sealed Resources=none"). That fails `codesign --verify`, so macOS reports
  // every download as "damaged and can't be opened". Ad-hoc signing produces a
  // self-consistent bundle that launches.
  //
  // This hook runs before electron-builder's own signing step, which overrides
  // the signature when a real identity is available, so it is safe either way.
  if (process.env.CSC_LINK || process.env.CSC_NAME) {
    return;
  }

  if (!adHocSign(appPath)) {
    return;
  }

  console.log(`Ad-hoc signed ${appPath}`);

  // Strip once more so the delivered bundle verifies cleanly under --strict.
  stripAttributes(appPath);
};
