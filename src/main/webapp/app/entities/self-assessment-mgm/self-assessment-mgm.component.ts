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

import {Component, OnInit, OnDestroy} from '@angular/core';
import {HttpResponse, HttpErrorResponse} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {JhiEventManager, JhiAlertService} from 'ng-jhipster';

import {SelfAssessmentMgm} from './self-assessment-mgm.model';
import {SelfAssessmentMgmService} from './self-assessment-mgm.service';
import {Principal} from '../../shared';

import {DataSharingService} from '../../data-sharing/data-sharing.service';
import {LayoutConfiguration} from '../../layouts/model/LayoutConfiguration';
import {PopUpService} from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-self-assessment-mgm',
    templateUrl: './self-assessment-mgm.component.html'
})
export class SelfAssessmentMgmComponent implements OnInit, OnDestroy {
    selfAssessments: SelfAssessmentMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private router: Router,
        private selfAssessmentService: SelfAssessmentMgmService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal,
        public popUpService: PopUpService,
        private dataSharingService: DataSharingService
    ) {
    }

    loadAll() {
        this.selfAssessmentService.query().subscribe(
            (res: HttpResponse<SelfAssessmentMgm[]>) => {
                this.selfAssessments = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    clear() {
        this.loadAll();
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInSelfAssessments();
    }

    selectSelfAssessment(selfAssessment: SelfAssessmentMgm) {
        this.dataSharingService.selfAssessment = selfAssessment;
        const link = ['/'];
        // this.mySidemenuService.roomeMenu('collapsed');
        const layoutConfiguration: LayoutConfiguration = new LayoutConfiguration();
        layoutConfiguration.navSubTitle = selfAssessment.name;
        this.dataSharingService.layoutConfiguration = layoutConfiguration;
        this.router.navigate(link);
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: SelfAssessmentMgm) {
        return item.id;
    }

    registerChangeInSelfAssessments() {
        this.eventSubscriber = this.eventManager.subscribe('selfAssessmentListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
