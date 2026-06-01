import {
  Component,
  ElementRef,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonButton,
  IonIcon,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  AlertController,
  NavController,
  ViewWillEnter,
  ViewWillLeave,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { camera, locate, arrowBack } from 'ionicons/icons';
import L from 'leaflet';
import { Camera } from '@capacitor/camera';
import { BackendManagerService } from '@core/services/backend-manager.service';
import { GeolocationService } from '@core/services/geolocation.service';
import { ImageUploadService } from '@core/services/image-upload.service';
import { CAMERA_PLUGIN } from '@core/tokens/camera.token';
import { PlayerModel } from '@core/models/player.model';
import { SharedHeaderComponent } from '@shared/components/shared-header/shared-header.component';

@Component({
  selector: 'app-create-player',
  templateUrl: './create-player.page.html',
  styleUrls: ['./create-player.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonButton,
    IonIcon,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    CommonModule,
    FormsModule,
    SharedHeaderComponent,
  ],
})
export class CreatePlayerPage implements ViewWillEnter, ViewWillLeave {
  private backendManager = inject(BackendManagerService);
  private geoService = inject(GeolocationService);
  private camera = inject(CAMERA_PLUGIN);
  private alertController = inject(AlertController);
  private nav = inject(NavController);
  private imageUploadService = inject(ImageUploadService);

  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLElement>;

  alias = signal('');
  firstName = signal('');
  lastName = signal('');
  birthdate = signal('');
  nationality = signal('');
  height = signal('');
  weight = signal('');
  league = signal('');
  team = signal('');
  position = signal('');
  number = signal<number | null>(null);
  photo = signal<string | null>(null);
  location = signal<{ type: 'Point'; coordinates: [number, number] | null }>({
    type: 'Point',
    coordinates: null,
  });
  isLoading = signal(false);
  isLocating = signal(false);
  isUploading = signal(false);

  private map?: L.Map;
  private marker?: L.Marker;

  constructor() {
    addIcons({ camera, locate, arrowBack });

    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }

  ionViewWillEnter() {
    setTimeout(() => this.initMap(), 50);
  }

  ionViewWillLeave() {
    this.destroyMap();
  }

  private initMap() {
    this.destroyMap();

    const container = this.mapContainer?.nativeElement;
    if (!container) return;

    this.map = L.map(container, {
      center: [40.4168, -3.7038],
      zoom: 5,
      attributionControl: false,
    });

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      },
    ).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.setMarker(e.latlng.lat, e.latlng.lng);
    });
  }

  private setMarker(lat: number, lng: number) {
    if (!this.map) return;

    if (this.marker) {
      this.marker.remove();
    }

    this.marker = L.marker([lat, lng]).addTo(this.map);
    this.location.set({
      type: 'Point',
      coordinates: [lng, lat],
    });
  }

  private destroyMap() {
    if (this.map) {
      this.map.remove();
      this.map = undefined;
      this.marker = undefined;
    }
  }

  async useCurrentLocation() {
    this.isLocating.set(true);

    const pos = await this.geoService.getCurrentPosition();

    if (pos && this.map) {
      this.map.setView([pos.latitude, pos.longitude], 12);
      this.setMarker(pos.latitude, pos.longitude);
    }

    this.isLocating.set(false);
  }

  async takePhoto() {
    try {
      const result = await this.camera.takePhoto({
        quality: 80,
      });

      const source = result.uri ?? result.webPath;
      if (source) {
        this.isUploading.set(true);
        const downloadUrl = await this.imageUploadService.uploadPlayerPhoto(
          source,
          this.toOptional(this.alias()),
        );
        this.photo.set(downloadUrl);
        this.isUploading.set(false);
      }
    } catch (err) {
      console.error('Camera error:', err);
      this.isUploading.set(false);
    }
  }

  private validate(): string[] {
    const errors: string[] = [];

    if (!this.alias()) errors.push('Alias is required');
    if (!this.firstName()) errors.push('First name is required');
    if (!this.lastName()) errors.push('Last name is required');
    if (!this.birthdate()) errors.push('Birthdate is required');
    if (!this.nationality()) errors.push('Nationality is required');
    if (!this.height()) errors.push('Height is required');
    if (!this.weight()) errors.push('Weight is required');
    if (!this.league()) errors.push('League is required');
    if (!this.team()) errors.push('Team is required');
    if (!this.position()) errors.push('Position is required');
    if (!this.number()) errors.push('Shirt number is required');
    if (!this.photo()) errors.push('Photo is required');
    if (!this.location().coordinates) {
      errors.push('Location is required. Tap the map to pin the position.');
    }

    return errors;
  }

  async showValidationErrors(errors: string[]) {
    const alert = await this.alertController.create({
      header: 'Missing Information',
      message: errors.join('\n'),
      buttons: ['OK'],
    });
    await alert.present();
  }

  private calculateAge(birthdate: string): number {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    /* istanbul ignore next */
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  }

  private toOptional(value: string | null | undefined, suffix?: string): string | undefined {
    if (!value) return undefined;
    return suffix ? `${value} ${suffix}` : value;
  }

  private nullishToUndefined(value: number | null): number | undefined {
    return value ?? undefined;
  }

  savePlayer() {
    const errors = this.validate();
    if (errors.length > 0) {
      this.showValidationErrors(errors);
      return;
    }

    this.isLoading.set(true);

    const age = this.birthdate()
      ? this.calculateAge(this.birthdate())
      : undefined;

    const player: Partial<PlayerModel> = {
      name: this.alias(),
      firstName: this.firstName(),
      lastName: this.lastName(),
      birthdate: this.toOptional(this.birthdate()),
      nationality: this.toOptional(this.nationality()),
      height: this.toOptional(this.height(), 'cm'),
      weight: this.toOptional(this.weight(), 'kg'),
      league: this.toOptional(this.league()),
      team: this.toOptional(this.team()),
      position: this.toOptional(this.position()),
      number: this.nullishToUndefined(this.number()),
      photo: this.toOptional(this.photo()),
      age,
    };

    if (this.location().coordinates) {
      player.location = {
        type: 'Point',
        coordinates: this.location().coordinates!,
      };
    }

    this.backendManager
      .providers()
      .playerProvider.createPlayer(player)
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.nav.back();
        },
        error: (err) => {
          console.error('Failed to create player', err);
          this.isLoading.set(false);
        },
      });
  }

  cancel() {
    this.nav.back();
  }
}
