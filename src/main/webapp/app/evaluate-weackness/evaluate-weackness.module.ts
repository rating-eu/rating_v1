  import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
    import { RouterModule } from '@angular/router';

    import { EvaluateWeacknessComponent, evaluateWeacknessRoute } from './';

    @NgModule({
        imports: [
            RouterModule.forRoot([ evaluateWeacknessRoute ], { useHash: true })
        ],
        declarations: [
            EvaluateWeacknessComponent,
        ],
        entryComponents: [
        ],
        providers: [
        ]
    })
    export class EvaluateWeacknessModule {}
