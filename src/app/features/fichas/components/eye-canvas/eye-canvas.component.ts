import {
  Component, Input, Output, EventEmitter,
  AfterViewInit, ElementRef, ViewChild, OnChanges, SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-eye-canvas',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './eye-canvas.component.html',
  styleUrl: './eye-canvas.component.css',
})
export class EyeCanvasComponent implements AfterViewInit, OnChanges {
  @Input() initialData: string | null = null;
  @Output() canvasChange = new EventEmitter<string>();

  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  selectedColor = '#000000';
  selectedSize = 5;
  isDrawing = false;

  private ctx!: CanvasRenderingContext2D;
  history: ImageData[] = [];
  redoStack: ImageData[] = [];
  private lastX = 0;
  private lastY = 0;

  colors = ['#000000', '#C8A2A2', '#D4AF37', '#e53935', '#1565c0', '#2e7d32'];
  sizes = [{ label: 'Fina', value: 2 }, { label: 'Média', value: 5 }, { label: 'Grossa', value: 10 }];

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = 340;
    canvas.height = 180;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.drawEyeSvg();
    if (this.initialData) {
      this.loadInitialData(this.initialData);
    }
    this.saveState();
    this.addEventListeners(canvas);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialData'] && !changes['initialData'].firstChange && this.ctx) {
      if (this.initialData) this.loadInitialData(this.initialData);
    }
  }

  private drawEyeSvg(): void {
    const ctx = this.ctx;
    const w = 340, h = 180;
    ctx.save();
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(w / 2, h / 2, w * 0.42, h * 0.28, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, h * 0.10, 0, Math.PI * 2);
    ctx.strokeStyle = '#eee';
    ctx.stroke();
    ctx.restore();
  }

  private loadInitialData(data: string): void {
    const img = new Image();
    img.onload = () => {
      this.ctx.clearRect(0, 0, 340, 180);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(0, 0, 340, 180);
      this.ctx.drawImage(img, 0, 0);
    };
    img.src = data;
  }

  private addEventListeners(canvas: HTMLCanvasElement): void {
    canvas.addEventListener('mousedown', (e) => this.startDraw(e.offsetX, e.offsetY));
    canvas.addEventListener('mousemove', (e) => this.draw(e.offsetX, e.offsetY));
    canvas.addEventListener('mouseup', () => this.endDraw());
    canvas.addEventListener('mouseleave', () => this.endDraw());

    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const t = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      this.startDraw(t.clientX - rect.left, t.clientY - rect.top);
    }, { passive: false });
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const t = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      this.draw(t.clientX - rect.left, t.clientY - rect.top);
    }, { passive: false });
    canvas.addEventListener('touchend', () => this.endDraw(), { passive: false });
  }

  private startDraw(x: number, y: number): void {
    this.isDrawing = true;
    this.lastX = x;
    this.lastY = y;
  }

  private draw(x: number, y: number): void {
    if (!this.isDrawing) return;
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(x, y);
    this.ctx.strokeStyle = this.selectedColor;
    this.ctx.lineWidth = this.selectedSize;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.stroke();
    this.lastX = x;
    this.lastY = y;
  }

  private endDraw(): void {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    this.saveState();
    this.redoStack = [];
    this.emitChange();
  }

  private saveState(): void {
    const canvas = this.canvasRef.nativeElement;
    this.history.push(this.ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (this.history.length > 30) this.history.shift();
  }

  undo(): void {
    if (this.history.length <= 1) return;
    this.redoStack.push(this.history.pop()!);
    this.ctx.putImageData(this.history[this.history.length - 1], 0, 0);
    this.emitChange();
  }

  redo(): void {
    if (!this.redoStack.length) return;
    const state = this.redoStack.pop()!;
    this.history.push(state);
    this.ctx.putImageData(state, 0, 0);
    this.emitChange();
  }

  clearCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.drawEyeSvg();
    this.saveState();
    this.redoStack = [];
    this.emitChange();
  }

  private emitChange(): void {
    const data = this.canvasRef.nativeElement.toDataURL('image/png');
    this.canvasChange.emit(data);
  }

  selectColor(color: string): void { this.selectedColor = color; }
  selectSize(size: number): void { this.selectedSize = size; }

  onCustomColor(event: Event): void {
    this.selectedColor = (event.target as HTMLInputElement).value;
  }
}
