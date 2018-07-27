/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { DirectAssetMgmComponent } from '../../../../../../main/webapp/app/entities/direct-asset-mgm/direct-asset-mgm.component';
import { DirectAssetMgmService } from '../../../../../../main/webapp/app/entities/direct-asset-mgm/direct-asset-mgm.service';
import { DirectAssetMgm } from '../../../../../../main/webapp/app/entities/direct-asset-mgm/direct-asset-mgm.model';

describe('Component Tests', () => {

    describe('DirectAssetMgm Management Component', () => {
        let comp: DirectAssetMgmComponent;
        let fixture: ComponentFixture<DirectAssetMgmComponent>;
        let service: DirectAssetMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [DirectAssetMgmComponent],
                providers: [
                    DirectAssetMgmService
                ]
            })
            .overrideTemplate(DirectAssetMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DirectAssetMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DirectAssetMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new DirectAssetMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.directAssets[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
