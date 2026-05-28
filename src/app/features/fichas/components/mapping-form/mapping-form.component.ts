import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { EyeCanvasComponent } from '../eye-canvas/eye-canvas.component';
import { FichasActions } from '../../store/fichas.actions';
import { selectCurrentMapping, selectFichasIsLoading } from '../../store/fichas.selectors';
import { CreateMappingRequest } from '../../models/fichas.model';

@Component({
  selector: 'app-mapping-form',
  standalone: true,
  imports: [
    AsyncPipe, CommonModule, RouterLink, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatProgressBarModule,
    EyeCanvasComponent,
  ],
  templateUrl: './mapping-form.component.html',
  styleUrl: './mapping-form.component.css',
})
export class MappingFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  clientId = '';
  mappingId: string | null = null;
  isLoading$ = this.store.select(selectFichasIsLoading);
  currentMapping$ = this.store.select(selectCurrentMapping);

  canvasData: string | null = null;
  photoBefore: string | null = null;
  photoAfter: string | null = null;

  form = this.fb.group({
    mappingDate: [new Date().toISOString().split('T')[0]],
    mappingType: [''],
    curvature: [''],
    humidity: [''],
    temperature: [''],
    thickness: [''],
    threadBrand: [''],
    threadFormat: [''],
    adhesive: [''],
    lengthsUsed: [''],
    observations: [''],
  });

  mappingTypes = ['Natural Clássico', 'Volume', 'Mega Volume', 'Híbrido', 'Russa', 'Wet Look'];
  curvatures = ['B', 'C', 'D', 'L', 'M', 'J', 'CC'];
  thicknesses = ['0.03', '0.05', '0.07', '0.10', '0.12', '0.15', '0.18', '0.20', '0.25'];
  threadFormats = ['Natural', 'Gatinho', 'Boneca', 'Modelo', 'Fox Eye'];

  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get('clientId') ?? '';
    const idParam = this.route.snapshot.paramMap.get('id');
    this.mappingId = idParam && idParam !== 'nova' ? idParam : null;

    if (this.mappingId) {
      this.store.dispatch(FichasActions.loadMapping({ id: this.mappingId }));
      this.currentMapping$.subscribe(mapping => {
        if (!mapping) return;
        this.form.patchValue({
          mappingDate: mapping.mappingDate,
          mappingType: mapping.mappingType ?? '',
          curvature: mapping.curvature ?? '',
          humidity: mapping.humidity ?? '',
          temperature: mapping.temperature ?? '',
          thickness: mapping.thickness ?? '',
          threadBrand: mapping.threadBrand ?? '',
          threadFormat: mapping.threadFormat ?? '',
          adhesive: mapping.adhesive ?? '',
          lengthsUsed: mapping.lengthsUsed ?? '',
          observations: mapping.observations ?? '',
        });
        this.canvasData = mapping.canvasData;
        this.photoBefore = mapping.photoBefore;
        this.photoAfter = mapping.photoAfter;
      });
    }
  }

  onCanvasChange(data: string): void { this.canvasData = data; }

  onPhotoUpload(event: Event, field: 'before' | 'after'): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = () => {
      const maxSize = 800;
      let w = img.width, h = img.height;
      if (w > maxSize || h > maxSize) {
        if (w > h) { h = Math.round(h * maxSize / w); w = maxSize; }
        else { w = Math.round(w * maxSize / h); h = maxSize; }
      }
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
      const data = canvas.toDataURL('image/jpeg', 0.7);
      if (field === 'before') this.photoBefore = data;
      else this.photoAfter = data;
    };
    img.src = URL.createObjectURL(file);
  }

  save(): void {
    const v = this.form.value;
    const request: CreateMappingRequest = {
      mappingDate: v.mappingDate ?? undefined,
      mappingType: v.mappingType ?? undefined,
      curvature: v.curvature ?? undefined,
      humidity: v.humidity ?? undefined,
      temperature: v.temperature ?? undefined,
      thickness: v.thickness ?? undefined,
      threadBrand: v.threadBrand ?? undefined,
      threadFormat: v.threadFormat ?? undefined,
      adhesive: v.adhesive ?? undefined,
      lengthsUsed: v.lengthsUsed ?? undefined,
      observations: v.observations ?? undefined,
      canvasData: this.canvasData ?? undefined,
      photoBefore: this.photoBefore ?? undefined,
      photoAfter: this.photoAfter ?? undefined,
    };

    if (this.mappingId) {
      this.store.dispatch(FichasActions.updateMapping({ id: this.mappingId, request }));
    } else {
      this.store.dispatch(FichasActions.createMapping({ clientId: this.clientId, request }));
    }
  }

  goBack(): void {
    this.router.navigate(['/fichas/mapping', this.clientId]);
  }
}
