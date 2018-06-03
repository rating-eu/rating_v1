import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { CompanyGroupMgm } from './company-group-mgm.model';
import { CompanyGroupMgmService } from './company-group-mgm.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-company-group-mgm',
    templateUrl: './company-group-mgm.component.html'
})
export class CompanyGroupMgmComponent implements OnInit, OnDestroy {
companyGroups: CompanyGroupMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private companyGroupService: CompanyGroupMgmService,
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
            this.companyGroupService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: HttpResponse<CompanyGroupMgm[]>) => this.companyGroups = res.body,
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
       }
        this.companyGroupService.query().subscribe(
            (res: HttpResponse<CompanyGroupMgm[]>) => {
                this.companyGroups = res.body;
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
        this.registerChangeInCompanyGroups();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: CompanyGroupMgm) {
        return item.id;
    }
    registerChangeInCompanyGroups() {
        this.eventSubscriber = this.eventManager.subscribe('companyGroupListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
