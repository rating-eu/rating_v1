/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

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
