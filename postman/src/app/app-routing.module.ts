import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './ui/home-page/home-page.component';
import { NotFoundPageComponent } from './ui/not-found-page/not-found-page.component';
import { WorkPageComponent } from './ui/work-page/work-page.component';
import { AuthEnum, RouteEnum } from './app-routing.constant';
import { StoragePageComponent } from './ui/storage-page/storage-page.component';
import { AuthPageComponent } from './ui/auth-page/auth-page.component';
import { ForgotPasswordPageComponent } from './ui/auth-page/forgot-password-page/forgot-password-page.component';

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
    path: RouteEnum.AUTH, redirectTo: `${RouteEnum.AUTH}/${AuthEnum.LOG_IN}`, pathMatch: 'full',
  },
  {
    path: RouteEnum.AUTH,
    children: [
      {
        path: AuthEnum.SIGN_UP,
        component: AuthPageComponent,
        // ToDo add guard here
        canActivate: [],
      },
      {
        path: AuthEnum.LOG_IN,
        component: AuthPageComponent,
        // ToDo add guard here
        canActivate: [],
      },
      {
        path: AuthEnum.FORGOT_PSWD,
        component: ForgotPasswordPageComponent,
        // ToDo add guard here
        canActivate: [],
      },
    ],
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
