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

import {Injectable, RendererFactory2, Renderer2} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {Router, ActivatedRouteSnapshot} from '@angular/router';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';

import {LANGUAGES} from './language.constants';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class JhiLanguageHelper {
    renderer: Renderer2 = null;
    private _language: BehaviorSubject<string>;

    constructor(
        private translateService: TranslateService,
        // tslint:disable-next-line: no-unused-variable
        private rootRenderer: RendererFactory2,
        private titleService: Title,
        private router: Router
    ) {
        this._language = new BehaviorSubject<string>(this.translateService.currentLang);
        this.renderer = rootRenderer.createRenderer(document.querySelector('html'), null);
        this.init();
    }

    getAll(): Promise<any> {
        return Promise.resolve(LANGUAGES);
    }

    /**
     * Update the window title using params in the following
     * order:
     * 1. titleKey parameter
     * 2. $state.$current.data.pageTitle (current state page title)
     * 3. 'global.title'
     */
    updateTitle(titleKey?: string) {
        if (!titleKey) {
            titleKey = this.getPageTitle(this.router.routerState.snapshot.root);
        }

        this.translateService.get(titleKey).subscribe((title) => {
            this.titleService.setTitle(title);
        });
    }

    private init() {
        this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
            this._language.next(this.translateService.currentLang);
            this.renderer.setAttribute(document.querySelector('html'), 'lang', this.translateService.currentLang);
            this.updateTitle();
        });
    }

    private getPageTitle(routeSnapshot: ActivatedRouteSnapshot) {
        let title: string = (routeSnapshot.data && routeSnapshot.data['pageTitle']) ? routeSnapshot.data['pageTitle'] : 'hermeneutApp';
        if (routeSnapshot.firstChild) {
            title = this.getPageTitle(routeSnapshot.firstChild) || title;
        }
        return title;
    }

    get language(): Observable<string> {
        return this._language.asObservable();
    }
}
