import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DatasharingService} from './datasharing.service';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: []
})
export class DatasharingModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: DatasharingModule,
            providers: [DatasharingService]
        };
    }
}
