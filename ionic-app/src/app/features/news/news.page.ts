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
import { AuthStateService } from '@core/services/auth-state.service';
import { UserRole } from '@core/models/user.model';
import { take } from 'rxjs';
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
  private authState = inject(AuthStateService);

  articles = signal<NewsModel[]>([]);
  userRole = signal<UserRole>('guest');

  constructor() {
    addIcons({ 'add': add });
  }

  ionViewWillEnter() {
    this.authState.role$.pipe(take(1)).subscribe((role) => {
      this.userRole.set(role);
    });
    this.backendManager.providers().newsProvider.getNews().subscribe((news) => {
      this.articles.set(news);
    });
  }

  onCreateNews() {
    this.navController.navigateForward('/create-news');
  }
}
