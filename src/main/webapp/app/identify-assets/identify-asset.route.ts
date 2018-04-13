import { Route } from '@angular/router';

import { UserRouteAccessService } from '../shared';
import { IdentifyAssetComponent } from './';

export const identifyAssetRoute: Route = {
    path: 'identify-asset',
    component: IdentifyAssetComponent,
    data: {
        authorities: [],
        pageTitle: 'identify-assets.title'
    }
};
