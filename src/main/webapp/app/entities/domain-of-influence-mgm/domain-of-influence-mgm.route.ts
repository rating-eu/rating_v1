import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { DomainOfInfluenceMgmComponent } from './domain-of-influence-mgm.component';
import { DomainOfInfluenceMgmDetailComponent } from './domain-of-influence-mgm-detail.component';
import { DomainOfInfluenceMgmPopupComponent } from './domain-of-influence-mgm-dialog.component';
import { DomainOfInfluenceMgmDeletePopupComponent } from './domain-of-influence-mgm-delete-dialog.component';

export const domainOfInfluenceRoute: Routes = [
    {
        path: 'domain-of-influence-mgm',
        component: DomainOfInfluenceMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.domainOfInfluence.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'domain-of-influence-mgm/:id',
        component: DomainOfInfluenceMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.domainOfInfluence.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const domainOfInfluencePopupRoute: Routes = [
    {
        path: 'domain-of-influence-mgm-new',
        component: DomainOfInfluenceMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.domainOfInfluence.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'domain-of-influence-mgm/:id/edit',
        component: DomainOfInfluenceMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.domainOfInfluence.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'domain-of-influence-mgm/:id/delete',
        component: DomainOfInfluenceMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.domainOfInfluence.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
