import { Component, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonIcon,
  IonButton,
  IonAvatar,
  IonModal,
  IonInput,
  IonTextarea,
  IonFab,
  IonFabButton,
} from '@ionic/angular/standalone';
import { NavController, ViewWillEnter } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { star, starHalf, close, location, add, footballOutline, shieldOutline, trophyOutline, person } from 'ionicons/icons';
import { BackendManagerService } from '@core/services/backend-manager.service';
import { PlayerModel } from '@core/models/player.model';
import { CommentModel } from '@core/models/comment.model';
import { SharedHeaderComponent } from '@shared/components/shared-header/shared-header.component';

const MOCK_COMMENTS: CommentModel[] = [
  {
    id: '1',
    author: 'Scout Alpha',
    text: 'Exceptional pace off the ball. Shows consistent ability to break lines and find space in the final third. Needs to work on weaker foot finishing under pressure.',
    rating: 4.5,
    created: 'Oct 12, 2023',
    idPlayer: '1',
    idUser: 'guest',
    location: { type: 'Point', coordinates: [-0.12, 51.51] },
  },
  {
    id: '2',
    author: 'Scout Beta',
    text: 'Elite tactical awareness during transition phases. Acted as the primary pivot in counter-attacks. Displayed institutional-grade reliability in possession retention.',
    rating: 5,
    created: 'Sep 28, 2023',
    idPlayer: '1',
    idUser: 'guest',
    location: { type: 'Point', coordinates: [-0.12, 51.51] },
  },
];

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
    IonButtons,
    IonIcon,
    IonButton,
    IonAvatar,
    IonModal,
    IonInput,
    IonTextarea,
    IonFab,
    IonFabButton,
    CommonModule,
    FormsModule,
    SharedHeaderComponent,
  ],
})
export class ProfilePlayerPage implements ViewWillEnter {
  private route = inject(ActivatedRoute);
  private nav = inject(NavController);
  private backendManager = inject(BackendManagerService);

  @ViewChild(IonModal) modal!: IonModal;

  player = signal<PlayerModel | null>(null);
  comments = signal<CommentModel[]>([]);

  showModal = signal(false);
  newComment = signal<NewCommentForm>({ author: '', text: '', rating: 0 });

  constructor() {
    addIcons({ star, starHalf, close, location, add, footballOutline, shieldOutline, trophyOutline, person });
  }

  ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.backendManager.providers().playerProvider.getPlayerById(id).subscribe({
      next: (player) => this.player.set(player),
      error: () => this.player.set(null),
    });

    this.comments.set(MOCK_COMMENTS.filter((c) => c.idPlayer === id));
  }

  goBack() {
    this.nav.back();
  }

  openModal() {
    this.newComment.set({ author: '', text: '', rating: 0 });
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  setRating(stars: number) {
    this.newComment.update((c) => ({ ...c, rating: stars }));
  }

  submitComment() {
    const form = this.newComment();
    if (!form.text || !form.rating) return;
    console.log('Submitting comment:', form);
    this.closeModal();
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
