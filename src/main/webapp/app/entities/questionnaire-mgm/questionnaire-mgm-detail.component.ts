import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { QuestionnaireMgm } from './questionnaire-mgm.model';
import { QuestionnaireMgmService } from './questionnaire-mgm.service';

@Component({
    selector: 'jhi-questionnaire-mgm-detail',
    templateUrl: './questionnaire-mgm-detail.component.html'
})
export class QuestionnaireMgmDetailComponent implements OnInit, OnDestroy {

    questionnaire: QuestionnaireMgm;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private questionnaireService: QuestionnaireMgmService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInQuestionnaires();
    }

    load(id) {
        this.questionnaireService.find(id)
            .subscribe((questionnaireResponse: HttpResponse<QuestionnaireMgm>) => {
                this.questionnaire = questionnaireResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInQuestionnaires() {
        this.eventSubscriber = this.eventManager.subscribe(
            'questionnaireListModification',
            (response) => this.load(this.questionnaire.id)
        );
    }
}
