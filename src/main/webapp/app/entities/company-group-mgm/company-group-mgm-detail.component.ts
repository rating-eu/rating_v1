import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { CompanyGroupMgm } from './company-group-mgm.model';
import { CompanyGroupMgmService } from './company-group-mgm.service';

@Component({
    selector: 'jhi-company-group-mgm-detail',
    templateUrl: './company-group-mgm-detail.component.html'
})
export class CompanyGroupMgmDetailComponent implements OnInit, OnDestroy {

    companyGroup: CompanyGroupMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private companyGroupService: CompanyGroupMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInCompanyGroups();
    }

    load(id) {
        this.companyGroupService.find(id)
            .subscribe((companyGroupResponse: HttpResponse<CompanyGroupMgm>) => {
                this.companyGroup = companyGroupResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInCompanyGroups() {
        this.eventSubscriber = this.eventManager.subscribe(
            'companyGroupListModification',
            (response) => this.load(this.companyGroup.id)
        );
    }
}
