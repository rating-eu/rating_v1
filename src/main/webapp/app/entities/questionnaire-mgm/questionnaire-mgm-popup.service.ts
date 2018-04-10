import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { QuestionnaireMgm } from './questionnaire-mgm.model';
import { QuestionnaireMgmService } from './questionnaire-mgm.service';

@Injectable()
export class QuestionnaireMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private questionnaireService: QuestionnaireMgmService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.questionnaireService.find(id)
                    .subscribe((questionnaireResponse: HttpResponse<QuestionnaireMgm>) => {
                        const questionnaire: QuestionnaireMgm = questionnaireResponse.body;
                        questionnaire.created = this.datePipe
                            .transform(questionnaire.created, 'yyyy-MM-ddTHH:mm:ss');
                        questionnaire.modified = this.datePipe
                            .transform(questionnaire.modified, 'yyyy-MM-ddTHH:mm:ss');
                        this.ngbModalRef = this.questionnaireModalRef(component, questionnaire);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.questionnaireModalRef(component, new QuestionnaireMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    questionnaireModalRef(component: Component, questionnaire: QuestionnaireMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.questionnaire = questionnaire;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
