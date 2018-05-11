import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HermeneutSharedModule} from '../shared';

import {CommonModule} from '@angular/common';
import {IdentifyThreatAgentRoutingModule} from './identify-threat-agent-routing.module';
import {IdentifyThreatAgentComponent} from './identify-threat-agent.component';
import { ResultComponent } from './result/result.component';

@NgModule({
    imports: [
        HermeneutSharedModule,
        CommonModule,
        IdentifyThreatAgentRoutingModule
    ],
    declarations: [
        IdentifyThreatAgentComponent,
        ResultComponent
    ],
    exports: [
        IdentifyThreatAgentComponent
    ]
})
export class IdentifyThreatAgentModule {
}
