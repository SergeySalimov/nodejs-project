import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './ui/home-page/home-page.component';
import { NotFoundPageComponent } from './ui/not-found-page/not-found-page.component';
import { WorkPageComponent } from './ui/work-page/work-page.component';
import { RouteEnum } from './app-routing.constant';
import { StoragePageComponent } from './ui/storage-page/storage-page.component';

const routes: Routes = [
  {
    path: '', redirectTo: RouteEnum.WORK, pathMatch: 'full',
  },
  {
    path: RouteEnum.HOME, component: HomePageComponent,
  },
  {
    path: `${RouteEnum.WORK}/:id`, component: WorkPageComponent,
  },
  {
    path: RouteEnum.WORK, component: WorkPageComponent,
  },
  {
    path: RouteEnum.STORAGE, component: StoragePageComponent,
  },
  {
    path: '**', component: NotFoundPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
