import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { TranslationMgmComponent } from './translation-mgm.component';
import { TranslationMgmDetailComponent } from './translation-mgm-detail.component';
import { TranslationMgmPopupComponent } from './translation-mgm-dialog.component';
import { TranslationMgmDeletePopupComponent } from './translation-mgm-delete-dialog.component';

export const translationRoute: Routes = [
    {
        path: 'translation-mgm',
        component: TranslationMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.translation.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'translation-mgm/:id',
        component: TranslationMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.translation.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const translationPopupRoute: Routes = [
    {
        path: 'translation-mgm-new',
        component: TranslationMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.translation.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'translation-mgm/:id/edit',
        component: TranslationMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.translation.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'translation-mgm/:id/delete',
        component: TranslationMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.translation.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
