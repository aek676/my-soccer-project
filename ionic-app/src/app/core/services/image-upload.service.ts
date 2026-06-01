import { Injectable, inject } from '@angular/core';
import {
  STORAGE_FUNCTIONS,
  StorageFunctions,
} from '@core/tokens/storage.token';
import { getStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  private storage = inject(STORAGE_FUNCTIONS);

  async uploadPlayerPhoto(base64: string, playerName?: string): Promise<string> {
    const fileName = playerName
      ? `players/${playerName.replace(/\s+/g, '_')}_${Date.now()}.jpg`
      : `players/${Date.now()}.jpg`;

    const storageInstance = getStorage();
    const storageRef = this.storage.ref(storageInstance, fileName);
    await this.storage.uploadString(storageRef, base64, 'data_url');
    return this.storage.getDownloadURL(storageRef);
  }
}
