const fs = require("fs");
const path = require("path");

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function restoreImports(filePath) {
  if (!filePath.endsWith(".tsx") && !filePath.endsWith(".ts")) return;

  let content = fs.readFileSync(filePath, "utf8");
  let original = content;

  // Restore types to 4 levels up
  content = content.replace(/\.\.\/\.\.\/\.\.\/types/g, "../../../../types");

  if (content !== original) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Restored {filePath}`);
  }
}

walkDir("./src/sections", restoreImports);
