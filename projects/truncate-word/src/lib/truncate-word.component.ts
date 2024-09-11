import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {NgIf} from "@angular/common";

import {IsEllipsisActiveDirective} from "./is-ellipsis-active.directive";

@Component({
  selector: 'ng-truncate-word',
  standalone: true,
  imports: [NgIf, IsEllipsisActiveDirective],
  template: `
    <section>
      <span
        aria-label="button that outputs the event on click and handle from the parent the truncated text"
        class="ellipsis_link"
        *ngIf="isTruncated || isExpanded"
        (click)="showFullText($event)"
      >
        <ng-container *ngIf="customEllipsis; else defaultText">
          {{ customEllipsis }}
        </ng-container>
        <ng-template #defaultText>
          <a href="#">show more</a>
        </ng-template>
      </span>
      <div
        csiIsEllipsisActive
        [class.truncated]="!isExpanded"
        [class.not-truncated]="disableUseEllipsis"
        [csiTruncateLabel]="textShow ?? ''"
        [(isTruncated)]="isTruncated"
      >
        {{ textShow }}
      </div>
    </section>
  `,
  styles: `.truncated {
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TruncateWordComponent implements OnChanges, AfterViewInit {
  /**
   * Input text tho show and to be truncate in base de width of parent
   */
  @Input({ required: true }) textShow: string | undefined;
  /**
   * Show alternative ellipsis to replace a classic button "show more"
   */
  @Input() customEllipsis: string | null = null;
  /**
   * If true in the click of button show full text truncated inside component and don't event emit for manage from parent
   */
  @Input() showFullTextOnClick: boolean = false;
  /**
   * If true removes suspension points
   */
  @Input() disableUseEllipsis: boolean = false;
  /**
   * Output the event when click the ellipsis button and don't work is showFullTextOnClick
   */
  @Output() plusEvent = new EventEmitter();
  @ViewChild(IsEllipsisActiveDirective) ellipsisDir!: IsEllipsisActiveDirective;
  isExpanded: boolean = false;
  isTruncated: boolean = false;
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  ngAfterViewInit(): void {
    // Check truncation after loading the view
    setTimeout(() => {
      this.ellipsisDir.checkTruncation();
      this.cdr.detectChanges();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['textShow']) {
      this.checkTruncation();
    }
  }

  /**
   * Emit outputs the event on click and handle from the parent the truncated text
   */
  showFullText(event: Event): void {
    event.preventDefault();
    if (this.showFullTextOnClick) {
      this.isExpanded = !this.isExpanded;
      this.isTruncated = !this.isExpanded;
    } else {
      this.plusEvent.emit();
    }
  }

  /**
   * Recalculate the rendering of truncated element
   * @private
   */
  private checkTruncation(): void {
    setTimeout(() => {
      if (this.ellipsisDir) {
        this.ellipsisDir.checkTruncation();
      }
    }, 0);
  }
}
