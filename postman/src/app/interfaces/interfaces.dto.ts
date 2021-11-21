import { RequestTypeEnum } from './constant';

export interface RequestDto {
  type: RequestTypeEnum;
  url: string;
  headers: Record<string, string> | null;
  body?: string;
  query?: string[];
}

export interface ResponseDto {
  status: number;
  statusText: string;
  url: string;
  contentType: string;
  headers: string[];
  responseText: string;
}

export interface History extends RequestDto {
  id: string;
  created: Date;
}

export interface UploadFileDto {
  id: string;
  comment: string;
  originalName: string;
  totalLength: number;
  position?: number;
}

export type HistoryDto = Array<History>;
