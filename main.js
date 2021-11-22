import express from 'express';
import path from 'path';
import fetch from 'isomorphic-fetch';
import fs from 'fs';
import cors from 'cors';
import busboy from 'connect-busboy';
import WebSocket from 'ws';
// import bcrypt from 'bcryptjs';
import {
  addTimeFromNow,
  checkIdValidity,
  createSecureUploadData,
  getNewId,
  getRandomString,
  logLineAsync,
  shortMessage,
} from './share/helper-es6';
import Users from './db/users';
import {
  createConfirmationPage,
  MESSAGE_ERROR_FOR_USER,
  MESSAGE_ERROR_SENT_EMAIL_FOR_USER,
  MESSAGE_SUCCESS_FOR_USER,
  sendEmail
} from './share/send-email';

const webServer = express();
const PORT = 7780;
const WS_PORT = 7781;
const API = '/api';
const CORS_OPTIONS = {
  origin: '*', // разрешаем запросы с любого origin, вместо * здесь может быть ОДИН origin
  optionsSuccessStatus: 200, // на preflight-запрос OPTIONS отвечать кодом ответа 200
};
const pathToAppDist = '/postman/dist/postman/';
const logPath = path.join(__dirname, '_server.log');
const historyPath = path.join(__dirname, 'data/history.json');
const uploadDataPath = path.join(__dirname, 'data/upload-data.json');
const uploadDirPath = path.join(__dirname, 'uploaded');
let serverUrl;
// Set configurations for development or production
if (process.env.NODE_ENV === 'production') {
  serverUrl = `http://178.172.195.18:${PORT}`;
} else {
  serverUrl = `http://localhost:${PORT}`;
}

const webSocketServer = new WebSocket.Server({ port: WS_PORT });
logLineAsync(`Websocket server has been created on port ${WS_PORT}`, logPath);
let webSocketClients = [];

webServer.use(express.urlencoded({ extended: true }));
webServer.use(express.json({ extended: true }));
webServer.use(cors(CORS_OPTIONS));
webServer.use((req, res, next) => {
  logLineAsync(`[${PORT}] url=${req.originalUrl} called`, logPath);
  next();
});
webServer.use(express.static(process.cwd() + pathToAppDist));

webServer.get(`${API}/histories`, (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=0');
  res.setHeader('Content-Type', 'application/json');
  
  try {
    const historyJson = fs.readFileSync(historyPath, 'utf-8');
    logLineAsync(`[${PORT}] history was send`, logPath);
    res.status(200).send(historyJson).end();
  } catch (e) {
    logLineAsync(`[${PORT}] history is not exist return null`, logPath);
    res.status(204).send([]).end();
  }
});

webServer.get(`${API}/histories/:id`, (req, res) => {
  const { id } = req.params;
  
  if (!checkIdValidity(id, logPath, PORT)) {
    return res.status(422).send().end();
  }
  
  res.setHeader('Cache-Control', 'public, max-age=0');
  res.setHeader('Content-Type', 'application/json');
  
  try {
    const historyJson = fs.readFileSync(historyPath, 'utf-8');
    const histories = JSON.parse(historyJson);
    const response = histories.find(history => history.id === id);
    
    if (response) {
      logLineAsync(`[${PORT}] history id=${id} was send`, logPath);
      res.send(JSON.stringify(response)).end();
    } else {
      logLineAsync(`[${PORT}] history id=${id} was not found`, logPath);
      return res.status(404).end();
    }
  } catch (e) {
    logLineAsync(`[${PORT}] history is not exist return null`, logPath);
    res.status(204).send([]).end();
  }
});

webServer.delete(`${API}/histories/:id`, (req, res) => {
  const { id } = req.params;
  
  if (!checkIdValidity(id, logPath, PORT)) {
    return res.status(422).send().end();
  }
  
  let history;
  try {
    const historyJson = fs.readFileSync(historyPath, 'utf-8');
    history = JSON.parse(historyJson);
  } catch (e) {
    return res.status(422).end();
  }
  
  const findIndex = history.findIndex(history => history.id === id);
  if (findIndex === -1) {
    return res.status(404).end('History not found');
  }
  
  history.splice(findIndex, 1);
  try {
    fs.writeFileSync(historyPath, JSON.stringify(history), 'utf-8');
    logLineAsync(`[${PORT}] history file was successfully deleted`, logPath);
  } catch (e) {
    logLineAsync(`[${PORT}] ERROR of deleting history`, logPath);
    return res.status(422).end();
  }
  
  res.status(204).end();
});

webServer.post(`${API}/requests`, async (req, res) => {
  const { type, url, body, headers } = req.body;
  const newHistory = { ...req.body, id: getNewId(), created: new Date() };
  
  const options = {
    method: type,
    credentials: "same-origin",
  };
  // set Headers
  if (headers) {
    options.headers = headers;
  }
  // set Body, but not for GET, if so body ignores
  if (body && type !== 'GET') {
    options.body = body;
  }
  
  logLineAsync(`[${PORT}] proxy called for url=${url}, method ${type} ${!!headers ? 'with headers' : ''} ${!!headers && !!options.body ? 'and' : ''} ${!!options.body ? 'with body' : ''}`, logPath);
  
  let proxy_response;
  try {
    proxy_response = await fetch(url, options);
  } catch (e) {
    logLineAsync(`[${PORT}] ERROR, fetch request return error`, logPath);
    res.status(400).end();
  }
  
  let responseText;
  try {
    responseText = await proxy_response.text();
  } catch (e) {
    responseText = 'Failed to parse response text';
  }
  
  const headersArr = [];
  proxy_response.headers.forEach((value, name) => {
    headersArr.push(`${name}: ${value}`);
  }, this);
  
  const response = {
    responseText,
    contentType: proxy_response.headers.get('content-type'),
    headers: headersArr,
    status: proxy_response.status,
    statusText: proxy_response.statusText,
    url: proxy_response.url,
  };
  
  res.setHeader('Cache-Control', 'public, max-age=0');
  res.setHeader('Content-Type', 'application/text');
  
  res.send(JSON.stringify(response));
  
  let history;
  try {
    const historyJson = fs.readFileSync(historyPath, 'utf-8');
    history = JSON.parse(historyJson);
  } catch (e) {
    history = [];
  }
  
  history.push(newHistory);
  try {
    fs.writeFileSync(historyPath, JSON.stringify(history), 'utf-8');
    logLineAsync(`[${PORT}] history file was successfully updated`, logPath);
  } catch (e) {
    logLineAsync(`[${PORT}] ERROR of saving history`, logPath);
  }
  
  res.end();
});

webServer.get(`${API}/list-of-upload-files`, (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=0');
  res.setHeader('Content-Type', 'application/json');
  
  if (fs.existsSync(uploadDataPath)) {
    try {
      const uploadDataJson = fs.readFileSync(uploadDataPath, 'utf-8');
      logLineAsync(`[${PORT}] uploadData was send`, logPath);
      const uploadData = JSON.parse(uploadDataJson);
      res.status(200).send(uploadData.map(el => createSecureUploadData(el))).end();
    } catch (e) {
      logLineAsync(`[${PORT}] ERROR of reading uploadData`, logPath);
      return res.status(422).end();
    }
  } else {
    logLineAsync(`[${PORT}] uploadData not exist, sent null`, logPath);
    res.status(204).send([]).end();
  }
});

webServer.get(`${API}/upload-file/:id`, (req, res) => {
  const { id } = req.params;
  let uploadData;
  
  try {
    const uploadDataJson = fs.readFileSync(uploadDataPath, 'utf-8');
    uploadData = JSON.parse(uploadDataJson);
  } catch (e) {
    logLineAsync(`[${PORT}] ERROR of reading uploadData`, logPath);
    return res.status(422).end();
  }
  
  const uploadFile = uploadData.find(data => id in data);
  
  if (uploadFile) {
    const { newFilePath, totalLength, originalName } = uploadFile[id];
    
    if (fs.existsSync(newFilePath)) {
      try {
        const fileName = encodeURI(originalName);
        
        res.setHeader('Cache-Control', 'private, max-age=0');
        res.setHeader('Content-Length', totalLength);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        
        res.download(newFilePath, fileName, (err) => {
          if (err) {
            logLineAsync(`[${PORT}] ERROR in process of upload file: "${originalName}"`, logPath);
          } else {
            logLineAsync(`[${PORT}] successful upload of file: "${originalName}"`, logPath);
          }
        });
      } catch (e) {
        logLineAsync(`[${PORT}] ERROR of sending file from: ${newFilePath}`, logPath);
        return res.status(422).end();
      }
    } else {
      logLineAsync(`[${PORT}] ERROR, file does not exist on path: ${newFilePath}`, logPath);
      res.status(404).end();
    }
  } else {
    logLineAsync(`[${PORT}] ERROR, file for id: ${id} does not exist in upload data`, logPath);
    res.status(404).end();
  }
});

webServer.delete(`${API}/upload-file/:id`, (req, res) => {
  const { id } = req.params;
  let uploadData;
  
  try {
    const uploadDataJson = fs.readFileSync(uploadDataPath, 'utf-8');
    uploadData = JSON.parse(uploadDataJson);
  } catch (e) {
    logLineAsync(`[${PORT}] ERROR of reading uploadData`, logPath);
    return res.status(422).end();
  }
  
  const uploadFileIndex = uploadData.findIndex(data => id in data);
  
  if (uploadFileIndex >= 0) {
    const removedUploadFile = uploadData.splice(uploadFileIndex, 1)[0];
    const { newFilePath: removedFilePath, originalName } = removedUploadFile[id];
    
    if (fs.existsSync(removedFilePath)) {
      try {
        fs.unlink(removedFilePath, err => {
          if (err) {
            logLineAsync(`[${PORT}] ERROR in deleting of file: "${originalName}", path: ${removedFilePath}`, logPath);
            res.status(422).end();
          } else {
            logLineAsync(`[${PORT}] file was deleted: "${originalName}", path: ${removedFilePath}`, logPath);
            fs.writeFileSync(uploadDataPath, JSON.stringify(uploadData), 'utf-8');
            logLineAsync(`[${PORT}] upload data was successfully updated`, logPath);
            res.status(200).end();
          }
        });
      } catch (e) {
        logLineAsync(`[${PORT}] ERROR occurred while deleting of file: "${originalName}", path: ${removedFilePath}`, logPath);
        res.status(422).end();
      }
    } else {
      logLineAsync(`[${PORT}] ERROR, file does not exist on path: ${removedFilePath}`, logPath);
      res.status(404).end();
    }
  } else {
    logLineAsync(`[${PORT}] ERROR finding file with id: ${id} in upload data`, logPath);
    res.status(404).end();
  }
});

webServer.post(`${API}/upload-file`, busboy(), async (req, res) => {
  let uploadData;
  if (fs.existsSync(uploadDataPath)) {
    try {
      const uploadDataJson = fs.readFileSync(uploadDataPath, 'utf-8');
      uploadData = JSON.parse(uploadDataJson);
    } catch (e) {
      logLineAsync(`[${PORT}] ERROR of reading uploadData`, logPath);
      return res.status(422).end();
    }
  } else {
    uploadData = [];
  }
  
  const token = req.headers['custom-token'];
  const totalFileLength = +req.headers['file-length'];
  
  const webSocketClient = webSocketClients.find(client => client.token === token);
  if (webSocketClient) {
    logLineAsync(`[${WS_PORT}] started to send data for client ${token}`, logPath);
  }
  
  let totalDownloaded = 0;
  let reqFields = {};
  let reqFiles = {};
  let newFileName;
  let newFilePath;
  
  req.pipe(req.busboy);// перенаправляем поток приёма ответа в busboy
  
  req.busboy.on('field', (fieldName, value) => {
    reqFields[fieldName] = value;
  });
  
  req.busboy.on('file', (fieldName, file, originalName, mimetype) => {
    do {
      newFileName = getNewId();
      newFilePath = path.resolve(uploadDirPath, newFileName);
    } while (fs.existsSync(newFilePath));
    
    reqFiles[newFileName] = { originalName, newFilePath };
    logLineAsync(`[${PORT}] uploading of ${originalName} started`, logPath);
    
    const writeStream = fs.createWriteStream(newFilePath);
    file.pipe(writeStream);
    
    file.on('data', data => {
      totalDownloaded += data.length;
      if (webSocketClient) {
        const progress = Math.round(totalDownloaded / totalFileLength * 100);
        webSocketClient.connection.send(`progress:${progress}`);
        webSocketClient.keepAliveTo = addTimeFromNow(7);
      }
    });
    
    file.on('end', () => {
      logLineAsync(`[${PORT}] file ${originalName} was received`, logPath);
      reqFiles[newFileName].totalLength = totalDownloaded;
      
      if (webSocketClient) {
        logLineAsync(`[${WS_PORT}] finished to send data for client ${token}`, logPath);
      }
    });
  });
  
  req.busboy.on('finish', () => {
    logLineAsync(`[${PORT}] download complete!`, logPath);
    reqFiles[newFileName].comment = reqFields.comment;
    uploadData.push(reqFiles);
    try {
      fs.writeFileSync(uploadDataPath, JSON.stringify(uploadData), 'utf-8');
      logLineAsync(`[${PORT}] upload data file was successfully updated`, logPath);
    } catch (e) {
      logLineAsync(`[${PORT}] ERROR of saving upload data`, logPath);
      return res.status(422).end;
    }
    
    if (webSocketClient) {
      webSocketClient.connection.terminate();
      logLineAsync(`[${WS_PORT}] connection with client ${token} was closed`, logPath);
      webSocketClient.active = false;
    }
    
    res.status(200).send(createSecureUploadData(reqFiles)).end();
  });
});

webServer.post(`${API}/sign-in`, async (req, res) => {
  const { email, password } = req.body?.user;
  if (!(email && password)) {
    logLineAsync(`[${PORT}] ERROR request for sign-up, missing data`, logPath);
    return res.status(400).end();
  }
  
  // bcrypt.compare(pass, hash, function(error, isMatch) {
  //   if (error) {
  //     console.log(error);
  //   } else if (!isMatch) {
  //     console.log("Password doesn't match!")
  //   } else {
  //     console.log("Password matches!")
  //   }
  // });
});

webServer.post(`${API}/sign-up`, async (req, res) => {
  const { email, password, surname, name } = req.body?.user;
  res.setHeader('Content-Type', 'application/json');
  
  if (!(email && password && surname && name)) {
    logLineAsync(`[${PORT}] ERROR request for new user, missing data`, logPath);
    return res.status(400).send('MESSAGE_ERROR_FOR_USER').end();
  }
  
  const sid = getRandomString(50);
  
  try {
    await Users.createANewUser({ email, password, surname, name, sid });
    logLineAsync(`[${PORT}] new user "${email}" was saved in database`, logPath);
  } catch (e) {
    logLineAsync(`[${PORT}] ERROR saving user "${email}" in database`, logPath);
    return res.status(400).send('MESSAGE_ERROR_FOR_USER').end();
  }

  let link = `${serverUrl}/confirmation-email?sid=${sid}`;

  sendEmail(email, { name, surname, link })
    .then( () => logLineAsync(`[${PORT}] email for "${email}" was sent`, logPath))
    .catch( err => {
      logLineAsync(`[${PORT}] ERROR sending email for "${email}", text: ${shortMessage(err)}`, logPath);
      return res.status(400).send('MESSAGE_ERROR_SENT_EMAIL_FOR_USER').end();
    });
  
  MESSAGE_SUCCESS_FOR_USER.sid = sid;
  res.status(200).send(MESSAGE_SUCCESS_FOR_USER).end();
});

webServer.get('/confirmation-email', (req, res) => {
  console.log(req.query);
  
  res.setHeader('Content-Type', 'text/html; charset=UTF-8');
  res.setHeader('Cache-Control','public, max-age=60');
  
  res.status(200).send(createConfirmationPage(serverUrl)).end();
});

webServer.get('*', (req, res) => {
  res.sendFile(process.cwd() + pathToAppDist + 'index.html');
});

webServer.listen(PORT, () => {
  logLineAsync(`Backend server has been started on port ${PORT} in ${process.env.NODE_ENV} mode ......`, logPath);
});

webSocketServer.on('connection', connection => {
  logLineAsync(`[${WS_PORT}] new websocket connection established`, logPath);
  let newClient;
  
  connection.on('message', data => {
    const message = data.toString();
    if (message.startsWith('TOKEN')) {
      if (webSocketClients.some(client => client.token === message)) {
        connection.terminate();
        logLineAsync(`[${WS_PORT}] there are too many connections for client ${message}. Connection was terminated`, logPath);
      } else {
        newClient = { connection, token: message, keepAliveTo: addTimeFromNow(7), active: true };
        webSocketClients.push(newClient);
        logLineAsync(`[${WS_PORT}] new client ${newClient.token} was added`, logPath);
        connection.send('321start');
      }
    } else {
      logLineAsync(`[${WS_PORT}] message from client received. Message: ${shortMessage(message)}`, logPath);
    }
  });
  
  connection.on('error', error => {
    logLineAsync(`[${WS_PORT}] ERROR: ${shortMessage(error, 50)}`, logPath);
  });
});

setInterval(() => {
  webSocketClients = webSocketClients.filter(client => client.active);
  webSocketClients.forEach(client => {
    if (Date.now() > client.keepAliveTo) {
      client.connection.terminate();
      client.active = false;
      logLineAsync(`[${WS_PORT}] connection with client ${client.token} was closed due to inactivity`, logPath);
    }
  });
}, 1000);
