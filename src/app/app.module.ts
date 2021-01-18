import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SocialLoginModule, AuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { Ng5SliderModule } from 'ng5-slider';
import { NotifierModule, NotifierOptions } from "angular-notifier";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSpinner } from '@angular/material/progress-spinner';
import { OverlayModule } from '@angular/cdk/overlay';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TagInputModule } from 'ngx-chips';
import { TagsComponent } from './pages/tags/tags.component';
import { TagComponent } from './pages/tags/tag-item/tag-item.component';
import { GreetingComponent } from './pages/greeting/greeting.component';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { MailingSettingsComponent } from './pages/mailing/mailing.component';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AppInitService } from './services/app-init.service';
import { ArticlesComponent } from './pages/articles/articles.component';
import { AuthGuardService as AuthGuard } from './services/auth-guard.service';
import { ErrorInterceptorService } from './services/error-interceptor.service';
import { LoadingInterceptorService } from './services/loading-interceptor.service';
import { UnsubscribeComponent } from './pages/unsubscribe/unsubscribe.component';
import { ViewPdfComponent } from './pages/view-pdf/view-pdf.component';
import { ArticleComponent } from './pages/articles/article/article.component';
import uk from '@angular/common/locales/uk';
import { registerLocaleData } from '@angular/common';
import { AdminComponent } from './pages/admin/admin.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

registerLocaleData(uk);

const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("519534075171-pdlfq0736fac74ueoijag6vc837pk5r5.apps.googleusercontent.com")
  },
]);
export function provideConfig() {
  return config;
}

export function appInit(appInitService: AppInitService) {
  return () => appInitService.Init();
}

const appRoutes: Routes = [
  { path: '', redirectTo: 'greeting', pathMatch: 'full' },
  { path: 'greeting', component: GreetingComponent },
  { path: 'tags', component: TagsComponent, canActivate: [AuthGuard] },
  { path: 'mailing', component: MailingSettingsComponent, canActivate: [AuthGuard] },
  { path: 'articles/:articleId/user/:userId', component: ViewPdfComponent },
  { path: 'articles/sent', component: ArticlesComponent, data: { lastSent: true }, canActivate: [AuthGuard] },
  { path: 'articles', component: ArticlesComponent, canActivate: [AuthGuard] },
  { path: 'unsubscribe/:token', component: UnsubscribeComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', component: NotFoundComponent }
];

const notifierDefaultOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: "right",
      distance: 12
    },
    vertical: {
      position: "bottom",
      distance: 12,
      gap: 10
    }
  },
  theme: "material",
  behaviour: {
    autoHide: 5000,
    onClick: "hide",
    onMouseover: "pauseAutoHide",
    showDismissButton: false,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: "slide",
      speed: 300,
      easing: "ease"
    },
    hide: {
      preset: "fade",
      speed: 300,
      easing: "ease",
      offset: 50
    },
    shift: {
      speed: 300,
      easing: "ease"
    },
    overlap: 150
  }
};

@NgModule({
  declarations: [
    AppComponent,
    TagsComponent,
    TagComponent,
    GreetingComponent,
    MailingSettingsComponent,
    TagsComponent,
    NotFoundComponent,
    ArticlesComponent,
    UnsubscribeComponent,
    ViewPdfComponent,
    ArticleComponent,
    AdminComponent,
  ],
  imports: [
    Ng5SliderModule,
    NotifierModule.withConfig(notifierDefaultOptions),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    TagInputModule,
    HttpClientModule,
    SocialLoginModule.initialize(config),
    RouterModule.forRoot(appRoutes),
    MatProgressSpinnerModule,
    OverlayModule,
    PdfViewerModule,
    NgbModule,

    // ngx-translate and the loader module
    HttpClientModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    })
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
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptorService,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appInit,
      multi: true,
      deps: [AppInitService]
    },
    {
      provide: LOCALE_ID,
      useValue: "uk-UA"
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [MatSpinner],
})
export class AppModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
