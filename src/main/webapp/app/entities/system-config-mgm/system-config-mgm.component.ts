import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { SystemConfigMgm } from './system-config-mgm.model';
import { SystemConfigMgmService } from './system-config-mgm.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-system-config-mgm',
    templateUrl: './system-config-mgm.component.html'
})
export class SystemConfigMgmComponent implements OnInit, OnDestroy {
systemConfigs: SystemConfigMgm[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private systemConfigService: SystemConfigMgmService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.systemConfigService.query().subscribe(
            (res: HttpResponse<SystemConfigMgm[]>) => {
                this.systemConfigs = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInSystemConfigs();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: SystemConfigMgm) {
        return item.id;
    }
    registerChangeInSystemConfigs() {
        this.eventSubscriber = this.eventManager.subscribe('systemConfigListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
