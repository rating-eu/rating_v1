import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { LevelMgm } from './level-mgm.model';
import { LevelMgmService } from './level-mgm.service';

@Component({
    selector: 'jhi-level-mgm-detail',
    templateUrl: './level-mgm-detail.component.html'
})
export class LevelMgmDetailComponent implements OnInit, OnDestroy {

    level: LevelMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private levelService: LevelMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInLevels();
    }

    load(id) {
        this.levelService.find(id)
            .subscribe((levelResponse: HttpResponse<LevelMgm>) => {
                this.level = levelResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInLevels() {
        this.eventSubscriber = this.eventManager.subscribe(
            'levelListModification',
            (response) => this.load(this.level.id)
        );
    }
}
