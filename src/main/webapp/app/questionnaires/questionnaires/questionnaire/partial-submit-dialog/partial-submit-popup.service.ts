import {Component, Injectable} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class PartialSubmitPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
    ) {
        this.ngbModalRef = null;
    }

    open(component: Component): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            } else {
                this.ngbModalRef = this.partialSubmitModalRef(component);
                resolve(this.ngbModalRef);
            }
        });
    }

    partialSubmitModalRef(component: Component): NgbModalRef {
        const modalRef = this.modalService.open(component, {size: 'lg', backdrop: 'static'});

        return modalRef;
    }
}
