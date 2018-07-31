import { NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { IdentifyAssetsRoutingModule } from './identify-assets-routing.module';
import { IdentifyAssetComponent } from './id-assets/identify-asset.component';
import { QuestionComponent } from './question-component/question.component';

@NgModule({
    imports: [
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
    ]
})
export class IdentifyAssetModule { }
