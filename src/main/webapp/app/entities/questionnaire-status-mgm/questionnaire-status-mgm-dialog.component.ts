import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { QuestionnaireStatusMgm } from './questionnaire-status-mgm.model';
import { QuestionnaireStatusMgmPopupService } from './questionnaire-status-mgm-popup.service';
import { QuestionnaireStatusMgmService } from './questionnaire-status-mgm.service';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../self-assessment-mgm';
import { QuestionnaireMgm, QuestionnaireMgmService } from '../questionnaire-mgm';
import { User, UserService } from '../../shared';
import {SessionStorageService} from 'ngx-webstorage';
import {PopUpService} from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-questionnaire-status-mgm-dialog',
    templateUrl: './questionnaire-status-mgm-dialog.component.html'
})
export class QuestionnaireStatusMgmDialogComponent implements OnInit {

    questionnaireStatus: QuestionnaireStatusMgm;
    isSaving: boolean;

    selfassessments: SelfAssessmentMgm[];

    questionnaires: QuestionnaireMgm[];

    users: User[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private questionnaireStatusService: QuestionnaireStatusMgmService,
        private selfAssessmentService: SelfAssessmentMgmService,
        private questionnaireService: QuestionnaireMgmService,
        private userService: UserService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.selfAssessmentService
            .query({filter: 'questionnairestatus-is-null'})
            .subscribe((res: HttpResponse<SelfAssessmentMgm[]>) => {
                if (!this.questionnaireStatus.selfAssessment || !this.questionnaireStatus.selfAssessment.id) {
                    this.selfassessments = res.body;
                } else {
                    this.selfAssessmentService
                        .find(this.questionnaireStatus.selfAssessment.id)
                        .subscribe((subRes: HttpResponse<SelfAssessmentMgm>) => {
                            this.selfassessments = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
        this.questionnaireService
            .query({filter: 'questionnairestatus-is-null'})
            .subscribe((res: HttpResponse<QuestionnaireMgm[]>) => {
                if (!this.questionnaireStatus.questionnaire || !this.questionnaireStatus.questionnaire.id) {
                    this.questionnaires = res.body;
                } else {
                    this.questionnaireService
                        .find(this.questionnaireStatus.questionnaire.id)
                        .subscribe((subRes: HttpResponse<QuestionnaireMgm>) => {
                            this.questionnaires = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
        this.userService.query()
            .subscribe((res: HttpResponse<User[]>) => { this.users = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.questionnaireStatus.id !== undefined) {
            this.subscribeToSaveResponse(
                this.questionnaireStatusService.update(this.questionnaireStatus));
        } else {
            this.subscribeToSaveResponse(
                this.questionnaireStatusService.create(this.questionnaireStatus));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<QuestionnaireStatusMgm>>) {
        result.subscribe((res: HttpResponse<QuestionnaireStatusMgm>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: QuestionnaireStatusMgm) {
        this.eventManager.broadcast({ name: 'questionnaireStatusListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackSelfAssessmentById(index: number, item: SelfAssessmentMgm) {
        return item.id;
    }

    trackQuestionnaireById(index: number, item: QuestionnaireMgm) {
        return item.id;
    }

    trackUserById(index: number, item: User) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-questionnaire-status-mgm-popup',
    template: ''
})
export class QuestionnaireStatusMgmPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private questionnaireStatusPopupService: QuestionnaireStatusMgmPopupService,
        private popUpService: PopUpService
    ) {}

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        }else {
            this.routeSub = this.route.params.subscribe((params) => {
                if ( params['id'] ) {
                    this.questionnaireStatusPopupService
                        .open(QuestionnaireStatusMgmDialogComponent as Component, params['id']);
                } else {
                    this.questionnaireStatusPopupService
                        .open(QuestionnaireStatusMgmDialogComponent as Component);
                }
            });
        }
    }

    ngOnDestroy() {
        if(this.routeSub){
            this.routeSub.unsubscribe();
        }
    }
}
