import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { filter } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { BusinessUnit } from '../../models/settings.model';
import { SettingsActions } from '../../store/settings.actions';
import { selectBusinessUnit, selectCepLoading, selectSettingsSaving } from '../../store/settings.selectors';
import { digitsOnly, documentValidator, formatDocument } from './document.validator';

const UFS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
const MAX_LOGO_BYTES = 2 * 1024 * 1024;
const LOGO_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

@Component({
  selector: 'app-business-unit-form',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './business-unit-form.component.html',
  styleUrl: './business-unit-form.component.css',
})
export class BusinessUnitFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private snackbar = inject(SnackbarService);

  readonly ufs = UFS;
  businessUnit$ = this.store.select(selectBusinessUnit);
  saving$ = this.store.select(selectSettingsSaving);
  cepLoading$ = this.store.select(selectCepLoading);

  private unitId: string | null = null;

  form = this.fb.group(
    {
      tradeName: ['', [Validators.required, Validators.maxLength(255)]],
      legalName: [''],
      documentType: ['CNPJ' as string | null],
      document: [''],
      municipalRegistration: [''],
      phone: [''],
      whatsapp: [''],
      email: ['', Validators.email],
      instagram: [''],
      website: [''],
      zipCode: [''],
      street: [''],
      number: [''],
      complement: [''],
      district: [''],
      city: [''],
      state: [''],
    },
    { validators: documentValidator }
  );

  constructor() {
    this.businessUnit$
      .pipe(filter((u): u is BusinessUnit => !!u), takeUntilDestroyed())
      .subscribe((unit) => this.fill(unit));

    inject(Actions)
      .pipe(ofType(SettingsActions.lookupCepSuccess), takeUntilDestroyed())
      .subscribe(({ address }) => {
        this.form.patchValue({
          street: address.street || this.form.value.street,
          district: address.district || this.form.value.district,
          city: address.city,
          state: address.state,
        });
      });
  }

  ngOnInit(): void {
    this.store.dispatch(SettingsActions.loadBusinessUnit());
  }

  private fill(unit: BusinessUnit): void {
    this.unitId = unit.id;
    this.form.reset({
      tradeName: unit.tradeName,
      legalName: unit.legalName ?? '',
      documentType: unit.documentType ?? 'CNPJ',
      document: formatDocument(unit.documentType, unit.document ?? ''),
      municipalRegistration: unit.municipalRegistration ?? '',
      phone: unit.phone ?? '',
      whatsapp: unit.whatsapp ?? '',
      email: unit.email ?? '',
      instagram: unit.instagram ?? '',
      website: unit.website ?? '',
      zipCode: unit.zipCode ?? '',
      street: unit.street ?? '',
      number: unit.number ?? '',
      complement: unit.complement ?? '',
      district: unit.district ?? '',
      city: unit.city ?? '',
      state: unit.state ?? '',
    });
  }

  get documentError(): string | null {
    return this.form.errors?.['invalidDocument'] ?? null;
  }

  formatDocumentField(): void {
    const { documentType, document } = this.form.value;
    this.form.patchValue({ document: formatDocument(documentType ?? null, digitsOnly(document)) });
  }

  /** CEP completo (8 dígitos) → busca rua, bairro, cidade e UF no ViaCEP. */
  lookupCep(): void {
    const cep = digitsOnly(this.form.value.zipCode);
    if (cep.length !== 8) return;
    this.form.patchValue({ zipCode: `${cep.slice(0, 5)}-${cep.slice(5)}` });
    this.store.dispatch(SettingsActions.lookupCep({ cep }));
  }

  onSave(): void {
    if (this.form.invalid || !this.unitId) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const document = digitsOnly(v.document);
    this.store.dispatch(
      SettingsActions.saveBusinessUnit({
        id: this.unitId,
        request: {
          tradeName: v.tradeName!.trim(),
          legalName: v.legalName || null,
          documentType: document ? (v.documentType as 'CPF' | 'CNPJ') : null,
          document: document || null,
          municipalRegistration: v.municipalRegistration || null,
          phone: v.phone || null,
          whatsapp: v.whatsapp || null,
          email: v.email || null,
          instagram: v.instagram || null,
          website: v.website || null,
          zipCode: v.zipCode || null,
          street: v.street || null,
          number: v.number || null,
          complement: v.complement || null,
          district: v.district || null,
          city: v.city || null,
          state: v.state || null,
        },
      })
    );
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file || !this.unitId) return;
    if (!LOGO_TYPES.includes(file.type)) {
      this.snackbar.error('O logo deve ser PNG, JPG ou WebP');
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      this.snackbar.error('O logo deve ter no máximo 2 MB');
      return;
    }
    this.store.dispatch(SettingsActions.uploadLogo({ id: this.unitId, file }));
  }

  removeLogo(): void {
    if (this.unitId) this.store.dispatch(SettingsActions.removeLogo({ id: this.unitId }));
  }
}
