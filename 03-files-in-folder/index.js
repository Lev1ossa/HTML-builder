const { join, extname, basename } = require('path');
const { stdout } = require('process');
const { readdir, stat } = require('fs/promises');

const folderPath = join(__dirname, 'secret-folder');

const readFiles = async () => {
  try {
    const files = await readdir(folderPath);
    files.forEach(async (file) => {
      const filePath = join(folderPath, file);
      try {
        const stats = await stat(filePath);
        if(stats.isFile()){
          console.log(`${basename(filePath, extname(filePath))} - ${extname(filePath)} - ${stats.size}b`);
        }
      } catch (err) {
        stdout.write('Read file operation failed\n');
      }
    });
  } catch (err) {
    stdout.write('Read files operation failed\n');
  }
};

readFiles();