import { InjectionToken } from '@angular/core';
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
  FirebaseStorage,
} from '@angular/fire/storage';

export interface StorageFunctions {
  getStorage: typeof getStorage;
  ref: typeof ref;
  uploadString: typeof uploadString;
  getDownloadURL: typeof getDownloadURL;
}

export const STORAGE_FUNCTIONS = new InjectionToken<StorageFunctions>(
  'Storage Functions',
  {
    providedIn: 'root',
    factory: () => ({
      getStorage,
      ref,
      uploadString,
      getDownloadURL,
    }),
  },
);
