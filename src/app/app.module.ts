import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SocialLoginModule, AuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TagInputModule } from 'ngx-chips';
import { TagsSelectorComponent } from './tags-selector/tags-selector.component';
import { TagComponent } from './tag/tag.component';
import { GreetingComponent } from './greeting/greeting.component';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { MailingSettingsComponent } from './mailing-settings/mailing-settings.component';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { TagSettingsComponent } from './tag-settings/tag-settings.component';
import { AppInitService } from './services/app-init.service';
import { ArticlesComponent } from './articles/articles.component';

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("175396273730-4a2qpvrls8vh3kplihb48sdn37ev5vg5.apps.googleusercontent.com")
  },
]);
export function provideConfig() {
  return config;
}

export function appInit(appInitService: AppInitService) {
  return () => appInitService.Login();
}

const appRoutes: Routes = [
  { path: '', redirectTo: 'tags', pathMatch:'full' },
  { path: 'tags', component: TagSettingsComponent },
  { path: 'mailing', component: MailingSettingsComponent },
  { path: 'articles', component: ArticlesComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    TagsSelectorComponent,
    TagComponent,
    GreetingComponent,
    MailingSettingsComponent,
    TagSettingsComponent,
    NotFoundComponent,
    ArticlesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    TagInputModule,
    HttpClientModule,
    SocialLoginModule.initialize(config),
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appInit,
      multi: true,
      deps: [AppInitService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
