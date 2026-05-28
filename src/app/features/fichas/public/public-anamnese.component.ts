import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AnamneseService } from '../services/anamnese.service';
import { AnamnesePublicResponse, SaveAnamneseRequest } from '../models/fichas.model';

type PageState = 'loading' | 'form' | 'success' | 'error';

@Component({
  selector: 'app-public-anamnese',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDividerModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatSnackBarModule,
  ],
  templateUrl: './public-anamnese.component.html',
  styleUrl: './public-anamnese.component.css',
})
export class PublicAnamneseComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private anamneseService = inject(AnamneseService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  token = '';
  clientData: AnamnesePublicResponse | null = null;
  pageState: PageState = 'loading';
  submitting = false;

  form: FormGroup = this.fb.group({
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
    termAccepted: [false, Validators.requiredTrue],
  });

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') ?? '';
    this.loadToken();
  }

  private loadToken(): void {
    this.anamneseService.getByToken(this.token).subscribe({
      next: (data) => {
        this.clientData = data;
        if (data.anamnese) {
          this.form.patchValue({
            guardianName: data.anamnese.guardianName ?? '',
            address: data.anamnese.address ?? '',
            neighborhood: data.anamnese.neighborhood ?? '',
            city: data.anamnese.city ?? '',
            state: data.anamnese.state ?? '',
            birthDate: data.anamnese.birthDate ?? '',
            phone: data.anamnese.phone ?? '',
            cpf: data.anamnese.cpf ?? '',
            rg: data.anamnese.rg ?? '',
            hadLashExtensions: data.anamnese.hadLashExtensions ?? false,
            wearsMascara: data.anamnese.wearsMascara ?? false,
            hasAllergies: data.anamnese.hasAllergies ?? false,
            hasThyroidIssues: data.anamnese.hasThyroidIssues ?? false,
            sleepSide: data.anamnese.sleepSide ?? 'AMBOS',
            hadEyeProcedure: data.anamnese.hadEyeProcedure ?? false,
            isPregnantOrNursing: data.anamnese.isPregnantOrNursing ?? false,
            hadOncologicalTreatment: data.anamnese.hadOncologicalTreatment ?? false,
            hasSkinDisease: data.anamnese.hasSkinDisease ?? false,
            hasHealthTreatment: data.anamnese.hasHealthTreatment ?? false,
            usesMedication: data.anamnese.usesMedication ?? false,
          });
        }
        this.pageState = 'form';
      },
      error: () => {
        this.pageState = 'error';
      },
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    const v = this.form.value;
    const req: SaveAnamneseRequest = {
      guardianName: v.guardianName || undefined,
      address: v.address || undefined,
      neighborhood: v.neighborhood || undefined,
      city: v.city || undefined,
      state: v.state || undefined,
      birthDate: v.birthDate || undefined,
      phone: v.phone || undefined,
      cpf: v.cpf || undefined,
      rg: v.rg || undefined,
      hadLashExtensions: v.hadLashExtensions,
      wearsMascara: v.wearsMascara,
      hasAllergies: v.hasAllergies,
      hasThyroidIssues: v.hasThyroidIssues,
      sleepSide: v.sleepSide,
      hadEyeProcedure: v.hadEyeProcedure,
      isPregnantOrNursing: v.isPregnantOrNursing,
      hadOncologicalTreatment: v.hadOncologicalTreatment,
      hasSkinDisease: v.hasSkinDisease,
      hasHealthTreatment: v.hasHealthTreatment,
      usesMedication: v.usesMedication,
      termAccepted: v.termAccepted,
    };

    this.anamneseService.submitByToken(this.token, req).subscribe({
      next: () => {
        this.pageState = 'success';
      },
      error: (err) => {
        this.submitting = false;
        const msg =
          err?.error?.message ?? 'Erro ao enviar formulário. Tente novamente.';
        this.snackBar.open(msg, 'Fechar', { duration: 5000 });
      },
    });
  }
}
