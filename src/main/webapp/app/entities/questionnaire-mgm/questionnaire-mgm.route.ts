import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { QuestionnaireMgmComponent } from './questionnaire-mgm.component';
import { QuestionnaireMgmDetailComponent } from './questionnaire-mgm-detail.component';
import { QuestionnaireMgmPopupComponent } from './questionnaire-mgm-dialog.component';
import { QuestionnaireMgmDeletePopupComponent } from './questionnaire-mgm-delete-dialog.component';

export const questionnaireRoute: Routes = [
    {
        path: 'questionnaire-mgm',
        component: QuestionnaireMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.questionnaire.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'questionnaire-mgm/:id',
        component: QuestionnaireMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.questionnaire.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const questionnairePopupRoute: Routes = [
    {
        path: 'questionnaire-mgm-new',
        component: QuestionnaireMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.questionnaire.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'questionnaire-mgm/:id/edit',
        component: QuestionnaireMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.questionnaire.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'questionnaire-mgm/:id/delete',
        component: QuestionnaireMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.questionnaire.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
