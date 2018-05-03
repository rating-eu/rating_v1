import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { LevelWrapperMgm } from './level-wrapper-mgm.model';
import { LevelWrapperMgmService } from './level-wrapper-mgm.service';

@Component({
    selector: 'jhi-level-wrapper-mgm-detail',
    templateUrl: './level-wrapper-mgm-detail.component.html'
})
export class LevelWrapperMgmDetailComponent implements OnInit, OnDestroy {

    levelWrapper: LevelWrapperMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private levelWrapperService: LevelWrapperMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInLevelWrappers();
    }

    load(id) {
        this.levelWrapperService.find(id)
            .subscribe((levelWrapperResponse: HttpResponse<LevelWrapperMgm>) => {
                this.levelWrapper = levelWrapperResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInLevelWrappers() {
        this.eventSubscriber = this.eventManager.subscribe(
            'levelWrapperListModification',
            (response) => this.load(this.levelWrapper.id)
        );
    }
}
