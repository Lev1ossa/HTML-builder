const { join } = require('path');
const { readdir, mkdir, rm, access, copyFile } = require('fs/promises');

const folderPath = join(__dirname, 'files');
const folderCopyPath = join(__dirname, 'files-copy');

const copyDir = async () => {

  const removeDir = async () => {
    try {
      await rm(folderCopyPath, { recursive: true });
    } catch (err) {
      console.error(err.message);
    }
  };

  const createDir = async () => {
    try {
      await mkdir(folderCopyPath, { recursive: true });
    } catch (err) {
      console.error(err.message);
    }
  };

  //check folder exists
  try {
    //exists, delete dir, create new dir
    await access(folderCopyPath);
    await removeDir();
    await createDir();
  } catch (err) {
    //dont exist, create new dir
    createDir();
  }

  //copy dir
  try {
    const files = await readdir(folderPath);
    files.forEach(async (file) => {
      const filePath = join(folderPath, file);
      const fileCopyPath = join(folderCopyPath, file);
      try {
        await copyFile(filePath, fileCopyPath);
      } catch (err) {
        console.error(err.message);
      }
    });
  } catch (err) {
    console.error(err.message);
  }
};

copyDir();