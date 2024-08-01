const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const archiver = require("archiver");
const { spawnPromise } = require("./helper/utilities/index");

router.get("/backup", async (req, res) => {
  try {
    const secretHeaders = req.headers["custom-headers"];
    const mySecretKeys = process.env.MICPLE_SECRET_CODE; 

    if (secretHeaders !== mySecretKeys) {
      throw Error("Unauthorize attempt");
    } 
    const assetsDBFilePath = path.join(__dirname, "../../assets/db");
    // Use await to wait for the completion of the spawnPromise
    await spawnPromise("mongodump", [`--out=${assetsDBFilePath}/dump`]);

    const dumpFolderPath = path.join(assetsDBFilePath, "dump"); 
    if (!fs.existsSync(dumpFolderPath)) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    } 

    const archive = await archiver("zip", { zlib: { level: 9 } });
    // Set response headers
    await res.set({
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename=${encodeURIComponent(
        "backup_folder.zip"
      )}`,
    }); 
    archive.pipe(res);
    archive.directory(assetsDBFilePath, false); // Add entire folder to the archive
    archive.finalize();
  } catch (error) {  
    console.log("error ===>>>", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
