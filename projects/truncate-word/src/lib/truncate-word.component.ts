import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  viewChild,
} from '@angular/core';
import { IsEllipsisActiveDirective } from './is-ellipsis-active.directive';

@Component({
  selector: 'ng-truncate-word',
  standalone: true,
  imports: [IsEllipsisActiveDirective],
  template: `
    <section>
      @if(isTruncated || isExpanded){
      <span
        aria-label="button that outputs the event on click and handle from the parent the truncated text"
        class="ellipsis_link"
        (click)="showFullText($event)"
      >
        @if(customEllipsis()){
        {{ customEllipsis() }}
        } @else{
        <a href="#">show more</a>
        }
      </span>
      }
      <div
        csiIsEllipsisActive
        [class.truncated]="!isExpanded"
        [class.not-truncated]="disableUseEllipsis()"
        [csiTruncateLabel]="textShow()"
        [(isTruncated)]="isTruncated"
      >
        {{ textShow() }}
      </div>
    </section>
  `,
  styles: `
  .truncated {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: fit-content;
  }

  .not-truncated {
    text-overflow: clip !important;
  }

  .ellipsis_link {
    float: right;
    text-transform: lowercase !important;
    cursor: pointer;
    height: 1rem !important;
  }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TruncateWordComponent {
  /**
   * Input text tho show and to be truncate in base de width of parent
   */
  textShow = input.required<string>();
  /**
   * Show alternative ellipsis to replace a classic button "show more"
   */
  customEllipsis = input<string | null>(null);
  /**
   * If true in the click of button show full text truncated inside component and don't event emit for manage from parent
   */
  showFullTextOnClick = input(false, { transform: booleanAttribute });
  /**
   * If true removes suspension points
   */
  disableUseEllipsis = input(false, { transform: booleanAttribute });
  /**
   * Output the event when click the ellipsis button and don't work is showFullTextOnClick
   */
  plusEvent = output<void>();
  ellipsisDir = viewChild.required(IsEllipsisActiveDirective);
  isExpanded: boolean = false;
  isTruncated: boolean = false;

  /**
   * Emit outputs the event on click and handle from the parent the truncated text
   */
  showFullText(event: Event): void {
    event.preventDefault();
    if (this.showFullTextOnClick()) {
      this.isExpanded = !this.isExpanded;
      this.isTruncated = !this.isExpanded;
    } else {
      this.plusEvent.emit();
    }
  }
}
