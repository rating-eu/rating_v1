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
import { DirectAssetMgmDetailComponent } from '../../../../../../main/webapp/app/entities/direct-asset-mgm/direct-asset-mgm-detail.component';
import { DirectAssetMgmService } from '../../../../../../main/webapp/app/entities/direct-asset-mgm/direct-asset-mgm.service';
import { DirectAssetMgm } from '../../../../../../main/webapp/app/entities/direct-asset-mgm/direct-asset-mgm.model';

describe('Component Tests', () => {

    describe('DirectAssetMgm Management Detail Component', () => {
        let comp: DirectAssetMgmDetailComponent;
        let fixture: ComponentFixture<DirectAssetMgmDetailComponent>;
        let service: DirectAssetMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [DirectAssetMgmDetailComponent],
                providers: [
                    DirectAssetMgmService
                ]
            })
            .overrideTemplate(DirectAssetMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DirectAssetMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DirectAssetMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new DirectAssetMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.directAsset).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
