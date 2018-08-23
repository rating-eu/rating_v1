import { NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { IdentifyAssetsRoutingModule } from './identify-assets-routing.module';
import { IdentifyAssetComponent } from './id-assets/identify-asset.component';
import { QuestionComponent } from './question-component/question.component';
import { IdentifyAssetUtilService } from './identify-asset.util.service';
import { HermeneutSharedModule } from '../shared';

@NgModule({
    imports: [
        HermeneutSharedModule,
        CommonModule,
        IdentifyAssetsRoutingModule

    ],
    declarations: [
        IdentifyAssetComponent,
        QuestionComponent
    ],
    exports: [
        IdentifyAssetComponent,
        QuestionComponent
    ],
    providers: [
        IdentifyAssetUtilService
    ]
})
export class IdentifyAssetModule { }
