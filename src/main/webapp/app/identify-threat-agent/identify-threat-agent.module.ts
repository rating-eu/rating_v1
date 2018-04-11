  import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
    import { RouterModule } from '@angular/router';

    import { IdentifyThreatAgentComponent, identifyThreatAgentRoute } from './';

    @NgModule({
        imports: [
            RouterModule.forRoot([ identifyThreatAgentRoute ], { useHash: true })
        ],
        declarations: [
            IdentifyThreatAgentComponent,
        ],
        entryComponents: [
        ],
        providers: [
        ]
    })
    export class IdentifyThreatAgentModule {}
