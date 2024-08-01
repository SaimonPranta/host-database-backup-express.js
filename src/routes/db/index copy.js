const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const archiver = require("archiver");
const { spawnPromise } = require("./helper/utilities/index");

router.get("/backup", async (req, res) => {
  try {
    console.log("Hello from here")
    const secretHeaders = req.headers["custom-headers"];
    const mySecretKeys = process.env.MICPLE_SECRET_CODE; 

    if (secretHeaders !== mySecretKeys) {
      throw Error("Unauthorize attempt");
    } 
    const assetsDBFilePath = path.join(__dirname, "../../assets/db");
    // Use await to wait for the completion of the spawnPromise
    await spawnPromise("mongodump", [`--out=${assetsDBFilePath}/dump`]);

    const dumpFolderPath = path.join(assetsDBFilePath, "dump"); 
console.log("fs.existsSync(dumpFolderPath) ==>", fs.existsSync(dumpFolderPath))
    if (!fs.existsSync(dumpFolderPath)) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    } 

    const archive = await archiver("zip", { zlib: { level: 9 } });
    await archive.directory(assetsDBFilePath, false);
    await archive.finalize();

    // Set response headers
    await res.set({
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename=${encodeURIComponent(
        "backup_folder.zip"
      )}`,
    }); 
    console.log("Response comes before end ======>>>>")

    archive.pipe(res);
  } catch (error) {  
    console.log("error ===>>>", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
