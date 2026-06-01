import { InjectionToken } from '@angular/core';
import { Camera } from '@capacitor/camera';

export interface CameraPlugin {
  getPhoto: typeof Camera.getPhoto;
}

export const CAMERA_PLUGIN = new InjectionToken<CameraPlugin>('Camera Plugin', {
  providedIn: 'root',
  factory: () => ({
    getPhoto: Camera.getPhoto.bind(Camera),
  }),
});
