import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  Renderer2
} from '@angular/core';

@Directive({
  selector: '[csiIsEllipsisActive]',
  standalone: true
})
export class IsEllipsisActiveDirective implements AfterViewInit {
  el = inject(ElementRef);
  cdr = inject(ChangeDetectorRef);
  renderer = inject(Renderer2);

  @Output() isTruncatedChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Input() csiTruncateLabel: string = '';
  private _isTruncated: boolean = false;

  @Input()
  get isTruncated(): boolean {
    return this._isTruncated;
  }

  set isTruncated(value: boolean) {
    this._isTruncated = value;
    this.isTruncatedChange.emit(this._isTruncated);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.checkTruncation();
    }, 0);
  }

  checkTruncation(): void {
    const element = this.el.nativeElement;

    // Utilizza la funzione per controllare se il testo è troncato
    const isOverflowing = this.isTextOverflow(element);

    if (isOverflowing) {
      this.isTruncated = true;
      this.renderer.setProperty(element, 'title', this.csiTruncateLabel);
    } else {
      this.isTruncated = false;
    }

    // Forza un nuovo ciclo di controllo delle modifiche
    this.cdr.detectChanges();
  }

  private isTextOverflow(element: HTMLElement): boolean {
    return element.offsetWidth < element.scrollWidth;
  }
}
