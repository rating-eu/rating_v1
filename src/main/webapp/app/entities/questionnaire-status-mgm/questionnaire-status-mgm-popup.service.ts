import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { QuestionnaireStatusMgm } from './questionnaire-status-mgm.model';
import { QuestionnaireStatusMgmService } from './questionnaire-status-mgm.service';

@Injectable()
export class QuestionnaireStatusMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private questionnaireStatusService: QuestionnaireStatusMgmService

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
                this.questionnaireStatusService.find(id)
                    .subscribe((questionnaireStatusResponse: HttpResponse<QuestionnaireStatusMgm>) => {
                        const questionnaireStatus: QuestionnaireStatusMgm = questionnaireStatusResponse.body;
                        questionnaireStatus.created = this.datePipe
                            .transform(questionnaireStatus.created, 'yyyy-MM-ddTHH:mm:ss');
                        questionnaireStatus.modified = this.datePipe
                            .transform(questionnaireStatus.modified, 'yyyy-MM-ddTHH:mm:ss');
                        this.ngbModalRef = this.questionnaireStatusModalRef(component, questionnaireStatus);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.questionnaireStatusModalRef(component, new QuestionnaireStatusMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    questionnaireStatusModalRef(component: Component, questionnaireStatus: QuestionnaireStatusMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.questionnaireStatus = questionnaireStatus;
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
