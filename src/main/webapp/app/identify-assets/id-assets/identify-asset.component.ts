import {Component, OnInit} from '@angular/core';
import {IdentifyAssetService} from '../identify-asset.service';
import {Asset} from '../models/Asset';

@Component({
    selector: 'jhi-identify-asset',
    templateUrl: './identify-asset.component.html',
    styles: [],
    providers: [IdentifyAssetService]
})
export class IdentifyAssetComponent implements OnInit {
    assets: Asset[];

    constructor(
        private identifyAssetService: IdentifyAssetService)	{
    }

    ngOnInit() {
        this.getAllAssets();
    }

    getAllAssets() {
        this.identifyAssetService.findAll().subscribe(
            (response) => {
                this.assets = response;

                console.log('Data: ' + JSON.stringify(this.assets));

                this.assets.forEach(function(asset) {
                    console.log('AssetMgm: ' + JSON.stringify(Asset));
                });
            },
            (error) => {
                console.log(error);
            }
        );
    }

    previousState() {
        window.history.back();
    }
}
