import { Route } from '@angular/router';

import {EvaluateWeacknessComponent} from './evaluate-weackness.component';

export const evaluateWeacknessRoute: Route = {
    path: 'evaluate-weackness',
    component: EvaluateWeacknessComponent,
    data: {
        authorities: [],
        pageTitle: 'evaluate-weackness.title'
    }
};
