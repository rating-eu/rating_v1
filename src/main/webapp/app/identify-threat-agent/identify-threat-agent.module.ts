import {NgModule} from '@angular/core';
import {HermeneutSharedModule} from '../shared';

import {CommonModule} from '@angular/common';
import {IdentifyThreatAgentRoutingModule} from './identify-threat-agent-routing.module';
import {IdentifyThreatAgentComponent} from './identify-threat-agent.component';
import {ResultComponent} from './result/result.component';
import {DatasharingModule} from '../datasharing/datasharing.module';
import { IdentifyThreatAgentService } from './identify-threat-agent.service';

@NgModule({
    imports: [
        HermeneutSharedModule,
        CommonModule,
        IdentifyThreatAgentRoutingModule,
        DatasharingModule
    ],
    declarations: [
        IdentifyThreatAgentComponent,
        ResultComponent
    ],
    exports: [
        IdentifyThreatAgentComponent,
        ResultComponent
    ],
    providers: [IdentifyThreatAgentService]
})
export class IdentifyThreatAgentModule {
}
