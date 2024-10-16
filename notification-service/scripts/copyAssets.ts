import fs from "fs-extra";
import path from "path";

async function copyDirectory(src: string, dest: string) {
  try {
    await fs.copy(src, dest);
    console.log(`Copied ${src} to ${dest}`);
  } catch (err) {
    console.error("Error copying directory:", err);
  }
}

const src = path.join(__dirname, "..", "src/emails");
const dest = path.join(__dirname, "..", "build/src/emails");
copyDirectory(src, dest);
