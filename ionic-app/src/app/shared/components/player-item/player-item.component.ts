import { Component, Input } from '@angular/core';
import {
  IonItem,
  IonAvatar,
  IonLabel,
  IonIcon,
} from '@ionic/angular/standalone';
import { person, chevronForward } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { PlayerModel } from '@core/models/player.model';

@Component({
  selector: 'app-player-item',
  templateUrl: './player-item.component.html',
  styleUrls: ['./player-item.component.scss'],
  imports: [IonItem, IonAvatar, IonLabel, IonIcon],
})
export class PlayerItemComponent {
  @Input() player!: PlayerModel;

  constructor() {
    addIcons({ person, chevronForward });
  }
}
