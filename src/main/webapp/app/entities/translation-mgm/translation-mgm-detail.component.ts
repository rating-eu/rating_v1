import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { TranslationMgm } from './translation-mgm.model';
import { TranslationMgmService } from './translation-mgm.service';

@Component({
    selector: 'jhi-translation-mgm-detail',
    templateUrl: './translation-mgm-detail.component.html'
})
export class TranslationMgmDetailComponent implements OnInit, OnDestroy {

    translation: TranslationMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private translationService: TranslationMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInTranslations();
    }

    load(id) {
        this.translationService.find(id)
            .subscribe((translationResponse: HttpResponse<TranslationMgm>) => {
                this.translation = translationResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInTranslations() {
        this.eventSubscriber = this.eventManager.subscribe(
            'translationListModification',
            (response) => this.load(this.translation.id)
        );
    }
}
