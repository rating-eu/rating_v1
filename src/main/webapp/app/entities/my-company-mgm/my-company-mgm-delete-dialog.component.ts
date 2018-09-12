import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { MyCompanyMgm } from './my-company-mgm.model';
import { MyCompanyMgmPopupService } from './my-company-mgm-popup.service';
import { MyCompanyMgmService } from './my-company-mgm.service';

@Component({
    selector: 'jhi-my-company-mgm-delete-dialog',
    templateUrl: './my-company-mgm-delete-dialog.component.html'
})
export class MyCompanyMgmDeleteDialogComponent {

    myCompany: MyCompanyMgm;

    constructor(
        private myCompanyService: MyCompanyMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.myCompanyService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'myCompanyListModification',
                content: 'Deleted an myCompany'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-my-company-mgm-delete-popup',
    template: ''
})
export class MyCompanyMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private myCompanyPopupService: MyCompanyMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.myCompanyPopupService
                .open(MyCompanyMgmDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
