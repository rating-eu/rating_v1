import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { SystemConfigMgm } from './system-config-mgm.model';
import { SystemConfigMgmService } from './system-config-mgm.service';

@Injectable()
export class SystemConfigMgmPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private systemConfigService: SystemConfigMgmService

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
                this.systemConfigService.find(id)
                    .subscribe((systemConfigResponse: HttpResponse<SystemConfigMgm>) => {
                        const systemConfig: SystemConfigMgm = systemConfigResponse.body;
                        this.ngbModalRef = this.systemConfigModalRef(component, systemConfig);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.systemConfigModalRef(component, new SystemConfigMgm());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    systemConfigModalRef(component: Component, systemConfig: SystemConfigMgm): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.systemConfig = systemConfig;
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
