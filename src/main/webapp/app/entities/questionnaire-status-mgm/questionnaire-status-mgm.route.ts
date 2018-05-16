import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { QuestionnaireStatusMgmComponent } from './questionnaire-status-mgm.component';
import { QuestionnaireStatusMgmDetailComponent } from './questionnaire-status-mgm-detail.component';
import { QuestionnaireStatusMgmPopupComponent } from './questionnaire-status-mgm-dialog.component';
import { QuestionnaireStatusMgmDeletePopupComponent } from './questionnaire-status-mgm-delete-dialog.component';

export const questionnaireStatusRoute: Routes = [
    {
        path: 'questionnaire-status-mgm',
        component: QuestionnaireStatusMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.questionnaireStatus.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'questionnaire-status-mgm/:id',
        component: QuestionnaireStatusMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.questionnaireStatus.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const questionnaireStatusPopupRoute: Routes = [
    {
        path: 'questionnaire-status-mgm-new',
        component: QuestionnaireStatusMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.questionnaireStatus.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'questionnaire-status-mgm/:id/edit',
        component: QuestionnaireStatusMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.questionnaireStatus.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'questionnaire-status-mgm/:id/delete',
        component: QuestionnaireStatusMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.questionnaireStatus.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
