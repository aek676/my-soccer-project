import { Component } from '@angular/core';
import { IonContent, IonHeader } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '@shared/components/explore-container/explore-container.component';
import { SharedHeaderComponent } from '@shared/components/shared-header/shared-header.component';

@Component({
  selector: 'app-news',
  templateUrl: 'news.page.html',
  styleUrls: ['news.page.scss'],
  imports: [IonContent, IonHeader, ExploreContainerComponent, SharedHeaderComponent],
})
export class NewsPage {}
