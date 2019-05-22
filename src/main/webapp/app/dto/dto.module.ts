import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MyAssetDtoModule} from "./my-asset/my-asset-dto.module";
import {CompletionDtoModule} from "./completion/completion-dto.module";

@NgModule({
    imports: [
        CommonModule,
        MyAssetDtoModule,
        CompletionDtoModule
    ],
    declarations: []
})
export class DtoModule {
}
