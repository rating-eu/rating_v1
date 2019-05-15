import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MyAssetDtoModule} from "./my-asset/my-asset-dto.module";

@NgModule({
    imports: [
        CommonModule,
        MyAssetDtoModule
    ],
    declarations: []
})
export class DtoModule {
}
