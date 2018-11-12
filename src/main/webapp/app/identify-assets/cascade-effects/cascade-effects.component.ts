import * as _ from 'lodash';

import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'cascade-effects',
    templateUrl: './cascade-effects.component.html',
    styleUrls: ['./cascade-effects.component.css'],
})

export class CascadeEffectsComponent implements OnInit, OnDestroy {
    ngOnDestroy(): void {
    }
    ngOnInit(): void {
        /*
         this.idaUtilsService.getMySavedDirectAssets(this.mySelf)
                        .toPromise().then((mySavedDirects) => {
                            this.myDirectAssets = mySavedDirects;
                            console.log(this.myDirectAssets);
                            this.idaUtilsService.getMySavedIndirectAssets(this.mySelf)
                                .toPromise().then((mySavedIndirects) => {
                                    this.myIndirectAssets = mySavedIndirects;
                                    for (let i = 0; i < this.myDirectAssets.length; i++) {
                                        this.myDirectAssets[i].effects =
                                            this.idaUtilsService.getSavedIndirectFromDirect(this.myDirectAssets[i], this.myIndirectAssets);
                                    }
                                    console.log(this.myDirectAssets);
                                    console.log(this.myIndirectAssets);
                                    // this.ref.detectChanges();
                                    this.loading = false;
                                    this.loadWithErrors = false;
                                }).catch(() => {
                                    this.loading = false;
                                    this.loadWithErrors = true;
                                });
                        });
        */
    }
}
