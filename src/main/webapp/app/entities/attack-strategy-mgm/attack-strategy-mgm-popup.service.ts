import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { AttackStrategyMgm } from './attack-strategy-mgm.model';
import { AttackStrategyMgmService } from './attack-strategy-mgm.service';

@Injectable()
export class AttackStrategyMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private attackStrategyService: AttackStrategyMgmService

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
                this.attackStrategyService.find(id)
                    .subscribe((attackStrategyResponse: HttpResponse<AttackStrategyMgm>) => {
                        const attackStrategy: AttackStrategyMgm = attackStrategyResponse.body;
                        attackStrategy.created = this.datePipe
                            .transform(attackStrategy.created, 'yyyy-MM-ddTHH:mm:ss');
                        attackStrategy.modified = this.datePipe
                            .transform(attackStrategy.modified, 'yyyy-MM-ddTHH:mm:ss');
                        this.ngbModalRef = this.attackStrategyModalRef(component, attackStrategy);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.attackStrategyModalRef(component, new AttackStrategyMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    attackStrategyModalRef(component: Component, attackStrategy: AttackStrategyMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.attackStrategy = attackStrategy;
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
