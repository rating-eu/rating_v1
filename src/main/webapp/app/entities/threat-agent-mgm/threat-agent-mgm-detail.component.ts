import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { ThreatAgentMgm } from './threat-agent-mgm.model';
import { ThreatAgentMgmService } from './threat-agent-mgm.service';

@Component({
    selector: 'jhi-threat-agent-mgm-detail',
    templateUrl: './threat-agent-mgm-detail.component.html'
})
export class ThreatAgentMgmDetailComponent implements OnInit, OnDestroy {

    threatAgent: ThreatAgentMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private threatAgentService: ThreatAgentMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInThreatAgents();
    }

    load(id) {
        this.threatAgentService.find(id)
            .subscribe((threatAgentResponse: HttpResponse<ThreatAgentMgm>) => {
                this.threatAgent = threatAgentResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInThreatAgents() {
        this.eventSubscriber = this.eventManager.subscribe(
            'threatAgentListModification',
            (response) => this.load(this.threatAgent.id)
        );
    }
}
