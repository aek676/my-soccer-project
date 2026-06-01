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

  async uploadPlayerPhoto(source: string, playerName?: string): Promise<string> {
    const fileName = playerName
      ? `players/${playerName.replace(/\s+/g, '_')}_${Date.now()}.jpg`
      : `players/${Date.now()}.jpg`;

    const storageInstance = getStorage();
    const storageRef = this.storage.ref(storageInstance, fileName);
    const dataUrl = await this.toDataUrl(source);
    await this.storage.uploadString(storageRef, dataUrl, 'data_url');
    return this.storage.getDownloadURL(storageRef);
  }

  private async toDataUrl(source: string): Promise<string> {
    const response = await fetch(source);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
