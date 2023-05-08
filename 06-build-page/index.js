const { join, extname, basename } = require('path');
const { readdir, mkdir, rm, access, stat, copyFile, readFile } = require('fs/promises');
const { createReadStream, createWriteStream } = require('fs');
const { EOL } = require('os');

const newFolderPath = join(__dirname, 'project-dist');
const folderPath = join(__dirname, 'assets');
const folderCopyPath = join(newFolderPath, 'assets');
const stylesFolderPath = join(__dirname, 'styles');
const bundlePath = join(__dirname, 'project-dist', 'style.css');
const templateHtmlPath = join(__dirname, 'template.html');
const bundleHtmlPath = join(__dirname, 'project-dist', 'index.html');
const componentsPath = join(__dirname, 'components');

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
  }
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
            });
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

  const createBundleHtml = async () => {
    const writeStream = createWriteStream(bundleHtmlPath);
    try {
      const HTMLString = await readFile(templateHtmlPath, 'utf-8');
      let resultHTMLString = HTMLString;
      try {
        const files = await readdir(componentsPath);
        files.forEach(async (file, idx) => {
          const componentFilePath = join(componentsPath, file);
          try {
            const stats = await stat(componentFilePath);
            if(stats.isFile() && extname(componentFilePath) === '.html'){
              const templateHTMLString = await readFile(componentFilePath, 'utf-8');
              let componentTemplate = `{{${basename(componentFilePath, extname(componentFilePath))}}}`;
              resultHTMLString = resultHTMLString.replaceAll(componentTemplate, templateHTMLString);
              if(idx === files.length - 1){
                writeStream.write(resultHTMLString);
              }
            }
          } catch (err) {
            console.error(err.message);
          }
        });
      } catch (err) {
        console.error(err.message);
      }
      
    } catch (err) {
      console.error(err.message);
    }
  };

  await createBundleHtml();
};


pageBuild();
