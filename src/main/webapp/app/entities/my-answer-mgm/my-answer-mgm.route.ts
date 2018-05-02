import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { MyAnswerMgmComponent } from './my-answer-mgm.component';
import { MyAnswerMgmDetailComponent } from './my-answer-mgm-detail.component';
import { MyAnswerMgmPopupComponent } from './my-answer-mgm-dialog.component';
import { MyAnswerMgmDeletePopupComponent } from './my-answer-mgm-delete-dialog.component';

export const myAnswerRoute: Routes = [
    {
        path: 'my-answer-mgm',
        component: MyAnswerMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.myAnswer.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'my-answer-mgm/:id',
        component: MyAnswerMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.myAnswer.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const myAnswerPopupRoute: Routes = [
    {
        path: 'my-answer-mgm-new',
        component: MyAnswerMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.myAnswer.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'my-answer-mgm/:id/edit',
        component: MyAnswerMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.myAnswer.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'my-answer-mgm/:id/delete',
        component: MyAnswerMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.myAnswer.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
