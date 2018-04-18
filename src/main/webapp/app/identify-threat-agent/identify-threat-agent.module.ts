import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HermeneutSharedModule} from '../shared';

import {IdentifyThreatAgentComponent, identifyThreatAgentRoute} from './';

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forRoot([identifyThreatAgentRoute], {useHash: true})
    ],
    declarations: [
        IdentifyThreatAgentComponent,
    ],
    entryComponents: [],
    providers: []
})
export class IdentifyThreatAgentModule {
}
