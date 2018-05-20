import { Route } from '@angular/router';

import {EvaluateWeaknessComponent} from './evaluate-weakness.component';

export const evaluateWeaknessRoute: Route = {
    path: 'evaluate-weakness',
    component: EvaluateWeaknessComponent,
    data: {
        authorities: [],
        pageTitle: 'evaluate-weakness.title'
    }
};
