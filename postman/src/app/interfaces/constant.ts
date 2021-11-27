// ToDo create interceptor for adding this to each request
export const ROOT_URL = '/api';

export enum RequestTypeEnum {
  GET = 'GET',
  POST = 'POST',
}

export enum UploadStatusEnum {
  READY = 'READY',
  PROGRESS = 'PROGRESS',
  DONE = 'DONE',
  ERROR = 'ERROR'
}

export enum EYesOrNo {
  YES = 'Yes',
  NO = 'No',
}

export const TIMER_FOR_ERROR_MESSAGE = 5;
export const TIMER_FOR_INFO_MESSAGE = 3;

export const URL_REGEXP = 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)';
// export const URL_REGEXP = '(?:^|\\s)((https?:\\/\\/)?(?:localhost|[\\w-]+(?:\\.[\\w-]+)+)(:\\d+)?(\\/\\S*)?)';
