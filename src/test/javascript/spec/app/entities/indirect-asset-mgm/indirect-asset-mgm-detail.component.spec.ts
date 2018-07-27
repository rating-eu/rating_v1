/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { IndirectAssetMgmDetailComponent } from '../../../../../../main/webapp/app/entities/indirect-asset-mgm/indirect-asset-mgm-detail.component';
import { IndirectAssetMgmService } from '../../../../../../main/webapp/app/entities/indirect-asset-mgm/indirect-asset-mgm.service';
import { IndirectAssetMgm } from '../../../../../../main/webapp/app/entities/indirect-asset-mgm/indirect-asset-mgm.model';

describe('Component Tests', () => {

    describe('IndirectAssetMgm Management Detail Component', () => {
        let comp: IndirectAssetMgmDetailComponent;
        let fixture: ComponentFixture<IndirectAssetMgmDetailComponent>;
        let service: IndirectAssetMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [IndirectAssetMgmDetailComponent],
                providers: [
                    IndirectAssetMgmService
                ]
            })
            .overrideTemplate(IndirectAssetMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(IndirectAssetMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(IndirectAssetMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new IndirectAssetMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.indirectAsset).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
