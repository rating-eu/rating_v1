import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { AnswerWeightMgmComponent } from './answer-weight-mgm.component';
import { AnswerWeightMgmDetailComponent } from './answer-weight-mgm-detail.component';
import { AnswerWeightMgmPopupComponent } from './answer-weight-mgm-dialog.component';
import { AnswerWeightMgmDeletePopupComponent } from './answer-weight-mgm-delete-dialog.component';

export const answerWeightRoute: Routes = [
    {
        path: 'answer-weight-mgm',
        component: AnswerWeightMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.answerWeight.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'answer-weight-mgm/:id',
        component: AnswerWeightMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.answerWeight.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const answerWeightPopupRoute: Routes = [
    {
        path: 'answer-weight-mgm-new',
        component: AnswerWeightMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.answerWeight.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'answer-weight-mgm/:id/edit',
        component: AnswerWeightMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.answerWeight.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'answer-weight-mgm/:id/delete',
        component: AnswerWeightMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.answerWeight.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
