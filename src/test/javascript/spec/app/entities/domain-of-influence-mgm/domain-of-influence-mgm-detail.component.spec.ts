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
import { DomainOfInfluenceMgmDetailComponent } from '../../../../../../main/webapp/app/entities/domain-of-influence-mgm/domain-of-influence-mgm-detail.component';
import { DomainOfInfluenceMgmService } from '../../../../../../main/webapp/app/entities/domain-of-influence-mgm/domain-of-influence-mgm.service';
import { DomainOfInfluenceMgm } from '../../../../../../main/webapp/app/entities/domain-of-influence-mgm/domain-of-influence-mgm.model';

describe('Component Tests', () => {

    describe('DomainOfInfluenceMgm Management Detail Component', () => {
        let comp: DomainOfInfluenceMgmDetailComponent;
        let fixture: ComponentFixture<DomainOfInfluenceMgmDetailComponent>;
        let service: DomainOfInfluenceMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [DomainOfInfluenceMgmDetailComponent],
                providers: [
                    DomainOfInfluenceMgmService
                ]
            })
            .overrideTemplate(DomainOfInfluenceMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DomainOfInfluenceMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DomainOfInfluenceMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new DomainOfInfluenceMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.domainOfInfluence).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
