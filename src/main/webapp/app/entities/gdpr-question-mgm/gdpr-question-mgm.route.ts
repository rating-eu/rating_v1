import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { GDPRQuestionMgmComponent } from './gdpr-question-mgm.component';
import { GDPRQuestionMgmDetailComponent } from './gdpr-question-mgm-detail.component';
import { GDPRQuestionMgmPopupComponent } from './gdpr-question-mgm-dialog.component';
import { GDPRQuestionMgmDeletePopupComponent } from './gdpr-question-mgm-delete-dialog.component';

export const gDPRQuestionRoute: Routes = [
    {
        path: 'gdpr-question-mgm',
        component: GDPRQuestionMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.gDPRQuestion.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'gdpr-question-mgm/:id',
        component: GDPRQuestionMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.gDPRQuestion.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const gDPRQuestionPopupRoute: Routes = [
    {
        path: 'gdpr-question-mgm-new',
        component: GDPRQuestionMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.gDPRQuestion.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'gdpr-question-mgm/:id/edit',
        component: GDPRQuestionMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.gDPRQuestion.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'gdpr-question-mgm/:id/delete',
        component: GDPRQuestionMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.gDPRQuestion.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
