import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonButton,
  IonInput,
  IonTextarea,
  IonSpinner,
  IonFooter,
  IonToolbar,
  ToastController,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { SharedHeaderComponent } from '@shared/components/shared-header/shared-header.component';
import { FormsModule } from '@angular/forms';
import { add } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { firstValueFrom } from 'rxjs';
import { BackendManagerService } from '@core/services/backend-manager.service';

@Component({
  selector: 'app-create-news',
  templateUrl: './create-news.page.html',
  styleUrls: ['./create-news.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonButton,
    IonInput,
    IonTextarea,
    IonSpinner,
    IonFooter,
    IonToolbar,
    IonSelect,
    IonSelectOption,
    SharedHeaderComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class CreateNewsPage {
  private fb = inject(FormBuilder);
  private nav = inject(NavController);
  private toastCtrl = inject(ToastController);
  private backendManager = inject(BackendManagerService);

  form: FormGroup;
  submitting = signal(false);
  players = this.backendManager.players;

  constructor() {
    addIcons({ add });
    this.form = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
      tags: [''],
      playerName: [null, Validators.required],
    });
  }

  ionViewWillEnter() {
    this.backendManager.loadPlayers();
  }

  goBack() {
    this.nav.back();
  }

  async onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    try {
      await firstValueFrom(
        this.backendManager
          .providers()
          .newsProvider.createNews(this.form.value),
      );
      const toast = await this.toastCtrl.create({
        message: 'Article created successfully',
        duration: 2000,
        position: 'bottom',
        color: 'success',
      });
      await toast.present();
      this.nav.navigateBack('/tabs/news');
    } catch {
      const toast = await this.toastCtrl.create({
        message: 'Failed to create article',
        duration: 3000,
        position: 'bottom',
        color: 'danger',
      });
      await toast.present();
    } finally {
      this.submitting.set(false);
    }
  }
}
