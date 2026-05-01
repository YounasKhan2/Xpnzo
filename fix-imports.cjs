const fs = require("fs");
const path = require("path");

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function fixImports(filePath) {
  if (!filePath.endsWith(".tsx") && !filePath.endsWith(".ts")) return;

  let content = fs.readFileSync(filePath, "utf8");
  let original = content;

  // Fix paths
  content = content.replace(
    /\.\.\/\.\.\/\.\.\/\.\.\/components/g,
    "../../../components",
  );
  content = content.replace(/\.\.\/\.\.\/\.\.\/\.\.\/data/g, "../../../data");
  content = content.replace(/\.\.\/\.\.\/\.\.\/\.\.\/types/g, "../../../types");

  // Also fix verbatimModuleSyntax issue
  content = content.replace(
    /import {([^}]+)} from '([^']+)global-types';/g,
    "import type { 1 } from '2global-types';",
  );
  content = content.replace(
    /import {([^}]+)} from '([^']+)Dashboard-types';/g,
    "import type { 1 } from '2Dashboard-types';",
  );
  content = content.replace(
    /import {([^}]+)} from '([^']+)Analytics-types';/g,
    "import type { 1 } from '2Analytics-types';",
  );
  content = content.replace(
    /import {([^}]+)} from '([^']+)Budgets-types';/g,
    "import type { 1 } from '2Budgets-types';",
  );
  content = content.replace(
    /import {([^}]+)} from '([^']+)Reports-types';/g,
    "import type { 1 } from '2Reports-types';",
  );
  content = content.replace(
    /import {([^}]+)} from '([^']+)Notifications-types';/g,
    "import type { 1 } from '2Notifications-types';",
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Fixed {filePath}`);
  }
}

walkDir("./src/sections", fixImports);
walkDir("./types", fixImports);
