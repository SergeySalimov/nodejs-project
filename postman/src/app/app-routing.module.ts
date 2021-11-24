import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './ui/home-page/home-page.component';
import { NotFoundPageComponent } from './ui/not-found-page/not-found-page.component';
import { WorkPageComponent } from './ui/work-page/work-page.component';
import { AuthEnum, RouteEnum } from './app-routing.constant';
import { StoragePageComponent } from './ui/storage-page/storage-page.component';
import { AuthPageComponent } from './ui/auth-page/auth-page.component';
import { ForgotPasswordPageComponent } from './ui/auth-page/forgot-password-page/forgot-password-page.component';
import { AuthGuard } from './services/auth.guard';
import { NoAuthGuard } from './services/no-auth.guard';
import { OptionsPageComponent } from './ui/options-page/options-page.component';

const routes: Routes = [
  {
    path: '', redirectTo: RouteEnum.WORK, pathMatch: 'full',
  },
  {
    path: RouteEnum.HOME, component: HomePageComponent,
  },
  {
    path: `${RouteEnum.WORK}/:id`, component: WorkPageComponent, canActivate: [AuthGuard]
  },
  {
    path: RouteEnum.WORK, component: WorkPageComponent, canActivate: [AuthGuard]
  },
  {
    path: RouteEnum.STORAGE, component: StoragePageComponent, canActivate: [AuthGuard]
  },
  {
    path: RouteEnum.OPTIONS, component: OptionsPageComponent, canActivate: [AuthGuard]
  },
  {
    path: RouteEnum.AUTH, redirectTo: `${RouteEnum.AUTH}/${AuthEnum.LOG_IN}`, pathMatch: 'full', canActivate: [NoAuthGuard]
  },
  {
    path: RouteEnum.AUTH,
    canActivate: [NoAuthGuard],
    children: [
      {
        path: AuthEnum.SIGN_UP,
        component: AuthPageComponent,
      },
      {
        path: AuthEnum.LOG_IN,
        component: AuthPageComponent,
      },
      {
        path: AuthEnum.FORGOT_PSWD,
        component: ForgotPasswordPageComponent,
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
