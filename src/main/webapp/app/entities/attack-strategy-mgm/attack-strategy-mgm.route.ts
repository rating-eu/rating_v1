import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { AttackStrategyMgmComponent } from './attack-strategy-mgm.component';
import { AttackStrategyMgmDetailComponent } from './attack-strategy-mgm-detail.component';
import { AttackStrategyMgmPopupComponent } from './attack-strategy-mgm-dialog.component';
import { AttackStrategyMgmDeletePopupComponent } from './attack-strategy-mgm-delete-dialog.component';

export const attackStrategyRoute: Routes = [
    {
        path: 'attack-strategy-mgm',
        component: AttackStrategyMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.attackStrategy.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'attack-strategy-mgm/:id',
        component: AttackStrategyMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.attackStrategy.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const attackStrategyPopupRoute: Routes = [
    {
        path: 'attack-strategy-mgm-new',
        component: AttackStrategyMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.attackStrategy.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'attack-strategy-mgm/:id/edit',
        component: AttackStrategyMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.attackStrategy.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'attack-strategy-mgm/:id/delete',
        component: AttackStrategyMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.attackStrategy.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
