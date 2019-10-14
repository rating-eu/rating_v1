import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { GDPRQuestionnaireStatusMgmComponent } from './gdpr-questionnaire-status-mgm.component';
import { GDPRQuestionnaireStatusMgmDetailComponent } from './gdpr-questionnaire-status-mgm-detail.component';
import { GDPRQuestionnaireStatusMgmPopupComponent } from './gdpr-questionnaire-status-mgm-dialog.component';
import { GDPRQuestionnaireStatusMgmDeletePopupComponent } from './gdpr-questionnaire-status-mgm-delete-dialog.component';

export const gDPRQuestionnaireStatusRoute: Routes = [
    {
        path: 'gdpr-questionnaire-status-mgm',
        component: GDPRQuestionnaireStatusMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.gDPRQuestionnaireStatus.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'gdpr-questionnaire-status-mgm/:id',
        component: GDPRQuestionnaireStatusMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.gDPRQuestionnaireStatus.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const gDPRQuestionnaireStatusPopupRoute: Routes = [
    {
        path: 'gdpr-questionnaire-status-mgm-new',
        component: GDPRQuestionnaireStatusMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.gDPRQuestionnaireStatus.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'gdpr-questionnaire-status-mgm/:id/edit',
        component: GDPRQuestionnaireStatusMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.gDPRQuestionnaireStatus.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'gdpr-questionnaire-status-mgm/:id/delete',
        component: GDPRQuestionnaireStatusMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.gDPRQuestionnaireStatus.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
