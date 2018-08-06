import {Component, OnInit, OnDestroy} from '@angular/core';
import {HttpResponse, HttpErrorResponse} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {JhiEventManager, JhiAlertService} from 'ng-jhipster';

import {SelfAssessmentMgm} from './self-assessment-mgm.model';
import {SelfAssessmentMgmService} from './self-assessment-mgm.service';
import {Principal} from '../../shared';

@Component({
    selector: 'jhi-self-assessment-mgm',
    templateUrl: './self-assessment-mgm.component.html'
})
export class SelfAssessmentMgmComponent implements OnInit, OnDestroy {
    selfAssessments: SelfAssessmentMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private router: Router,
        private selfAssessmentService: SelfAssessmentMgmService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch = this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ?
            this.activatedRoute.snapshot.params['search'] : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.selfAssessmentService.search({
                query: this.currentSearch,
            }).subscribe(
                (res: HttpResponse<SelfAssessmentMgm[]>) => this.selfAssessments = res.body,
                (res: HttpErrorResponse) => this.onError(res.message)
            );
            return;
        }
        this.selfAssessmentService.query().subscribe(
            (res: HttpResponse<SelfAssessmentMgm[]>) => {
                this.selfAssessments = res.body;
                this.currentSearch = '';
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    search(query) {
        if (!query) {
            return this.clear();
        }
        this.currentSearch = query;
        this.loadAll();
    }

    clear() {
        this.currentSearch = '';
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
        this.selfAssessmentService.setSelfAssessment(selfAssessment);
        const link = ['/'];
        // this.mySidemenuService.roomeMenu('collapsed');
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
