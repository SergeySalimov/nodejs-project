import { Component } from '@angular/core';
import { About } from '../../interfaces/interfaces.vm';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss']
})
export class AboutPageComponent {
  about: About[] = [
    {
      content: 'База данных', data:
        [
          {
            name: 'Отдельный слой',
            link: 'https://github.com/SergeySalimov/nodejs-project/tree/master/db',
            description: 'Для проекта выбрана база данных MongoDB. Она размещена в отдельный модуль, в котором находяться модели создаваемых коллекций. В ней производится все операции свзяанные с работой в самой базе данных. Приложение пользуется только готовыми методами.'
          },
          {
            name: 'Модель пользователя',
            link: 'https://github.com/SergeySalimov/nodejs-project/blob/master/db/models/user.model.js',
            description: 'Модель пользователя примечательна тем, что в ней происходит сразу преобразование пароля в соленый хэш, который и сохраняется в базе. Для хэширования пароля используется библиотека bcryptjs'
          },
          {
            name: 'Работа с пользователем',
            link: 'https://github.com/SergeySalimov/nodejs-project/blob/master/db/users.js',
            description: 'Здесь создаются пользователи, проверяется вход авторизированного пользователя, а также здесь проверяется подтверждение пользователем своей почты'
          },
          {
            name: 'Модель сессии',
            link: 'https://github.com/SergeySalimov/nodejs-project/blob/master/db/models/session.model.js',
          },
          {
            name: 'Работа с сессиями',
            link: 'https://github.com/SergeySalimov/nodejs-project/blob/master/db/session.js#L13',
            description: 'Создание и обновлении сессии и получение токена для пользователя, сохранение данных по сессии в базе данных'
          },
        ],
    },
    {
      content: 'Скорость', data:
        [
          {
            name: 'Настроено кэширование ответов на get запросы на Express',
            link: 'https://github.com/SergeySalimov/nodejs-project/blob/master/main.js#L67',
          },
          {
            name: 'Настроено кэширование ответов на post запросы на Express',
            link: 'https://github.com/SergeySalimov/nodejs-project/blob/master/main.js#L189',
          },
          {
            name: 'Также настроено кэширование на Nginx',
            link: 'https://github.com/SergeySalimov/nodejs-project/blob/master/nginx_conf/nodejs-project.conf#L46',
            description: 'Краткое описание'
          },
        ],
    },
    {
      content: 'Живучесть', data:
        [
          {
            name: 'Использование блоков try catch',
            link: 'https://github.com/SergeySalimov/nodejs-project/blob/master/main.js',
            description: 'В своем приложении я постарался везде где только оно может выпасть с ошибкой использовать блок try catch.' +
              ' Все ошибки логируются для возможности отслеживания мест, в которых они происходят'
          },
          {
            name: 'Восстановление при перезагрузке',
            link: 'https://github.com/SergeySalimov/nodejs-project/blob/master/starter.sh',
            description: 'Для восстановления при перезагрузке сервера был создан скрипт который перезапускает приложение.' +
              ' Данный скрипт обеспечен всеми правами для запуска и помещен в планировщик задач cron по условию запуска при перезагрузке' +
              ' @reboot /home/user/nodejs-project/starter.sh'
          },
        ],
    },
    {
      content: 'SEO', data:
        [
          {
            name: 'Динамическое создание title, meta keywords, description для каждой страницы через сервис',
            link: 'https://github.com/SergeySalimov/nodejs-project/blob/master/postman/src/app/app-routing.module.ts#L19',
            description: 'В зависимости от выбранного роута, через seo.service подставляется значение для title, keywords ' +
              'и description. Соответственно каждая страница будет иметь свои значения для этих переменных, и у каждой страницы в head они будут различаться.'
          },
          {
            name: 'Создание файла robots.txt',
            link: 'https://github.com/SergeySalimov/nodejs-project/blob/master/main.js#L527',
            description: 'Файл создается в зависимости от типа переменной среды NODE_ENV'
          },
          {
            name: 'Создание файла sitemap.xml',
            link: 'https://github.com/SergeySalimov/nodejs-project/blob/master/main.js#L537',
            description: 'Для создания файла используется библиотека sitemap, т.к. в моем приложении только 3 общедоступных роута, я их создаю напрямую'
          },
          {
            name: 'Сам sitemap.xml',
            link: '/sitemap.xml',
          },
          {
            name: 'Сам robots.txt',
            link: '/robots.txt',
          },
        ],
    },
    {
      content: 'Почтовый сервис', data:
        [
          {
            name: 'ВАЖНОЕ ЗАМЕЧАНИЕ',
            link: 'https://forums.aws.amazon.com/thread.jspa?threadID=37650',
            description: 'Из-за политики безопастности AWS, я не стал писать дополнительные письма для того чтобы полностью сделать доступным 465 порт для SMPTS, а сделал в приложении автоматическое регистрирование пользователей.',
          },
          {
            name: 'Почтовый сервис',
            link: 'https://github.com/SergeySalimov/nodejs-project/blob/master/share/send-email.js#L12',
            description: 'Для подтверждения пользователем своего почтового адреса ему производится отправка письма на его электронный ящик',
          },
          {
            name: 'Страница подтверждения',
            link: 'https://github.com/SergeySalimov/nodejs-project/blob/master/share/send-email.js#L55',
            description: 'Страница которая отображается для подтверждения электронного адреса',
          },
        ],
    },
    {
      content: 'Бэкапы', data:
        [
          {
            name: 'Настройка ежедневного сохранения через крон',
            link: 'https://github.com/SergeySalimov/nodejs-project/blob/master/cron/cron.commands#L27',
            description: 'Каждый день по расписанию: в 03:01 запускается удаление файлов из папки бэкапов старше 10 дней , а далее в 03:05 запускается создание бэкапа базы данных в файл с именем YY-MM-DD',
          },
          {
            name: 'Скрипт для сохрания базы данных',
            link: 'https://github.com/SergeySalimov/nodejs-project/blob/master/db/scripts/create-dump.sh',
            description: 'Сохраняет базу данных postman в архив в папку backups, название файла соответсвует текущей дате',
          },
          {
            name: 'Скрипт удаления старых архивов',
            link: 'https://github.com/SergeySalimov/nodejs-project/blob/master/db/scripts/delete-old-files.sh',
            description: 'Удаление всех файлов из папки, без удаления самой папки, для файлов старше 10 дней',
          },
          {
            name: 'Поиск самого свежего архива базы',
            link: 'https://github.com/SergeySalimov/nodejs-project/blob/master/work-tools/backup-helper.js',
            description: 'Данная программа осуществляет поиск в папке backups самого свежего архива и копирует его в файл recovery.gz',
          },
          {
            name: 'Запуск восстановления базы данных из бэкапа',
            link: 'https://github.com/SergeySalimov/nodejs-project/blob/master/package.json#L13',
          },
        ],
    },
    {
      content: 'Nginx', data:
        [
          {
            name: 'Использование nginx',
            link: 'https://github.com/SergeySalimov/nodejs-project/blob/master/nginx_conf/nodejs-project-amazon.conf',
            description: 'Это моя конфигурация для сервера ngnix. Запросы к express которые все начинаются с /api/ проксируются на порт на котором работает экспресс, а для Ангулар приложения сделано что оно отдается как статика из папки. Файлы отдаются в сжатом виде. Предварительно они сжимаются автокомпрессором. Логи сохраняются в отдельную папку, формат логов перенастроен.',
          },
          {
            name: 'Компрессор для содержимого папки',
            link: 'https://github.com/SergeySalimov/nodejs-project/blob/master/work-tools/autocompressor/autozip.js#L48',
          },
        ],
    },
    {
      content: 'Администартивный интерфейс', data:
        [
          {
            name: 'Регистрация нового пользователя',
            link: 'https://github.com/SergeySalimov/nodejs-project/blob/master/main.js#L469',
            description: 'После регистрации нового пользователя, на электронный адресс, высылается письмо для подтверждения почты',
          },
          {
            name: 'Вход для авторизированного пользователя',
            link: 'https://github.com/SergeySalimov/nodejs-project/blob/master/main.js#L412',
            description: 'После подтверждения почты, пользователь может залогониться в приложение. Когда пользователь ввел правильные данные, то для работы с приложением ему высылается токен.'
          },
          {
            name: 'Подтверждение электронного адреса',
            link: 'https://github.com/SergeySalimov/nodejs-project/blob/master/main.js#L509',
          },
        ],
    },
    {
      content: 'Тесты', data:
        [
          {
            name: 'Валидация входящих данных',
            link: 'https://github.com/SergeySalimov/nodejs-project/blob/master/share/helper-es6.js#L80',
            description: 'В данном примере проверяется id присылаемый на сервер на соответсвие типу данных и наличию правильных данных и длинны'
          },
        ],
    },
    {
      content: 'Websocket', data:
        [
          {
            name: 'Инициализация вебсокета',
            link: 'https://github.com/SergeySalimov/nodejs-project/blob/master/main.js#L578',
          },
          {
            name: 'загрузка файлов на сервер',
            link: 'https://github.com/SergeySalimov/nodejs-project/blob/master/main.js#L325',
          },
          {
            name: 'выгрузка файлов с сервера',
            link: 'https://github.com/SergeySalimov/nodejs-project/blob/master/main.js#L213',
          },
          {
            name: 'удаление файлов с сервера',
            link: 'https://github.com/SergeySalimov/nodejs-project/blob/master/main.js#L280',
          },
        ],
    },
  ];
}
