import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UIModule } from './ui/ui.module';
import { HttpClientModule } from '@angular/common/http';
import { PostmanService } from './services/postman.service';
import { UiStateService } from './services/ui-state.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    UIModule,
  ],
  providers: [PostmanService, UiStateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
