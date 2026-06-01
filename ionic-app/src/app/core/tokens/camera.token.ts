import { InjectionToken } from '@angular/core';
import { Camera } from '@capacitor/camera';

export interface CameraPlugin {
  takePhoto: typeof Camera.takePhoto;
}

export const CAMERA_PLUGIN = new InjectionToken<CameraPlugin>('Camera Plugin', {
  providedIn: 'root',
  factory: () => ({
    takePhoto: Camera.takePhoto.bind(Camera),
  }),
});
