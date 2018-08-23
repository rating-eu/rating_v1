import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { SelfAssessmentMgm } from './self-assessment-mgm.model';
import { SelfAssessmentMgmService } from './self-assessment-mgm.service';

@Component({
    selector: 'jhi-self-assessment-mgm-detail',
    templateUrl: './self-assessment-mgm-detail.component.html'
})
export class SelfAssessmentMgmDetailComponent implements OnInit, OnDestroy {

    selfAssessment: SelfAssessmentMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private selfAssessmentService: SelfAssessmentMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInSelfAssessments();
    }

    load(id) {
        this.selfAssessmentService.find(id)
            .subscribe((selfAssessmentResponse: HttpResponse<SelfAssessmentMgm>) => {
                this.selfAssessment = selfAssessmentResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInSelfAssessments() {
        this.eventSubscriber = this.eventManager.subscribe(
            'selfAssessmentListModification',
            (response) => this.load(this.selfAssessment.id)
        );
    }
}
