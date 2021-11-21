import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomePageComponent } from './home-page/home-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from './shared/loader/loader.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { WorkPageComponent } from './work-page/work-page.component';
import { RequestBlockComponent } from './work-page/request-block/request-block.component';
import { ResponseBlockComponent } from './work-page/response-block/response-block.component';
import { HistoryBlockComponent } from './work-page/history-block/history-block.component';
import { StoragePageComponent } from './storage-page/storage-page.component';
import { PipesModule } from '../pipes/pipes.module';
import { StoragePageUploadComponent } from './storage-page/storage-page-upload/storage-page-upload.component';
import { StoragePageTableComponent } from './storage-page/storage-page-table/storage-page-table.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    HomePageComponent,
    NotFoundPageComponent,
    LoaderComponent,
    WorkPageComponent,
    RequestBlockComponent,
    ResponseBlockComponent,
    HistoryBlockComponent,
    StoragePageComponent,
    StoragePageUploadComponent,
    StoragePageTableComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    PipesModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    HomePageComponent,
    NotFoundPageComponent,
    LoaderComponent,
  ],
})
export class UIModule {
}
