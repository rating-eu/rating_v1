import { Route } from '@angular/router';

import { UserRouteAccessService } from '../shared';
import { IdentifyThreatAgentComponent } from './';

export const identifyThreatAgentRoute: Route = {
    path: 'identify-threat-agent',
    component: IdentifyThreatAgentComponent,
    data: {
        authorities: [],
        pageTitle: 'identify-threat-agent.title'
    }
};
