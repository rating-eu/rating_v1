/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { IndirectAssetMgmComponent } from '../../../../../../main/webapp/app/entities/indirect-asset-mgm/indirect-asset-mgm.component';
import { IndirectAssetMgmService } from '../../../../../../main/webapp/app/entities/indirect-asset-mgm/indirect-asset-mgm.service';
import { IndirectAssetMgm } from '../../../../../../main/webapp/app/entities/indirect-asset-mgm/indirect-asset-mgm.model';

describe('Component Tests', () => {

    describe('IndirectAssetMgm Management Component', () => {
        let comp: IndirectAssetMgmComponent;
        let fixture: ComponentFixture<IndirectAssetMgmComponent>;
        let service: IndirectAssetMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [IndirectAssetMgmComponent],
                providers: [
                    IndirectAssetMgmService
                ]
            })
            .overrideTemplate(IndirectAssetMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(IndirectAssetMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(IndirectAssetMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new IndirectAssetMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.indirectAssets[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
