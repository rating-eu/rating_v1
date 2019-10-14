import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { GDPRMyAnswerMgmComponent } from './gdpr-my-answer-mgm.component';
import { GDPRMyAnswerMgmDetailComponent } from './gdpr-my-answer-mgm-detail.component';
import { GDPRMyAnswerMgmPopupComponent } from './gdpr-my-answer-mgm-dialog.component';
import { GDPRMyAnswerMgmDeletePopupComponent } from './gdpr-my-answer-mgm-delete-dialog.component';

export const gDPRMyAnswerRoute: Routes = [
    {
        path: 'gdpr-my-answer-mgm',
        component: GDPRMyAnswerMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.gDPRMyAnswer.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'gdpr-my-answer-mgm/:id',
        component: GDPRMyAnswerMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.gDPRMyAnswer.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const gDPRMyAnswerPopupRoute: Routes = [
    {
        path: 'gdpr-my-answer-mgm-new',
        component: GDPRMyAnswerMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.gDPRMyAnswer.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'gdpr-my-answer-mgm/:id/edit',
        component: GDPRMyAnswerMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.gDPRMyAnswer.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'gdpr-my-answer-mgm/:id/delete',
        component: GDPRMyAnswerMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.gDPRMyAnswer.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
