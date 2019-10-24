import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { SystemConfigMgm } from './system-config-mgm.model';
import { SystemConfigMgmService } from './system-config-mgm.service';

@Component({
    selector: 'jhi-system-config-mgm-detail',
    templateUrl: './system-config-mgm-detail.component.html'
})
export class SystemConfigMgmDetailComponent implements OnInit, OnDestroy {

    systemConfig: SystemConfigMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private systemConfigService: SystemConfigMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInSystemConfigs();
    }

    load(id) {
        this.systemConfigService.find(id)
            .subscribe((systemConfigResponse: HttpResponse<SystemConfigMgm>) => {
                this.systemConfig = systemConfigResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInSystemConfigs() {
        this.eventSubscriber = this.eventManager.subscribe(
            'systemConfigListModification',
            (response) => this.load(this.systemConfig.id)
        );
    }
}
