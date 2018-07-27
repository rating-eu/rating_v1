import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { AttackCostMgmComponent } from './attack-cost-mgm.component';
import { AttackCostMgmDetailComponent } from './attack-cost-mgm-detail.component';
import { AttackCostMgmPopupComponent } from './attack-cost-mgm-dialog.component';
import { AttackCostMgmDeletePopupComponent } from './attack-cost-mgm-delete-dialog.component';

export const attackCostRoute: Routes = [
    {
        path: 'attack-cost-mgm',
        component: AttackCostMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.attackCost.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'attack-cost-mgm/:id',
        component: AttackCostMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.attackCost.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const attackCostPopupRoute: Routes = [
    {
        path: 'attack-cost-mgm-new',
        component: AttackCostMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.attackCost.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'attack-cost-mgm/:id/edit',
        component: AttackCostMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.attackCost.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'attack-cost-mgm/:id/delete',
        component: AttackCostMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.attackCost.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
