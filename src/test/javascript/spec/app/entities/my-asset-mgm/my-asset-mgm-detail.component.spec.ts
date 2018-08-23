/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { MyAssetMgmDetailComponent } from '../../../../../../main/webapp/app/entities/my-asset-mgm/my-asset-mgm-detail.component';
import { MyAssetMgmService } from '../../../../../../main/webapp/app/entities/my-asset-mgm/my-asset-mgm.service';
import { MyAssetMgm } from '../../../../../../main/webapp/app/entities/my-asset-mgm/my-asset-mgm.model';

describe('Component Tests', () => {

    describe('MyAssetMgm Management Detail Component', () => {
        let comp: MyAssetMgmDetailComponent;
        let fixture: ComponentFixture<MyAssetMgmDetailComponent>;
        let service: MyAssetMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [MyAssetMgmDetailComponent],
                providers: [
                    MyAssetMgmService
                ]
            })
            .overrideTemplate(MyAssetMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(MyAssetMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MyAssetMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new MyAssetMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.myAsset).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
