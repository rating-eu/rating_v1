import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ThreatAgentMgm } from './threat-agent-mgm.model';
import { ThreatAgentMgmPopupService } from './threat-agent-mgm-popup.service';
import { ThreatAgentMgmService } from './threat-agent-mgm.service';
import {SessionStorageService} from 'ngx-webstorage';
import {PopUpService} from '../../shared/pop-up-services/pop-up.service';

@Component({
    selector: 'jhi-threat-agent-mgm-delete-dialog',
    templateUrl: './threat-agent-mgm-delete-dialog.component.html'
})
export class ThreatAgentMgmDeleteDialogComponent {

    threatAgent: ThreatAgentMgm;

    constructor(
        private threatAgentService: ThreatAgentMgmService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.threatAgentService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'threatAgentListModification',
                content: 'Deleted an threatAgent'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-threat-agent-mgm-delete-popup',
    template: ''
})
export class ThreatAgentMgmDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private threatAgentPopupService: ThreatAgentMgmPopupService,
        private popUpService: PopUpService
    ) {}

    ngOnInit() {
        if (!this.popUpService.canOpen()) {
            return;
        } else {
            this.routeSub = this.route.params.subscribe((params) => {
                this.threatAgentPopupService
                    .open(ThreatAgentMgmDeleteDialogComponent as Component, params['id']);
            });
        }
    }

    ngOnDestroy() {
        if(this.routeSub){
            this.routeSub.unsubscribe();
        }
    }
}
