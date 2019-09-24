import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { DataRecipientMgmComponent } from './data-recipient-mgm.component';
import { DataRecipientMgmDetailComponent } from './data-recipient-mgm-detail.component';
import { DataRecipientMgmPopupComponent } from './data-recipient-mgm-dialog.component';
import { DataRecipientMgmDeletePopupComponent } from './data-recipient-mgm-delete-dialog.component';

export const dataRecipientRoute: Routes = [
    {
        path: 'data-recipient-mgm',
        component: DataRecipientMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.dataRecipient.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'data-recipient-mgm/:id',
        component: DataRecipientMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.dataRecipient.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const dataRecipientPopupRoute: Routes = [
    {
        path: 'data-recipient-mgm-new',
        component: DataRecipientMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.dataRecipient.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'data-recipient-mgm/:id/edit',
        component: DataRecipientMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.dataRecipient.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'data-recipient-mgm/:id/delete',
        component: DataRecipientMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.dataRecipient.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
