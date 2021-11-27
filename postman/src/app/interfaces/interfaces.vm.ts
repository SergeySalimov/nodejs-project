import { RequestTypeEnum } from './constant';

export interface KeyValueInterface {
  key: string;
  value: string;
}

export interface RequestForm {
  url: string;
  type: RequestTypeEnum;
  headers: KeyValueInterface[];
  body: string;
  query?: KeyValueInterface[];
  id?: string;
}

export interface AboutData {
  name: string;
  link: string;
  description?: string;
}

export interface About {
  content: string;
  data: AboutData[];
}
