import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { FichasActions } from '../../store/fichas.actions';
import {
  selectCurrentAnamnese,
  selectFichasIsLoading,
  selectGeneratedLink,
} from '../../store/fichas.selectors';
import { SaveAnamneseRequest } from '../../models/fichas.model';

@Component({
  selector: 'app-anamnese-form',
  standalone: true,
  imports: [
    AsyncPipe, CommonModule, ReactiveFormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatSlideToggleModule,
    MatRadioModule, MatCheckboxModule, MatProgressBarModule,
    MatDialogModule,
  ],
  templateUrl: './anamnese-form.component.html',
  styleUrl: './anamnese-form.component.css',
})
export class AnamneseFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  clientId = '';
  currentAnamnese$ = this.store.select(selectCurrentAnamnese);
  isLoading$ = this.store.select(selectFichasIsLoading);
  generatedLink$ = this.store.select(selectGeneratedLink);
  generatedLinkValue: string | null = null;

  form = this.fb.group({
    guardianName: [''],
    address: [''],
    neighborhood: [''],
    city: [''],
    state: [''],
    birthDate: [''],
    phone: [''],
    cpf: [''],
    rg: [''],
    hadLashExtensions: [false],
    wearsMascara: [false],
    hasAllergies: [false],
    hasThyroidIssues: [false],
    sleepSide: ['AMBOS'],
    hadEyeProcedure: [false],
    isPregnantOrNursing: [false],
    hadOncologicalTreatment: [false],
    hasSkinDisease: [false],
    hasHealthTreatment: [false],
    usesMedication: [false],
    termAccepted: [false],
  });

  termAcceptedAt: string | null = null;

  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get('clientId') ?? '';
    this.store.dispatch(FichasActions.loadAnamnese({ clientId: this.clientId }));

    this.currentAnamnese$.subscribe(anamnese => {
      if (!anamnese) return;
      this.form.patchValue({
        guardianName: anamnese.guardianName ?? '',
        address: anamnese.address ?? '',
        neighborhood: anamnese.neighborhood ?? '',
        city: anamnese.city ?? '',
        state: anamnese.state ?? '',
        birthDate: anamnese.birthDate ?? '',
        phone: anamnese.phone ?? '',
        cpf: anamnese.cpf ?? '',
        rg: anamnese.rg ?? '',
        hadLashExtensions: anamnese.hadLashExtensions,
        wearsMascara: anamnese.wearsMascara,
        hasAllergies: anamnese.hasAllergies,
        hasThyroidIssues: anamnese.hasThyroidIssues,
        sleepSide: anamnese.sleepSide,
        hadEyeProcedure: anamnese.hadEyeProcedure,
        isPregnantOrNursing: anamnese.isPregnantOrNursing,
        hadOncologicalTreatment: anamnese.hadOncologicalTreatment,
        hasSkinDisease: anamnese.hasSkinDisease,
        hasHealthTreatment: anamnese.hasHealthTreatment,
        usesMedication: anamnese.usesMedication,
        termAccepted: anamnese.termAccepted,
      });
      this.termAcceptedAt = anamnese.termAcceptedAt;
    });

    this.generatedLink$.subscribe(url => { this.generatedLinkValue = url; });
  }

  save(): void {
    const v = this.form.value;
    const request: SaveAnamneseRequest = {
      guardianName: v.guardianName ?? undefined,
      address: v.address ?? undefined,
      neighborhood: v.neighborhood ?? undefined,
      city: v.city ?? undefined,
      state: v.state ?? undefined,
      birthDate: v.birthDate ?? undefined,
      phone: v.phone ?? undefined,
      cpf: v.cpf ?? undefined,
      rg: v.rg ?? undefined,
      hadLashExtensions: v.hadLashExtensions ?? false,
      wearsMascara: v.wearsMascara ?? false,
      hasAllergies: v.hasAllergies ?? false,
      hasThyroidIssues: v.hasThyroidIssues ?? false,
      sleepSide: v.sleepSide ?? 'AMBOS',
      hadEyeProcedure: v.hadEyeProcedure ?? false,
      isPregnantOrNursing: v.isPregnantOrNursing ?? false,
      hadOncologicalTreatment: v.hadOncologicalTreatment ?? false,
      hasSkinDisease: v.hasSkinDisease ?? false,
      hasHealthTreatment: v.hasHealthTreatment ?? false,
      usesMedication: v.usesMedication ?? false,
      termAccepted: v.termAccepted ?? false,
    };
    this.store.dispatch(FichasActions.saveAnamnese({ clientId: this.clientId, request }));
  }

  generateLink(): void {
    this.store.dispatch(FichasActions.generateLink({ clientId: this.clientId }));
  }

  copyLink(): void {
    if (this.generatedLinkValue) {
      navigator.clipboard.writeText(this.generatedLinkValue);
      this.snackBar.open('Link copiado!', 'Fechar', { duration: 2000 });
    }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR');
  }

  get termAcceptedNow(): boolean {
    return this.form.value.termAccepted ?? false;
  }
}
