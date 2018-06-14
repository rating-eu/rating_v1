import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule, MatTabsModule} from '@angular/material';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
    imports: [
        CommonModule,
        MatTabsModule,
        MatButtonModule,
        MatIconModule
    ],
    exports: [
        MatTabsModule,
        MatButtonModule,
        MatIconModule
    ]
})
export class MaterialModule {
}
