import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { App } from './app/app';
import { appConfig } from './app/app.config';

const combinedProviders = (appConfig.providers ?? []).concat([
  provideHttpClient(withFetch())
]);

bootstrapApplication(App, {
  providers: combinedProviders
}).catch((err) => console.error(err));
