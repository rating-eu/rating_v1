import {Subscription} from 'rxjs/Subscription';
import {Mode} from './../entities/enumerations/Mode.enum';
import {DatasharingService} from './../datasharing/datasharing.service';
import {Component, OnInit, OnDestroy} from '@angular/core';

@Component({
    selector: 'jhi-about',
    templateUrl: './about.us.component.html',
    styleUrls: [
        'home.css'
    ]
})
export class AboutUsComponent implements OnInit, OnDestroy {
    private modeSubs: Subscription;
    public modeEnum = Mode;
    public mode: Mode;

    constructor(
        private dataSharing: DatasharingService
    ) {

    }

    ngOnInit() {
        this.modeSubs = this.dataSharing.observeMode().subscribe((mode: Mode) => {
            if (mode) {
                this.mode = mode;
            }
        });
    }

    ngOnDestroy() {
        this.modeSubs.unsubscribe();
    }
}
