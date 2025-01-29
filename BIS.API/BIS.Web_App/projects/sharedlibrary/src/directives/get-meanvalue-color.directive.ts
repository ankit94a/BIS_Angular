import { Directive, ElementRef, Input, Renderer2, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[libGetMeanvalueColor]'
})
export class GetMeanvalueColorDirective implements OnChanges {

  @Input() libGetMeanvalueColor: any;
  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['libGetMeanvalueColor']) {
      this.updateBackgroundColor();
    }
  }

  private updateBackgroundColor(): void {
    const percentageOfMean = (this.libGetMeanvalueColor.count / this.libGetMeanvalueColor.meanValue) * 100;
    const alerts: string[] = [];
    if (percentageOfMean <= 100) {
      alerts.push("#A0D683");
    } else if (percentageOfMean <= 200) {
      alerts.push("#FFF574");
    } else if (percentageOfMean <= 400) {
      alerts.push("#F29F58");
    } else {
      alerts.push("#D91656");
    }
    const color = alerts[0];
    this.renderer.setStyle(this.el.nativeElement, 'background-color', color);
  }

}
