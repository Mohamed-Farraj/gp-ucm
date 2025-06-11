import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { PrivilagesService } from '../services/privilages.service';

@Directive({
  selector: '[appPrivileges]',
  standalone: true
})
export class PrivilegesDirective {

  @Input('appPrivileges') requiredPrivilege!: string;

  constructor(
    private tpl: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private privilegeService: PrivilagesService
  ) {}

  ngOnInit() {
    if (this.privilegeService.hasPrivilege(this.requiredPrivilege)) {
      this.viewContainer.createEmbeddedView(this.tpl); // اعرض العنصر
    } else {
      this.viewContainer.clear(); // اخفي العنصر
    }
  }

}
