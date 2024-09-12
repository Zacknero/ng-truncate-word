import {
  Directive,
  ElementRef,
  inject,
  model,
  input,
  computed,
  effect,
  untracked,
} from '@angular/core';

@Directive({
  selector: '[csiIsEllipsisActive]',
  standalone: true,
  host: {
    '[title]': 'titleTrunc()',
  },
})
export class IsEllipsisActiveDirective {
  isTruncated = model<boolean>();
  csiTruncateLabel = input.required<string>();
  protected titleTrunc = computed(() =>
    this.isTruncated() ? this.csiTruncateLabel() : ''
  );
  private readonly el = inject<ElementRef<HTMLDivElement>>(ElementRef);

  constructor() {
    // Effetto che "reagisce" all'input di csiTruncateLabel e controlla se deve troncare o meno il testo
    effect(() => {
      this.csiTruncateLabel();
      untracked(() => this.checkTruncation());
    });
  }

  private checkTruncation(): void {
    const element = this.el.nativeElement;

    // Utilizza la funzione per controllare se il testo è troncato
    const isOverflowing = this.isTextOverflow(element);
    this.isTruncated.set(isOverflowing);
  }

  private isTextOverflow(element: HTMLDivElement): boolean {
    return element.offsetWidth < element.scrollWidth;
  }
}
