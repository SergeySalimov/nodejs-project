const path = require('path');
const fs = require('fs');
const os = require('os');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);
const copy = util.promisify(fs.copyFile);

const logPath = path.join(__dirname, '_server.log');

function logLineAsync(logMessage, logFilePath = logPath) {
  return new Promise((resolve, reject) => {
    const logDT = new Date();
    const fullLog = `${logDT.toLocaleDateString()} ${logDT.toLocaleTimeString()} ${logMessage}`;
    
    console.log(fullLog);
    
    fs.open(logFilePath, 'a+', (err, logFd) => {
      if (err) {
        reject(err);
      } else {
        fs.write(logFd, fullLog + os.EOL, (err) => {
          if (err) {
            reject(err);
          } else {
            fs.close(logFd, err => {
              err ? reject(err) : resolve();
            });
          }
        });
      }
    });
  })
}

async function findTheLatestBackup(folder, files, recoveryFile) {
  const latestFile = { path: null, date: null };
  for (const file of files) {
    if (file === recoveryFile || !file.endsWith('.gz')) {
      continue;
    }
    
    const fullPath = path.join(folder, file);
    const stats = await stat(fullPath);
    
    if (stats.isFile() && (!latestFile.date || latestFile.date < stats.mtime)) {
      latestFile.date = stats.mtime;
      latestFile.path = fullPath;
    }
  }
  
  return latestFile;
}

async function copyFromToFile(fromFile, toFile) {
  await copy(fromFile, toFile);
}

async function getFilesFromFolder(folder) {
  return await readdir(folder);
}

function getDateTimeLog() {
  const logDT = new Date();
  const currentDateTime = `${logDT.toLocaleDateString()} ${logDT.toLocaleTimeString()}:>`;
  
  return currentDateTime;
}

function messageLog(msg) {
  return console.log(`${getDateTimeLog()} ${msg}`);
}



module.exports = {
  getFilesFromFolder,
  messageLog,
  findTheLatestBackup,
  logLineAsync,
  copyFromToFile,
};
