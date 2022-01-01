import { RouteEnum } from '../app/app-routing.constant';

export const environment = {
  production: true,
  webSocketUrl: 'ws://178.172.195.18:7781',
  URL_AFTER_LOGIN: `/${RouteEnum.STORAGE}`,
  MAX_FILE_SIZE: 1 * 1024 * 1024, // 1Mb
  FILES_LIMIT: 10,
};
