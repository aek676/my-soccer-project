import { Component } from '@angular/core';
import { IonContent, IonHeader } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '@shared/components/explore-container/explore-container.component';
import { SharedHeaderComponent } from '@shared/components/shared-header/shared-header.component';

@Component({
  selector: 'app-players',
  templateUrl: 'players.page.html',
  styleUrls: ['players.page.scss'],
  imports: [IonContent, IonHeader, ExploreContainerComponent, SharedHeaderComponent],
})
export class PlayersPage {}
