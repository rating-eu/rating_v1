/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

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
