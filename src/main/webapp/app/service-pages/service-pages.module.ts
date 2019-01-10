import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicePagesRoutingModule } from './service-pages-routing.module';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';

@NgModule({
  imports: [
    CommonModule,
    ServicePagesRoutingModule
  ],
  declarations: [ComingSoonComponent]
})
export class ServicePagesModule { }
