import { KeyValueInterface, RequestForm } from '../../interfaces/interfaces.vm';
import { History, RequestDto } from '../../interfaces/interfaces.dto';

export class WorkPageHelper {
  static translateFormDataToRequestDto(data: RequestForm): RequestDto {
    const { type, url, body, headers: headersForm } = data;
    let headers: Record<string, string> | null = {};
    headersForm.length === 0
      ? headers = null
      : headersForm.forEach((header: KeyValueInterface) => headers[header.key] = header.value);

    return {type, url, body, headers};
  }

  static translateHistoryToFormData(data: History): RequestForm {
    const headers = [];

    if (data.headers) {
      for (const [key, value] of Object.entries(data.headers)) {
        headers.push({ key, value });
      }
    }

    return {
      headers,
      type: data.type,
      url: data.url,
      body: data.body,
      id: data.id,
    };
  }
}
