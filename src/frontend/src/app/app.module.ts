import { APP_INITIALIZER, ErrorHandler, Injector, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RoutingModule } from './app-routing.module';
import { PortalModule } from './portal/portal.module';
import { AdminModule } from './admin/admin.module';
import { AuthService } from './shared/auth/auth.service';
import { AuthModule } from './shared/auth-module/auth.module';
import { httpStatusCode } from './shared/shared.const';
import { Router } from '@angular/router';
import * as Raven from 'raven-js';
import { PodTerminalModule } from './portal/pod-terminal/pod-terminal.module';
import { environment } from '../environments/environment';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './shared/interceptor/auth-interceptor';
// translate
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
const packageJson = require('../../package.json');
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json?v=' + packageJson.version);
}

export function initUser(authService: AuthService, injector: Injector) {
  return () => authService.retrieveUser().then(() => {
  }).catch(error => {
    const router = injector.get(Router);
    if (error.status === httpStatusCode.Unauthorized) {
      router.navigate(['sign-in']);
    }
    console.log('init current user error.', error);
  });
}

export function initConfig(authService: AuthService) {
  return () => authService.initConfig().then(() => {
  }).catch(error => {
    console.log('init config error.', error);
  });
}

if (environment.production && (window as any).CONFIG.RAVEN ) {
  Raven.config((window as any).CONFIG.RAVEN_DSN).install();
}


export class RavenErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    Raven.captureException(err);
  }
}

export class WayneErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    throw err;
  }
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    PodTerminalModule,
    AuthModule,
    PortalModule,
    AdminModule,
    RoutingModule,
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
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    AuthService,
    {
      provide: APP_INITIALIZER,
      useFactory: initUser,
      deps: [AuthService, Injector],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [AuthService],
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: (window as any).CONFIG.RAVEN ? RavenErrorHandler : WayneErrorHandler
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
