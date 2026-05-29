import { Injectable, inject } from '@angular/core';
import { GEOLOCATION_PLUGIN, GeolocationPlugin } from '@core/tokens/geolocation.token';

export interface GeoPosition {
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  private geo = inject(GEOLOCATION_PLUGIN);

  async getCurrentPosition(): Promise<GeoPosition | null> {
    try {
      const position = await this.geo.getCurrentPosition({
        timeout: 10000,
        maximumAge: 0,
      });
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
    } catch (err) {
      console.error('Geolocation error:', err);
      return null;
    }
  }
}