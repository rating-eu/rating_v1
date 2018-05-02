import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { DepartmentMgm } from './department-mgm.model';
import { DepartmentMgmPopupService } from './department-mgm-popup.service';
import { DepartmentMgmService } from './department-mgm.service';

@Component({
    selector: 'jhi-department-mgm-delete-dialog',
    templateUrl: './department-mgm-delete-dialog.component.html'
})
export class DepartmentMgmDeleteDialogComponent {

    department: DepartmentMgm;

    constructor(
        private departmentService: DepartmentMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.departmentService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'departmentListModification',
                content: 'Deleted an department'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-department-mgm-delete-popup',
    template: ''
})
export class DepartmentMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private departmentPopupService: DepartmentMgmPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.departmentPopupService
                .open(DepartmentMgmDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
