import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { QuestionRelevanceMgmComponent } from './question-relevance-mgm.component';
import { QuestionRelevanceMgmDetailComponent } from './question-relevance-mgm-detail.component';
import { QuestionRelevanceMgmPopupComponent } from './question-relevance-mgm-dialog.component';
import { QuestionRelevanceMgmDeletePopupComponent } from './question-relevance-mgm-delete-dialog.component';

export const questionRelevanceRoute: Routes = [
    {
        path: 'question-relevance-mgm',
        component: QuestionRelevanceMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.questionRelevance.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'question-relevance-mgm/:id',
        component: QuestionRelevanceMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.questionRelevance.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const questionRelevancePopupRoute: Routes = [
    {
        path: 'question-relevance-mgm-new',
        component: QuestionRelevanceMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.questionRelevance.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'question-relevance-mgm/:id/edit',
        component: QuestionRelevanceMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.questionRelevance.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'question-relevance-mgm/:id/delete',
        component: QuestionRelevanceMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.questionRelevance.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
