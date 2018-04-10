import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { ThreatAgentMgmComponent } from './threat-agent-mgm.component';
import { ThreatAgentMgmDetailComponent } from './threat-agent-mgm-detail.component';
import { ThreatAgentMgmPopupComponent } from './threat-agent-mgm-dialog.component';
import { ThreatAgentMgmDeletePopupComponent } from './threat-agent-mgm-delete-dialog.component';

export const threatAgentRoute: Routes = [
    {
        path: 'threat-agent-mgm',
        component: ThreatAgentMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.threatAgent.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'threat-agent-mgm/:id',
        component: ThreatAgentMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.threatAgent.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const threatAgentPopupRoute: Routes = [
    {
        path: 'threat-agent-mgm-new',
        component: ThreatAgentMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.threatAgent.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'threat-agent-mgm/:id/edit',
        component: ThreatAgentMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.threatAgent.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'threat-agent-mgm/:id/delete',
        component: ThreatAgentMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.threatAgent.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
