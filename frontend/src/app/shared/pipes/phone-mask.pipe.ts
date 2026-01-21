import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneMask',
  standalone: true
})
export class PhoneMaskPipe implements PipeTransform {

  transform(value: string | undefined | null): string {
    if (!value) return '';

    // Remove non-numeric characters
    const numbers = value.replace(/\D/g, '');

    if (numbers.length === 11) {
      // (XX) XXXXX-XXXX
      return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 7)}-${numbers.substring(7)}`;
    } else if (numbers.length === 10) {
      // (XX) XXXX-XXXX
      return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 6)}-${numbers.substring(6)}`;
    }

    return value;
  }

}
