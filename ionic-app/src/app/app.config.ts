import { ApplicationConfig, inject } from '@angular/core';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';
import { initializeApp } from 'firebase/app';
import { FirebaseApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import {
  connectFirestoreEmulator,
  getFirestore,
  provideFirestore,
} from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => {
      const app = inject(FirebaseApp);
      const auth = getAuth(app);
      if (environment.useEmulators) {
        connectAuthEmulator(auth, environment.emulatorHosts.auth, {
          disableWarnings: true,
        });
      }
      return auth;
    }),
    provideFirestore(() => {
      const app = inject(FirebaseApp);
      const firestore = getFirestore(app);
      if (environment.useEmulators) {
        const [host, port] = environment.emulatorHosts.firestore
          .replace('http://', '')
          .split(':');
        connectFirestoreEmulator(firestore, host, parseInt(port, 10));
      }
      return firestore;
    }),
  ],
};
