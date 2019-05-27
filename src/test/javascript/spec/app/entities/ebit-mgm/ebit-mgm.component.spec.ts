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
import { EBITMgmComponent } from '../../../../../../main/webapp/app/entities/ebit-mgm/ebit-mgm.component';
import { EBITMgmService } from '../../../../../../main/webapp/app/entities/ebit-mgm/ebit-mgm.service';
import { EBITMgm } from '../../../../../../main/webapp/app/entities/ebit-mgm/ebit-mgm.model';

describe('Component Tests', () => {

    describe('EBITMgm Management Component', () => {
        let comp: EBITMgmComponent;
        let fixture: ComponentFixture<EBITMgmComponent>;
        let service: EBITMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [EBITMgmComponent],
                providers: [
                    EBITMgmService
                ]
            })
            .overrideTemplate(EBITMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(EBITMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EBITMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new EBITMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.eBITS[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
