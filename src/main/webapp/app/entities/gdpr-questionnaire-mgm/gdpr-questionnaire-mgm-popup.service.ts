import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { GDPRQuestionnaireMgm } from './gdpr-questionnaire-mgm.model';
import { GDPRQuestionnaireMgmService } from './gdpr-questionnaire-mgm.service';

@Injectable()
export class GDPRQuestionnaireMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private gDPRQuestionnaireService: GDPRQuestionnaireMgmService

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
                this.gDPRQuestionnaireService.find(id)
                    .subscribe((gDPRQuestionnaireResponse: HttpResponse<GDPRQuestionnaireMgm>) => {
                        const gDPRQuestionnaire: GDPRQuestionnaireMgm = gDPRQuestionnaireResponse.body;
                        this.ngbModalRef = this.gDPRQuestionnaireModalRef(component, gDPRQuestionnaire);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.gDPRQuestionnaireModalRef(component, new GDPRQuestionnaireMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    gDPRQuestionnaireModalRef(component: Component, gDPRQuestionnaire: GDPRQuestionnaireMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.gDPRQuestionnaire = gDPRQuestionnaire;
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
