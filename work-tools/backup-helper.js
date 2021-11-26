const path = require('path');
const { getFilesFromFolder, findTheLatestBackup, logLineAsync, copyFromToFile } = require('./share-tools');

const RECOVERY_FILE_NAME = 'recovery.gz';

const backupFolder = path.resolve(__dirname, '../db/backups');
const recoveryPath = path.join(backupFolder, RECOVERY_FILE_NAME);

async function start() {
  try {
    logLineAsync(`Started backup from folder: ${backupFolder}`);
    const data = await getFilesFromFolder(backupFolder);
    if (data && data.length === 0) {
      return logLineAsync(`Error: No files in folder: ${backupFolder}. Backup aborted`);
    }
    
    const { path: latestBackupPath } = await findTheLatestBackup(backupFolder, data, RECOVERY_FILE_NAME);
    
    await copyFromToFile(latestBackupPath, recoveryPath);
    logLineAsync(`Recovery.gz successfully updated from file: ${latestBackupPath}`);
  } catch (e) {
    logLineAsync(`Error: folder is not exist or copying error! Program was terminated`);
  }
}

start();
