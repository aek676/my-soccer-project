import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonChip, IonLabel, IonIcon } from '@ionic/angular/standalone';
import { chevronDown, chevronUp } from 'ionicons/icons';
import { addIcons } from 'ionicons';

export interface FilterSelection {
  filter: string;
  direction: 'asc' | 'desc';
}

@Component({
  selector: 'app-filter-chips',
  templateUrl: './filter-chips.component.html',
  styleUrls: ['./filter-chips.component.scss'],
  imports: [IonChip, IonLabel, IonIcon],
})
export class FilterChipsComponent {
  @Input() filters: string[] = [];
  @Input() selected: FilterSelection | null = null;
  @Output() selectedChange = new EventEmitter<FilterSelection | null>();

  cycleFilter(filter: string) {
    const cur = this.selected;

    if (!cur || cur.filter !== filter) {
      this.selectedChange.emit({ filter, direction: 'asc' });
    } else if (cur.direction === 'asc') {
      this.selectedChange.emit({ filter, direction: 'desc' });
    } else {
      this.selectedChange.emit(null);
    }
  }

  constructor() {
    addIcons({ chevronDown, chevronUp });
  }
}
