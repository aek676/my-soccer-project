import { InjectionToken } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

export interface GeolocationPlugin {
  getCurrentPosition: typeof Geolocation.getCurrentPosition;
}

export const GEOLOCATION_PLUGIN = new InjectionToken<GeolocationPlugin>(
  'Geolocation Plugin',
  {
    providedIn: 'root',
    factory: () => ({
      getCurrentPosition: Geolocation.getCurrentPosition.bind(Geolocation),
    }),
  },
);