import { FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { environment } from '../../../../environments/environment';

export function fileSizeValidator(files: FileList): ValidatorFn {
  return (control: FormControl): ValidationErrors | null => {
    if (!control?.value || !files) {
      return null;
    }
    
    return files.item(0).size > environment.MAX_FILE_SIZE ? {fileSize: true} : null;
  }
}
