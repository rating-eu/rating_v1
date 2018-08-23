import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { AnswerMgmComponent } from './answer-mgm.component';
import { AnswerMgmDetailComponent } from './answer-mgm-detail.component';
import { AnswerMgmPopupComponent } from './answer-mgm-dialog.component';
import { AnswerMgmDeletePopupComponent } from './answer-mgm-delete-dialog.component';

export const answerRoute: Routes = [
    {
        path: 'answer-mgm',
        component: AnswerMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.answer.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'answer-mgm/:id',
        component: AnswerMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.answer.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const answerPopupRoute: Routes = [
    {
        path: 'answer-mgm-new',
        component: AnswerMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.answer.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'answer-mgm/:id/edit',
        component: AnswerMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.answer.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'answer-mgm/:id/delete',
        component: AnswerMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.answer.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
