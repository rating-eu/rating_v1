import {Route, Routes} from '@angular/router';

import {HomeComponent} from './';
import {AboutUsComponent} from './about.us.component';
import {TermsOfUseComponent} from './terms-of-use/terms-of-use.component';

export const HOME_ROUTES: Routes = [
    {
        path: '',
        component: HomeComponent,
        data: {
            authorities: [],
            pageTitle: 'home.title'
        }
    },
    {
        path: 'about-us',
        component: AboutUsComponent,
        data: {
            authorities: [],
            pageTitle: 'aboutus.title'
        }
    },
    {
        path: 'terms',
        component: TermsOfUseComponent,
        data: {
            authorities: [],
            pageTitle: 'terms.title'
        }
    }
];
