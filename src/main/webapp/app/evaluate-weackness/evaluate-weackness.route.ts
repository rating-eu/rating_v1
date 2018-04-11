import { Route } from '@angular/router';

import { UserRouteAccessService } from '../shared';
import { EvaluateWeacknessComponent } from './';

export const evaluateWeacknessRoute: Route = {
    path: 'evaluate-weackness',
    component: EvaluateWeacknessComponent,
    data: {
        authorities: [],
        pageTitle: 'evaluate-weackness.title'
    }
};
