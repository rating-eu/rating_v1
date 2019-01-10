import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';

import { LogoMgm } from './logo-mgm.model';
import { LogoMgmService } from './logo-mgm.service';

@Component({
    selector: 'jhi-logo-mgm-detail',
    templateUrl: './logo-mgm-detail.component.html'
})
export class LogoMgmDetailComponent implements OnInit, OnDestroy {

    logo: LogoMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private dataUtils: JhiDataUtils,
        private logoService: LogoMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInLogos();
    }

    load(id) {
        this.logoService.find(id)
            .subscribe((logoResponse: HttpResponse<LogoMgm>) => {
                this.logo = logoResponse.body;
            });
    }
    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInLogos() {
        this.eventSubscriber = this.eventManager.subscribe(
            'logoListModification',
            (response) => this.load(this.logo.id)
        );
    }
}
