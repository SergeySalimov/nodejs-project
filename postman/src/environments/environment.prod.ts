import { RouteEnum } from '../app/app-routing.constant';

export const environment = {
  production: true,
  webSocketUrl: 'ws://178.172.195.18:7781',
  URL_AFTER_LOGIN: `/${RouteEnum.STORAGE}`,
};
