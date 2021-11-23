import nodemailer from "nodemailer";
import { mailer_fromEmail, mailer_transport_config } from "../credentials/mail-credential";
import { removeTags } from "./helper-es6";

const SUBJECT = 'Подтверждение пароля для MINI POSTMAN';
const BODY = `
<h4>Добро пожаловать %NAME %SURNAME.</h4><br/>
<p>Подтвердите пожалуйста вашу авторизацию на сайте MINI POSTMAN перейдя по ссылке:<br/>
<strong><a href="%LINK" target="_blank">%LINK</a></strong><br/>
</p>`;

function sendEmail(recipientEmail, data) {
  const { name, surname, link } = data;
  
  if (!link) {
    return Promise.reject('No link provided');
  }
  
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport(mailer_transport_config);
    
    const body = BODY
      .replace('%NAME', name ?? 'Уважаемый')
      .replace('%SURNAME', surname ?? 'Незнакомец')
      .replace('%LINK', link)
      .replace('%LINK', link)
    ;
    
    let text = body;
    let html = undefined;
    let textWOTags = removeTags(text);
    if (textWOTags !== text) { // если теги есть - отправляем две разных версии письма, HTML и текстовую; если тегов нет - только текстовую
      text = textWOTags;
      html = body;
    }
    
    let message = {
      from: mailer_fromEmail, // с какого ящика идёт отправка (емейл отправителя), может не совпадать с mailer_transportConfig.auth
      to: recipientEmail,
      subject: SUBJECT,
      text: text, // текстовая версия письма
      html: html, // HTML-версия письма
    };
    
    transporter.sendMail(message, (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
}

const createConfirmationPage = (link, status) => {
  let header, btnStyle, btnMessage;
  switch (status) {
    case 'already':
      header = 'Ваша почта уже была подтверждена!';
      btnStyle = 'btn-outline-warning';
      btnMessage = 'Перейти на сайт';
      break;
    case 'error':
      header = 'Ошибка подтверждения почты!';
      btnStyle = 'btn-warning';
      btnMessage = 'Попробовать снова';
      break;
    case 'done':
    default:
      header = 'Ваша почта была подтверждена!';
      btnStyle = 'btn-outline-primary';
      btnMessage = 'Перейти на сайт';
  }
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Confirmation page</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
</head>
<body>
<div class="container">
    <div class="row">
        <div class="col-sm-12 mt-5 text-center">
            <h1>${header}</h1>
            <a href="${link}">
                <button type="button" class="btn ${btnStyle} btn-lg mt-3">
                ${btnMessage}
                </button>
            </a>
        </div>
    </div>
</div>
</body>
</html>
`;
};

const MESSAGE_SUCCESS_FOR_USER = {
  message: 'На вашу почту было выслано письмо для подтверждения. Пройдите, пожалуйста, на ваш почтовый ящик и перейдите по ссылке указанной в письме для завершения регистрации',
  error: false,
};
const MESSAGE_ERROR_FOR_USER = {
  message: 'Произошла ошибка! Попробуйте произвести аутентификацию еще раз',
  error: true,
};
const MESSAGE_ERROR_SENT_EMAIL_FOR_USER = {
  message: 'К сожалению письмо для пожтверждения не было выслано',
  error: true,
};

export {
  sendEmail,
  createConfirmationPage,
  MESSAGE_SUCCESS_FOR_USER,
  MESSAGE_ERROR_FOR_USER,
  MESSAGE_ERROR_SENT_EMAIL_FOR_USER,
}
