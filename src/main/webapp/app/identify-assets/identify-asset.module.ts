  import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
    import { RouterModule } from '@angular/router';

    import { IdentifyAssetComponent, identifyAssetRoute } from './';

    @NgModule({
        imports: [
            RouterModule.forRoot([ identifyAssetRoute ], { useHash: true })
        ],
        declarations: [
            IdentifyAssetComponent,
        ],
        entryComponents: [
        ],
        providers: [
        ]
    })
    export class IdentifyAssetModule {}
