import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  IonItem,
  IonAvatar,
  IonLabel,
  IonIcon,
  IonCheckbox,
} from '@ionic/angular/standalone';
import { person, chevronForward } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { PlayerModel } from '@core/models/player.model';

@Component({
  selector: 'app-player-item',
  templateUrl: './player-item.component.html',
  styleUrls: ['./player-item.component.scss'],
  imports: [IonItem, IonAvatar, IonLabel, IonIcon, IonCheckbox],
})
export class PlayerItemComponent {
  @Input() player!: PlayerModel;
  @Input() selectable = false;
  @Input() selected = false;
  @Output() selectionChange = new EventEmitter<boolean>();
  @Output() tap = new EventEmitter<PlayerModel>();

  constructor() {
    addIcons({ person, chevronForward });
  }

  onCheckboxChange(event: any) {
    this.selectionChange.emit(event.detail.checked);
  }

  onTap() {
    if (!this.selectable) {
      this.tap.emit(this.player);
    }
  }
}
