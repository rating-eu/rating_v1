import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { TranslationMgm } from './translation-mgm.model';
import { TranslationMgmService } from './translation-mgm.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-translation-mgm',
    templateUrl: './translation-mgm.component.html'
})
export class TranslationMgmComponent implements OnInit, OnDestroy {
translations: TranslationMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private translationService: TranslationMgmService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.translationService.query().subscribe(
            (res: HttpResponse<TranslationMgm[]>) => {
                this.translations = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInTranslations();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: TranslationMgm) {
        return item.id;
    }
    registerChangeInTranslations() {
        this.eventSubscriber = this.eventManager.subscribe('translationListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
