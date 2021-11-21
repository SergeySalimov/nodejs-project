import { FileSizePipe } from './file-size.pipe';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [FileSizePipe],
  exports: [FileSizePipe],
})
export class PipesModule {
}
