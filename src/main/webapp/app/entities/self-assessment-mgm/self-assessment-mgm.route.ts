import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { SelfAssessmentMgmComponent } from './self-assessment-mgm.component';
import { SelfAssessmentMgmDetailComponent } from './self-assessment-mgm-detail.component';
import { SelfAssessmentMgmPopupComponent } from './self-assessment-mgm-dialog.component';
import { SelfAssessmentMgmDeletePopupComponent } from './self-assessment-mgm-delete-dialog.component';

export const selfAssessmentRoute: Routes = [
    {
        path: 'self-assessment-mgm',
        component: SelfAssessmentMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.selfAssessment.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'self-assessment-mgm/:id',
        component: SelfAssessmentMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.selfAssessment.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const selfAssessmentPopupRoute: Routes = [
    {
        path: 'self-assessment-mgm-new',
        component: SelfAssessmentMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.selfAssessment.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'self-assessment-mgm/:id/edit',
        component: SelfAssessmentMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.selfAssessment.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'self-assessment-mgm/:id/delete',
        component: SelfAssessmentMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.selfAssessment.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
