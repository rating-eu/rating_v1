import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { MyAnswerMgm } from './my-answer-mgm.model';
import { MyAnswerMgmService } from './my-answer-mgm.service';

@Injectable()
export class MyAnswerMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private myAnswerService: MyAnswerMgmService

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
                this.myAnswerService.find(id)
                    .subscribe((myAnswerResponse: HttpResponse<MyAnswerMgm>) => {
                        const myAnswer: MyAnswerMgm = myAnswerResponse.body;
                        this.ngbModalRef = this.myAnswerModalRef(component, myAnswer);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.myAnswerModalRef(component, new MyAnswerMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    myAnswerModalRef(component: Component, myAnswer: MyAnswerMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.myAnswer = myAnswer;
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
