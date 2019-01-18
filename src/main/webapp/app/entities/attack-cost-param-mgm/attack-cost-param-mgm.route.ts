import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { AttackCostParamMgmComponent } from './attack-cost-param-mgm.component';
import { AttackCostParamMgmDetailComponent } from './attack-cost-param-mgm-detail.component';
import { AttackCostParamMgmPopupComponent } from './attack-cost-param-mgm-dialog.component';
import { AttackCostParamMgmDeletePopupComponent } from './attack-cost-param-mgm-delete-dialog.component';

export const attackCostParamRoute: Routes = [
    {
        path: 'attack-cost-param-mgm',
        component: AttackCostParamMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.attackCostParam.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'attack-cost-param-mgm/:id',
        component: AttackCostParamMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.attackCostParam.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const attackCostParamPopupRoute: Routes = [
    {
        path: 'attack-cost-param-mgm-new',
        component: AttackCostParamMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.attackCostParam.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'attack-cost-param-mgm/:id/edit',
        component: AttackCostParamMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.attackCostParam.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'attack-cost-param-mgm/:id/delete',
        component: AttackCostParamMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.attackCostParam.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
