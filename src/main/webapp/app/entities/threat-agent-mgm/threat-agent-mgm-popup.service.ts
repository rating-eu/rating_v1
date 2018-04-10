import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ThreatAgentMgm } from './threat-agent-mgm.model';
import { ThreatAgentMgmService } from './threat-agent-mgm.service';

@Injectable()
export class ThreatAgentMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private threatAgentService: ThreatAgentMgmService

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
                this.threatAgentService.find(id)
                    .subscribe((threatAgentResponse: HttpResponse<ThreatAgentMgm>) => {
                        const threatAgent: ThreatAgentMgm = threatAgentResponse.body;
                        threatAgent.created = this.datePipe
                            .transform(threatAgent.created, 'yyyy-MM-ddTHH:mm:ss');
                        threatAgent.modified = this.datePipe
                            .transform(threatAgent.modified, 'yyyy-MM-ddTHH:mm:ss');
                        this.ngbModalRef = this.threatAgentModalRef(component, threatAgent);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.threatAgentModalRef(component, new ThreatAgentMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    threatAgentModalRef(component: Component, threatAgent: ThreatAgentMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.threatAgent = threatAgent;
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
