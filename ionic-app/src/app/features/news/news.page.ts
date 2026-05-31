import { Component, inject, OnInit, signal } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonFab,
  IonFabButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { SharedHeaderComponent } from '@shared/components/shared-header/shared-header.component';
import { NewsModel } from '@core/models/news.model';
import { MockNewsProvider } from '@core/providers/mock/mock-news-provider';
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
export class NewsPage implements OnInit {
  private navController = inject(NavController);
  private newsProvider = new MockNewsProvider();

  articles = signal<NewsModel[]>([]);

  constructor() {
    addIcons({ 'add': add });
  }

  ngOnInit() {
    this.newsProvider.getNews().subscribe((news) => {
      this.articles.set(news);
    });
  }

  onCreateNews() {
    this.navController.navigateForward('/create-news');
  }
}
