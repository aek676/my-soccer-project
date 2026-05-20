import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '@shared/components/explore-container/explore-container.component';

@Component({
  selector: 'app-ideal-team',
  templateUrl: 'ideal-team.page.html',
  styleUrls: ['ideal-team.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    ExploreContainerComponent,
  ],
})
export class IdealTeamPage {
  constructor() {}
}
