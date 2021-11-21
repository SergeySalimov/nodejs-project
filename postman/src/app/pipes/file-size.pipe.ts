import { Pipe, PipeTransform } from '@angular/core';

type Unit = 'bytes' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB';

const defaultPrecisionMap: Record<Unit, number> = {
  bytes: 0,
  KB: 0,
  MB: 1,
  GB: 1,
  TB: 2,
  PB: 2
};

@Pipe({
  name: 'fileSize',
})
export class FileSizePipe implements PipeTransform {
  units = Object.keys(defaultPrecisionMap);

  transform(bytes: number = 0, precision: number | Record<Unit, number> = defaultPrecisionMap): string {
    if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes)) {
      return '?';
    }

    let unitIndex = 0;
    while (bytes >= 1024) {
      bytes /= 1024;
      unitIndex++;
    }
    const unit = this.units[unitIndex];

    return typeof precision === 'number'
      ? `${bytes.toFixed(precision)} ${unit}`
      : `${bytes.toFixed(precision[unit])} ${unit}`;
  }
}
