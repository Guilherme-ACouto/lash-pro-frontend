import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'datePtbr', standalone: true })
export class DatePtbrPipe implements PipeTransform {
  transform(value: string | Date | null | undefined, format: 'short' | 'long' = 'short'): string {
    if (!value) return '';
    const date = typeof value === 'string' ? new Date(value + 'T00:00:00') : value;
    if (isNaN(date.getTime())) return '';
    if (format === 'long') {
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric'
      }).format(date);
    }
    return new Intl.DateTimeFormat('pt-BR').format(date);
  }
}
