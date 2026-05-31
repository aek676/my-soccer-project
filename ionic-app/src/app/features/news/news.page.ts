import { Component, inject, signal } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonFab,
  IonFabButton,
  IonIcon,
  ViewWillEnter,
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { SharedHeaderComponent } from '@shared/components/shared-header/shared-header.component';
import { NewsModel } from '@core/models/news.model';
import { BackendManagerService } from '@core/services/backend-manager.service';
import { add } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonFab,
    IonFabButton,
    IonIcon,
    SharedHeaderComponent,
  ],
})
export class NewsPage implements ViewWillEnter {
  private navController = inject(NavController);
  private backendManager = inject(BackendManagerService);

  articles = signal<NewsModel[]>([]);

  constructor() {
    addIcons({ 'add': add });
  }

  getPlayerName(idPlayer: string | number): string {
    const player = this.backendManager.players().find((p) => p.id == idPlayer);
    return player?.name ?? 'Unknown Player';
  }

  ionViewWillEnter() {
    this.backendManager.providers().newsProvider.getNews().subscribe((news) => {
      this.articles.set(news);
    });
  }

  onCreateNews() {
    this.navController.navigateForward('/create-news');
  }
}
