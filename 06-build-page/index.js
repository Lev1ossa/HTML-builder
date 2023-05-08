const { join, extname } = require('path');
const { readdir, mkdir, rm, access, stat, copyFile, readFile } = require('fs/promises');
const { createReadStream, createWriteStream } = require('fs');
const { EOL } = require('os');

const newFolderPath = join(__dirname, 'project-dist');
const folderPath = join(__dirname, 'assets');
const folderCopyPath = join(newFolderPath, 'assets');
const stylesFolderPath = join(__dirname, 'styles');
const bundlePath = join(__dirname, 'project-dist', 'bundle.css');
const templateHtmlPath = join(__dirname, 'template.html');

const pageBuild = async () => {
  //create directory
  const removeDir = async () => {
    try {
      await rm(newFolderPath, { recursive: true });
    } catch (err) {
      console.error(err.message);
    }
  };
  
  const createDir = async (createDirPath) => {
    try {
      await mkdir(createDirPath, { recursive: true });
    } catch (err) {
      console.error(err.message);
    }
  };
  
  //check folder exists
  try {
    //exists, delete dir, create new dir
    await access(newFolderPath);
    await removeDir();
    await createDir(newFolderPath);
  } catch (err) {
    //dont exist, create new dir
    await createDir(newFolderPath);
  };
  //end of create directory

  //copy assets
  const copyFolder = async (currentFolderPath, currentFolderCopyPath) => {
    try {
      const files = await readdir(currentFolderPath);
      files.forEach(async (file) => {
        const filePath = join(currentFolderPath, file);
        const fileCopyPath = join(currentFolderCopyPath, file);
        try {
          const stats = await stat(filePath);
          if(stats.isFile()){
            try {
              await copyFile(filePath, fileCopyPath);
            } catch (err) {
              console.error(err.message);
            }
          } else {
            await createDir(fileCopyPath);
            await copyFolder(filePath, fileCopyPath);
          }
        } catch (err) {
          console.error(err.message);
        }
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  copyFolder(folderPath, folderCopyPath);

  // create css bundle file
  const writeStream = createWriteStream(bundlePath);

  const createBundleCSS = async () => {
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
  
  createBundleCSS();

};

pageBuild();
