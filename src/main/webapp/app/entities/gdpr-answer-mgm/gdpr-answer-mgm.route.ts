import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { GDPRAnswerMgmComponent } from './gdpr-answer-mgm.component';
import { GDPRAnswerMgmDetailComponent } from './gdpr-answer-mgm-detail.component';
import { GDPRAnswerMgmPopupComponent } from './gdpr-answer-mgm-dialog.component';
import { GDPRAnswerMgmDeletePopupComponent } from './gdpr-answer-mgm-delete-dialog.component';

export const gDPRAnswerRoute: Routes = [
    {
        path: 'gdpr-answer-mgm',
        component: GDPRAnswerMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.gDPRAnswer.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'gdpr-answer-mgm/:id',
        component: GDPRAnswerMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.gDPRAnswer.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const gDPRAnswerPopupRoute: Routes = [
    {
        path: 'gdpr-answer-mgm-new',
        component: GDPRAnswerMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.gDPRAnswer.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'gdpr-answer-mgm/:id/edit',
        component: GDPRAnswerMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.gDPRAnswer.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'gdpr-answer-mgm/:id/delete',
        component: GDPRAnswerMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.gDPRAnswer.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
