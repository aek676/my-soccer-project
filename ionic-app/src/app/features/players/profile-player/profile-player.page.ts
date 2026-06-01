import { Component, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { take } from 'rxjs';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonButton,
  IonAvatar,
  IonModal,
  IonInput,
  IonTextarea,
  IonButtons,
  IonAlert,
  IonFab,
  IonFabButton,
} from '@ionic/angular/standalone';
import {
  AlertController,
  NavController,
  ViewWillEnter,
  ViewWillLeave,
} from '@ionic/angular';
import L from 'leaflet';
import { addIcons } from 'ionicons';
import {
  star,
  starHalf,
  close,
  location,
  footballOutline,
  shieldOutline,
  trophyOutline,
  person,
  chatbubble,
  trash,
} from 'ionicons/icons';
import { BackendManagerService } from '@core/services/backend-manager.service';
import { PlayerModel } from '@core/models/player.model';
import { CommentModel } from '@core/models/comment.model';
import { UserRole } from '@core/models/user.model';
import { AuthService } from '@core/services/auth.service';
import { AuthStateService } from '@core/services/auth-state.service';
import { GeolocationService } from '@core/services/geolocation.service';
import { SharedHeaderComponent } from '@shared/components/shared-header/shared-header.component';

interface NewCommentForm {
  author: string;
  text: string;
  rating: number;
}

@Component({
  selector: 'app-profile-player',
  templateUrl: './profile-player.page.html',
  styleUrls: ['./profile-player.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonIcon,
    IonButton,
    IonAvatar,
    IonModal,
    IonInput,
    IonTextarea,
    CommonModule,
    FormsModule,
    SharedHeaderComponent,
    IonButtons,
    IonAlert,
    IonFab,
    IonFabButton,
    RouterModule,
  ],
})
export class ProfilePlayerPage implements ViewWillEnter, ViewWillLeave {
  private route = inject(ActivatedRoute);
  private nav = inject(NavController);
  private backendManager = inject(BackendManagerService);
  private alertController = inject(AlertController);
  private authState = inject(AuthStateService);
  private authService = inject(AuthService);
  private geoService = inject(GeolocationService);

  @ViewChild(IonModal) modal!: IonModal;

  player = signal<PlayerModel | null>(null);
  comments = signal<CommentModel[]>([]);
  userRole = signal<UserRole>('guest');
  authorName = signal('');

  showModal = signal(false);
  newComment = signal<NewCommentForm>({ author: '', text: '', rating: 0 });
  showDeleteAlert = signal(false);
  deleteCommentId = signal('');
  deleteAlertButtons = [
    { text: 'Cancel', role: 'cancel' },
    { text: 'Delete', role: 'destructive' },
  ];
  private map?: L.Map;

  constructor() {
    addIcons({
      star,
      starHalf,
      close,
      location,
      footballOutline,
      shieldOutline,
      trophyOutline,
      person,
      chatbubble,
      trash,
    });

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
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.backendManager
      .providers()
      .playerProvider.getPlayerById(id)
      .subscribe({
        next: (player) => {
          this.player.set(player);
          setTimeout(() => this.initMap(), 50);
        },
        error: () => this.player.set(null),
      });

    this.backendManager
      .providers()
      .commentProvider.getCommentsByPlayer(id)
      .subscribe({
        next: (comments) => this.comments.set(comments),
        error: (err) => console.error('Failed to load comments', err),
      });

    this.authState.role$.pipe(take(1)).subscribe((role) => {
      this.userRole.set(role);
      if (role !== 'guest') {
        const user = this.authService.currentUser;
        this.authorName.set(user?.displayName || '');
      }
    });
  }

  ionViewWillLeave() {
    this.destroyMap();
  }

  /* istanbul ignore next */
  private initMap() {
    this.destroyMap();

    const container = document.querySelector<HTMLElement>('.map');
    const p = this.player();
    if (!container || !p?.location?.coordinates) return;

    const [lng, lat] = p.location.coordinates;

    this.map = L.map(container, {
      center: [lat, lng],
      zoom: 8,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      touchZoom: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      keyboard: false,
    });

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      },
    ).addTo(this.map);

    L.marker([lat, lng])
      .addTo(this.map)
      .bindPopup(`Imported at ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
  }

  private destroyMap() {
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
  }

  goBack() {
    this.nav.back();
  }

  openModal() {
    const role = this.userRole();
    const author = role !== 'guest' ? this.authorName() : '';
    this.newComment.set({ author, text: '', rating: 0 });
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  setRating(stars: number) {
    this.newComment.update((c) => ({ ...c, rating: stars }));
  }

  async submitComment() {
    const form = this.newComment();
    if (!form.text || !form.rating) return;

    const idPlayer = this.route.snapshot.paramMap.get('id') || '';

    const pos = await this.geoService.getCurrentPosition();
    if (!pos) {
      const alert = await this.alertController.create({
        header: 'Location Required',
        message:
          'Location access is required to post a comment. Please enable location services and try again.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    const comment: CommentModel = {
      id: '',
      author: form.author,
      text: form.text,
      rating: form.rating,
      created: '',
      idPlayer,
      location: {
        type: 'Point',
        coordinates: [pos.longitude, pos.latitude],
      },
    };

    this.backendManager
      .providers()
      .commentProvider.createComment(comment)
      .subscribe({
        next: (created) => {
          this.comments.update((list) => [...list, created]);
          this.closeModal();
        },
        error: (err) => console.error('Failed to create comment', err),
      });
  }

  confirmDelete(comment: CommentModel) {
    this.deleteCommentId.set(comment.id);
    this.showDeleteAlert.set(true);
  }

  onDeleteDismiss(detail: any) {
    if (detail.detail.role === 'destructive') {
      this.deleteComment(this.deleteCommentId());
    }
    this.showDeleteAlert.set(false);
  }

  deleteComment(id: string) {
    this.backendManager
      .providers()
      .commentProvider.deleteComment(id)
      .subscribe({
        next: () =>
          this.comments.update((list) => list.filter((c) => c.id !== id)),
        error: (err) => console.error('Failed to delete comment', err),
      });
  }

  getStarIcons(rating: number): string[] {
    const icons: string[] = [];
    const full = Math.floor(rating);
    const half = rating % 1 !== 0;
    for (let i = 0; i < 5; i++) {
      if (i < full) icons.push('star');
      else if (i === full && half) icons.push('star-half');
      else icons.push('star');
    }
    return icons;
  }

  isFilledStar(rating: number, index: number): boolean {
    return index < Math.floor(rating);
  }

  isHalfStar(rating: number, index: number): boolean {
    return rating % 1 !== 0 && index === Math.floor(rating);
  }
}
