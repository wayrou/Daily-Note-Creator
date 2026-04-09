const { execFileSync } = require("child_process");
const path = require("path");

exports.default = async function afterPack(context) {
  if (context.electronPlatformName !== "darwin") {
    return;
  }

  const appName = context.packager.appInfo.productFilename;
  const appPath = path.join(context.appOutDir, `${appName}.app`);

  try {
    execFileSync("xattr", ["-cr", appPath], { stdio: "inherit" });
  } catch (error) {
    console.warn(`Could not strip extended attributes from ${appPath}:`, error);
  }
};
