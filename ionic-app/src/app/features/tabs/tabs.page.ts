import { Component, EnvironmentInjector, inject } from '@angular/core';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { people, newspaper, person, clipboard } from 'ionicons/icons';
import { AsyncPipe } from '@angular/common';
import { AuthStateService } from '@core/services/auth-state.service';
import { map, Observable } from 'rxjs';
import { UserRole } from '@shared/models/user.model';

interface TabConfig {
  tab: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, AsyncPipe],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);
  private authState = inject(AuthStateService);

  tabs$: Observable<TabConfig[]> = this.authState.role$.pipe(
    map((role: UserRole) => {
      const shared: TabConfig[] = [
        { tab: 'players', icon: 'people', label: 'Players' },
      ];

      if (role === 'guest') {
        return [
          ...shared,
          { tab: 'profile', icon: 'person', label: 'Profile' },
        ];
      }

      return [
        ...shared,
        { tab: 'news', icon: 'newspaper', label: 'News' },
        { tab: 'ideal-team', icon: 'clipboard', label: 'Ideal Team' },
        { tab: 'profile', icon: 'person', label: 'Profile' },
      ];
    }),
  );

  constructor() {
    addIcons({ people, newspaper, clipboard, person });
  }
}
