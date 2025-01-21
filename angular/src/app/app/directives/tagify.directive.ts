import { Directive, ElementRef, Input, Output, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core';
import Tagify from '@yaireo/tagify';

@Directive({
  selector: '[appTagify]',
})
export class TagifyDirective implements AfterViewInit, OnDestroy {
  @Input() settings: any;
  @Input() initialValue: string = '';
  @Output() valueChange = new EventEmitter<string>();

  private tagify!: Tagify;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.tagify = new Tagify(this.el.nativeElement, this.settings || {});

    // Set initial value if provided
    if (this.initialValue) {
      this.tagify.addTags(this.initialValue);
    }

    // Emit value changes
    this.tagify.on('change', () => {
      const value = this.tagify.value.map((tag: { value: string }) => tag.value).join(', ');
      this.valueChange.emit(value);
    });
  }

  ngOnDestroy(): void {
    if (this.tagify) {
      this.tagify.destroy();
    }
  }
}

