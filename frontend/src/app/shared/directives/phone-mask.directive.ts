import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appPhoneMask]',
  standalone: true
})
export class PhoneMaskDirective {

  constructor(private el: ElementRef, private control: NgControl) { }

  @HostListener('input', ['$event'])
  onInputChange(event: any) {
    const input = event.target;
    // Pega apenas números
    let value = input.value.replace(/\D/g, '');

    // Limita a 11 dígitos
    if (value.length > 11) {
      value = value.substring(0, 11);
    }

    // Aplica a formatação
    let formattedValue = '';
    if (value.length > 0) {
      formattedValue = '(' + value.substring(0, 2);
    }
    if (value.length > 2) {
      formattedValue += ') ' + value.substring(2, 7);
    }
    if (value.length > 7) {
      formattedValue = '(' + value.substring(0, 2) + ') ' + value.substring(2, 7) + '-' + value.substring(7);
    }

    // Atualiza o valor do input visualmente
    input.value = formattedValue;
    
    // Atualiza o FormControl com o valor formatado para garantir consistência
    // Se quiser salvar limpo, teria que tratar no submit ou usar um ControlValueAccessor mais complexo.
    // Para simplificar e garantir que o usuário veja o que está acontecendo:
    this.control.control?.setValue(formattedValue, { emitEvent: false });
  }

  @HostListener('blur')
  onBlur() {
    // Optional: format on blur if needed
  }
}
