import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExternalAuditRoutingModule } from './external-audit-routing.module';
import { RefinementComponent } from './refinement/refinement.component';

@NgModule({
  imports: [
    CommonModule,
    ExternalAuditRoutingModule
  ],
  declarations: [RefinementComponent]
})
export class ExternalAuditModule { }
