import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { DataRiskLevelConfigMgmComponent } from './data-risk-level-config-mgm.component';
import { DataRiskLevelConfigMgmDetailComponent } from './data-risk-level-config-mgm-detail.component';
import { DataRiskLevelConfigMgmPopupComponent } from './data-risk-level-config-mgm-dialog.component';
import { DataRiskLevelConfigMgmDeletePopupComponent } from './data-risk-level-config-mgm-delete-dialog.component';

export const dataRiskLevelConfigRoute: Routes = [
    {
        path: 'data-risk-level-config-mgm',
        component: DataRiskLevelConfigMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.dataRiskLevelConfig.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'data-risk-level-config-mgm/:id',
        component: DataRiskLevelConfigMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.dataRiskLevelConfig.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const dataRiskLevelConfigPopupRoute: Routes = [
    {
        path: 'data-risk-level-config-mgm-new',
        component: DataRiskLevelConfigMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.dataRiskLevelConfig.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'data-risk-level-config-mgm/:id/edit',
        component: DataRiskLevelConfigMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.dataRiskLevelConfig.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'data-risk-level-config-mgm/:id/delete',
        component: DataRiskLevelConfigMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.dataRiskLevelConfig.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
