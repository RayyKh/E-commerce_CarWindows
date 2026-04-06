import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[sa]',
  standalone: true,
})
export class ScrollAnimateDirective implements OnInit, OnDestroy {
  @Input('sa') kind: 'fade-up' | 'fade-in' | 'scale-in' | 'slide-left' | 'slide-right' = 'fade-up';
  @Input() saDelay: number = 0;
  @Input() saOnce: boolean = true;
  private observer?: IntersectionObserver;
  constructor(private el: ElementRef<HTMLElement>, private r: Renderer2) {}
  ngOnInit() {
    this.r.addClass(this.el.nativeElement, 'sa');
    this.r.addClass(this.el.nativeElement, `sa-${this.kind}`);
    if (this.saDelay) this.r.setStyle(this.el.nativeElement, 'transition-delay', `${this.saDelay}ms`);
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.r.addClass(this.el.nativeElement, 'sa-in');
          if (this.saOnce && this.observer) {
            this.observer.unobserve(this.el.nativeElement);
          }
        }
      });
    }, { threshold: 0.15 });
    this.observer.observe(this.el.nativeElement);
  }
  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
