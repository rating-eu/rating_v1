import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MyAssetDtoService} from "./my-asset-dto.service";

@NgModule({
    imports: [
        CommonModule
    ],
    providers: [
        MyAssetDtoService
    ]
})
export class MyAssetDtoModule {
}
