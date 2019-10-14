import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { GDPRQuestionnaireStatusMgm } from './gdpr-questionnaire-status-mgm.model';
import { GDPRQuestionnaireStatusMgmService } from './gdpr-questionnaire-status-mgm.service';

@Injectable()
export class GDPRQuestionnaireStatusMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private gDPRQuestionnaireStatusService: GDPRQuestionnaireStatusMgmService

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
                this.gDPRQuestionnaireStatusService.find(id)
                    .subscribe((gDPRQuestionnaireStatusResponse: HttpResponse<GDPRQuestionnaireStatusMgm>) => {
                        const gDPRQuestionnaireStatus: GDPRQuestionnaireStatusMgm = gDPRQuestionnaireStatusResponse.body;
                        this.ngbModalRef = this.gDPRQuestionnaireStatusModalRef(component, gDPRQuestionnaireStatus);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.gDPRQuestionnaireStatusModalRef(component, new GDPRQuestionnaireStatusMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    gDPRQuestionnaireStatusModalRef(component: Component, gDPRQuestionnaireStatus: GDPRQuestionnaireStatusMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.gDPRQuestionnaireStatus = gDPRQuestionnaireStatus;
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
