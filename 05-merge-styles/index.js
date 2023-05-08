const { join, extname } = require('path');
const { readdir, stat } = require('fs/promises');
const { createReadStream, createWriteStream } = require('fs');
const { EOL } = require('os');

const stylesFolderPath = join(__dirname, 'styles');
const bundlePath = join(__dirname, 'project-dist', 'bundle.css');

const writeStream = createWriteStream(bundlePath);

const createBundle = async () => {
  try {
    const files = await readdir(stylesFolderPath);
    files.forEach(async (file) => {
      const styleFilePath = join(stylesFolderPath, file);
      try {
        const stats = await stat(styleFilePath);
        if(stats.isFile() && extname(styleFilePath) === '.css'){
          const readStream = createReadStream(styleFilePath);
          readStream.on('data', data => {
            writeStream.write(`${data}${EOL}`);
          })
        }
      } catch (err) {
        console.error(err.message);
      }
    });
  } catch (err) {
    console.error(err.message);
  }
};

createBundle();