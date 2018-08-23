import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { QuestionMgmComponent } from './question-mgm.component';
import { QuestionMgmDetailComponent } from './question-mgm-detail.component';
import { QuestionMgmPopupComponent } from './question-mgm-dialog.component';
import { QuestionMgmDeletePopupComponent } from './question-mgm-delete-dialog.component';

export const questionRoute: Routes = [
    {
        path: 'question-mgm',
        component: QuestionMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.question.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'question-mgm/:id',
        component: QuestionMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.question.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const questionPopupRoute: Routes = [
    {
        path: 'question-mgm-new',
        component: QuestionMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.question.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'question-mgm/:id/edit',
        component: QuestionMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.question.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'question-mgm/:id/delete',
        component: QuestionMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.question.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
