import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { MyCompanyMgm } from './my-company-mgm.model';
import { MyCompanyMgmService } from './my-company-mgm.service';

@Component({
    selector: 'jhi-my-company-mgm-detail',
    templateUrl: './my-company-mgm-detail.component.html'
})
export class MyCompanyMgmDetailComponent implements OnInit, OnDestroy {

    myCompany: MyCompanyMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private myCompanyService: MyCompanyMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInMyCompanies();
    }

    load(id) {
        this.myCompanyService.find(id)
            .subscribe((myCompanyResponse: HttpResponse<MyCompanyMgm>) => {
                this.myCompany = myCompanyResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInMyCompanies() {
        this.eventSubscriber = this.eventManager.subscribe(
            'myCompanyListModification',
            (response) => this.load(this.myCompany.id)
        );
    }
}
