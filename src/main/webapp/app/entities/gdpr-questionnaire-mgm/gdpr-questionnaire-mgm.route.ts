import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { GDPRQuestionnaireMgmComponent } from './gdpr-questionnaire-mgm.component';
import { GDPRQuestionnaireMgmDetailComponent } from './gdpr-questionnaire-mgm-detail.component';
import { GDPRQuestionnaireMgmPopupComponent } from './gdpr-questionnaire-mgm-dialog.component';
import { GDPRQuestionnaireMgmDeletePopupComponent } from './gdpr-questionnaire-mgm-delete-dialog.component';

export const gDPRQuestionnaireRoute: Routes = [
    {
        path: 'gdpr-questionnaire-mgm',
        component: GDPRQuestionnaireMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.gDPRQuestionnaire.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'gdpr-questionnaire-mgm/:id',
        component: GDPRQuestionnaireMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.gDPRQuestionnaire.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const gDPRQuestionnairePopupRoute: Routes = [
    {
        path: 'gdpr-questionnaire-mgm-new',
        component: GDPRQuestionnaireMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.gDPRQuestionnaire.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'gdpr-questionnaire-mgm/:id/edit',
        component: GDPRQuestionnaireMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.gDPRQuestionnaire.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'gdpr-questionnaire-mgm/:id/delete',
        component: GDPRQuestionnaireMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.gDPRQuestionnaire.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
