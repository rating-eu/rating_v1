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

/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { SplittingLossMgmComponent } from '../../../../../../main/webapp/app/entities/splitting-loss-mgm/splitting-loss-mgm.component';
import { SplittingLossMgmService } from '../../../../../../main/webapp/app/entities/splitting-loss-mgm/splitting-loss-mgm.service';
import { SplittingLossMgm } from '../../../../../../main/webapp/app/entities/splitting-loss-mgm/splitting-loss-mgm.model';

describe('Component Tests', () => {

    describe('SplittingLossMgm Management Component', () => {
        let comp: SplittingLossMgmComponent;
        let fixture: ComponentFixture<SplittingLossMgmComponent>;
        let service: SplittingLossMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [SplittingLossMgmComponent],
                providers: [
                    SplittingLossMgmService
                ]
            })
            .overrideTemplate(SplittingLossMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SplittingLossMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SplittingLossMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new SplittingLossMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.splittingLosses[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
