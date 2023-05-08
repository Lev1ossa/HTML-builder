const fs = require('fs');
const path = require('path');
const { stdin, stdout } = require('process');
const {EOL} = require('os');

fs.writeFile(path.join(__dirname, 'text.txt'), '', ((err) => {
  if (err) throw err;
  stdout.write(`File is created, input your text!${EOL}`);
}));

const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdin.on('data', data => {
  if(String(data).trim() === 'exit'){
    stdout.write(`Have a nice day!${EOL}`);
    process.exit();
  }
  writeStream.write(data);
});

process.on('SIGINT', () => {
  stdout.write(`${EOL}Have a nice day!${EOL}`);
  process.exit();
});