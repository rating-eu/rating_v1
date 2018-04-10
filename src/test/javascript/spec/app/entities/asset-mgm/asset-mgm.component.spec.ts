/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { AssetMgmComponent } from '../../../../../../main/webapp/app/entities/asset-mgm/asset-mgm.component';
import { AssetMgmService } from '../../../../../../main/webapp/app/entities/asset-mgm/asset-mgm.service';
import { AssetMgm } from '../../../../../../main/webapp/app/entities/asset-mgm/asset-mgm.model';

describe('Component Tests', () => {

    describe('AssetMgm Management Component', () => {
        let comp: AssetMgmComponent;
        let fixture: ComponentFixture<AssetMgmComponent>;
        let service: AssetMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [AssetMgmComponent],
                providers: [
                    AssetMgmService
                ]
            })
            .overrideTemplate(AssetMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(AssetMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AssetMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new AssetMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.assets[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
