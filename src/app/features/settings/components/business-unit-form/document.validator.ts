import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function digitsOnly(value: string | null | undefined): string {
  return (value ?? '').replace(/\D/g, '');
}

export function isValidCpf(cpf: string): boolean {
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  const digit = (length: number) => {
    let sum = 0;
    for (let i = 0; i < length; i++) sum += Number(cpf[i]) * (length + 1 - i);
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };
  return digit(9) === Number(cpf[9]) && digit(10) === Number(cpf[10]);
}

export function isValidCnpj(cnpj: string): boolean {
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
  const digit = (weights: number[]) => {
    const sum = weights.reduce((acc, w, i) => acc + Number(cnpj[i]) * w, 0);
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };
  return (
    digit([5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) === Number(cnpj[12]) &&
    digit([6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) === Number(cnpj[13])
  );
}

export function formatDocument(type: string | null, digits: string): string {
  if (type === 'CPF' && digits.length === 11) {
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  if (type === 'CNPJ' && digits.length === 14) {
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  return digits;
}

/** Valida o grupo documentType + document (mesma regra do backend: dígitos verificadores). */
export const documentValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const type = group.get('documentType')?.value;
  const digits = digitsOnly(group.get('document')?.value);
  if (!digits) return null;
  if (type === 'CPF') return isValidCpf(digits) ? null : { invalidDocument: 'CPF inválido' };
  if (type === 'CNPJ') return isValidCnpj(digits) ? null : { invalidDocument: 'CNPJ inválido' };
  return { invalidDocument: 'Escolha CPF ou CNPJ' };
};
