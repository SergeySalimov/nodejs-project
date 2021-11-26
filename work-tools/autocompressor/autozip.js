const path = require('path');
const stream = require('stream');
const fs = require('fs');
const os = require('os');
const zlib = require('zlib');
const util = require('util');

const pipeline = util.promisify(stream.pipeline);
const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);

const defaultFolderName = 'postman';
const GZ = '.gz';

const logPath = path.join(__dirname, '_server.log');

let workingFolder;

if (process.argv.length <= 2) {
  workingFolder = path.join(__dirname, defaultFolderName);
} else {
  workingFolder = path.join(__dirname, process.argv[2]);
}

function logLineAsync(logMessage, logFilePath = logPath) {
  return new Promise((resolve ,reject) => {
    const logDT = new Date();
    const fullLog = `${logDT.toLocaleDateString()} ${logDT.toLocaleTimeString()} ${logMessage}`;
    
    console.log(fullLog);
    
    fs.open(logFilePath, 'a+', (err, logFd) => {
      if(err) {
        reject(err);
      } else {
        fs.write(logFd, fullLog + os.EOL, (err) => {
          if (err) {
            reject(err);
          } else {
            fs.close(logFd, err => { err ? reject(err) : resolve(); });
          }
        });
      }
    });
  })
}

async function compressFile(file) {
  const startTime = Date.now();
  logLineAsync(`${file} is started to compress!`);
  try {
    await pipeline(
      fs.createReadStream(file),
      zlib.createGzip(),
      fs.createWriteStream(file + GZ),
    );
    const endTime = Date.now();
    logLineAsync(`${file} successfully compressed! Work time is ${endTime - startTime} ms`);
  } catch (err) {
    logLineAsync(`${file} compression failed`);
  }
}

async function getFilesFromFolder(folder) {
  try {
    return await readdir(folder);
  } catch (e) {
    logLineAsync(`${folder} Error no such directory! Program was terminated`);
  }
}

async function processingFilesInFolder(folderData, workingDir) {
  for (const data of folderData) {
    if (data.endsWith(GZ)) {
      continue;
    }
    
    const fullPath = path.join(workingDir, data);
    const stats = await stat(fullPath);
    if (stats.isFile()) {
      const gzVersionPath = fullPath + GZ;
      
      if (fs.existsSync(gzVersionPath)) {
        const gzStats = await stat(gzVersionPath);
  
        if (stats.mtime > gzStats.mtime) {
          logLineAsync(`${fullPath} found not actual version of compressed file, will recompress this file!`);
        } else {
          logLineAsync(`${fullPath} is already compressed!`);
          continue;
        }
      }
      
      await compressFile(fullPath);
      
    } else if (stats.isDirectory()) {
      const newFolderData = await getFilesFromFolder(fullPath);
      await processingFilesInFolder(newFolderData, fullPath);
    } else {
      logLineAsync(`${data} is not a file or directory and was skipped`)
    }
  }
}

async function startProcess() {
  try {
    logLineAsync('====================================== STARTING AUTOCOMPRESSOR =====================================');
    logLineAsync(`${workingFolder} everything here will be compressed`);
    let folderData = await getFilesFromFolder(workingFolder);
    await processingFilesInFolder(folderData, workingFolder);
    logLineAsync('===================================== FINISHING AUTOCOMPRESSOR =====================================');
  } catch (e) {
    logLineAsync('Some error occurred. Program was terminated');
  }
}

startProcess();
