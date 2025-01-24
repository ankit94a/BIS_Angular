import {
  Component,
  Input,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef,
  OnInit,
  OnDestroy,
} from '@angular/core';


@Component({
  selector: 'custom-view-component',
  template: `
    <ng-template #dynamicTarget></ng-template>
  `,
})
export class CustomViewComponent implements OnInit, OnDestroy {

  customComponent: any;
  @Input() column: any;
  @Input() element:any;
  @ViewChild('dynamicTarget', { read: ViewContainerRef, static: true }) dynamicTarget: any;

  constructor(private resolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    
    if (this.column && !this.customComponent) {
      this.createCustomComponent();
     // this.callOnComponentInit();
      this.patchInstance();
    }
  }

  ngOnDestroy() {
    if (this.customComponent) {
      this.customComponent.destroy();
    }
  }

  protected createCustomComponent() {
    const componentFactory = this.resolver.resolveComponentFactory(this.column.renderComponent);
    this.customComponent = this.dynamicTarget.createComponent(componentFactory);
  }

  protected callOnComponentInit() {
    
    const onComponentInitFunction = this.column.getOnComponentInitFunction();
    onComponentInitFunction && onComponentInitFunction(this.customComponent.instance);
  }

  protected patchInstance() {
    
    Object.assign(this.customComponent.instance, this.getPatch());
  }

  protected getPatch() {
    
    return {
      
      value: this.element[this.column.name],
      rowData: this.element,
      column: this.column
    }
  }
}
