import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { ContainerMgm } from './container-mgm.model';
import { ContainerMgmService } from './container-mgm.service';
import { PopUpService } from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-container-mgm-detail',
    templateUrl: './container-mgm-detail.component.html'
})
export class ContainerMgmDetailComponent implements OnInit, OnDestroy {

    container: ContainerMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private containerService: ContainerMgmService,
        private route: ActivatedRoute,
        public popUpService: PopUpService
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInContainers();
    }

    load(id) {
        this.containerService.find(id)
            .subscribe((containerResponse: HttpResponse<ContainerMgm>) => {
                this.container = containerResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInContainers() {
        this.eventSubscriber = this.eventManager.subscribe(
            'containerListModification',
            (response) => this.load(this.container.id)
        );
    }
}
