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
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { ThreatAgentMgmDetailComponent } from '../../../../../../main/webapp/app/entities/threat-agent-mgm/threat-agent-mgm-detail.component';
import { ThreatAgentMgmService } from '../../../../../../main/webapp/app/entities/threat-agent-mgm/threat-agent-mgm.service';
import { ThreatAgentMgm } from '../../../../../../main/webapp/app/entities/threat-agent-mgm/threat-agent-mgm.model';

describe('Component Tests', () => {

    describe('ThreatAgentMgm Management Detail Component', () => {
        let comp: ThreatAgentMgmDetailComponent;
        let fixture: ComponentFixture<ThreatAgentMgmDetailComponent>;
        let service: ThreatAgentMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [ThreatAgentMgmDetailComponent],
                providers: [
                    ThreatAgentMgmService
                ]
            })
            .overrideTemplate(ThreatAgentMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ThreatAgentMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ThreatAgentMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new ThreatAgentMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.threatAgent).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
