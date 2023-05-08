const fs = require('fs');
const path = require('path');
const { stdin, stdout } = require('process');

fs.writeFile(path.join(__dirname, 'text.txt'), '', ((err) => {
  if (err) throw err;
  stdout.write('File is created, input your text!\n');
}));

const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdin.on('data', data => {
  if(String(data).trim() === 'exit'){
    stdout.write('Have a nice day!\n');
    process.exit();
  }
  writeStream.write(data);
});

process.on('SIGINT', () => {
  stdout.write('\nHave a nice day!\n');
  process.exit();
});