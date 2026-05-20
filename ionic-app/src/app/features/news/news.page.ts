import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '@shared/components/explore-container/explore-container.component';

@Component({
  selector: 'app-news',
  templateUrl: 'news.page.html',
  styleUrls: ['news.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    ExploreContainerComponent,
  ],
})
export class NewsPage {
  constructor() {}
}
