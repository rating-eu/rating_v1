import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTabsModule} from '@angular/material';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
    imports: [
        CommonModule,
        MatTabsModule,
        MatButtonModule
    ],
    exports: [
        MatTabsModule,
        MatButtonModule
    ]
})
export class MaterialModule {
}
