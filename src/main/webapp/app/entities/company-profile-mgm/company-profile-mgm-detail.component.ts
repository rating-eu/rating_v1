import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { CompanyProfileMgm } from './company-profile-mgm.model';
import { CompanyProfileMgmService } from './company-profile-mgm.service';

@Component({
    selector: 'jhi-company-profile-mgm-detail',
    templateUrl: './company-profile-mgm-detail.component.html'
})
export class CompanyProfileMgmDetailComponent implements OnInit, OnDestroy {

    companyProfile: CompanyProfileMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private companyProfileService: CompanyProfileMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInCompanyProfiles();
    }

    load(id) {
        this.companyProfileService.find(id)
            .subscribe((companyProfileResponse: HttpResponse<CompanyProfileMgm>) => {
                this.companyProfile = companyProfileResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInCompanyProfiles() {
        this.eventSubscriber = this.eventManager.subscribe(
            'companyProfileListModification',
            (response) => this.load(this.companyProfile.id)
        );
    }
}
