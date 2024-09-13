import {computed, Directive, effect, ElementRef, inject, input, model, untracked} from '@angular/core';

/**
 * The directive acts on the DOM where it calculates the size of the parent container and checks whether the text is truncated by calculating the ratio of the size of the container to the text in length.
 */
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
    // Effect that “reacts” to csiTruncateLabel input and controls whether or not it should truncate the text
    effect(() => {
      this.csiTruncateLabel();
      untracked(() => this.checkTruncation());
    });
  }

  /**
   * Verify if is truncated and emit at component
   * @private
   */
  private checkTruncation(): void {
    const element = this.el.nativeElement;

    // Use function to check if text is truncated
    const isOverflowing = this.isTextOverflow(element);
    this.isTruncated.set(isOverflowing);
  }

  /**
   * Calculates whether the text exceeds the container in which the component is located
   * @param element html attribute
   * @private
   */
  private isTextOverflow(element: HTMLDivElement): boolean {
    return element.offsetWidth < element.scrollWidth;
  }
}
