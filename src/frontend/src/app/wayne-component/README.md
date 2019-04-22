# wayne-component
component for wayne

### usage

please use this component with `wayne-ui`;

```bash
npm i --save wayne-component
```

add the file to your shared module
```js
import { WayneModule } from 'wayne-component';
@NgModule({
  imports: [WayneModule]
})
```

### 使用注意事项

based on [clarity](https://vmware.github.io/clarity) and [translate](https://github.com/ngx-translate/core), we need to add follow config to app Module
```js
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/');
}
@NgModule({
  imports: [
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ]
})
```
