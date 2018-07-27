/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { MyAssetMgmComponent } from '../../../../../../main/webapp/app/entities/my-asset-mgm/my-asset-mgm.component';
import { MyAssetMgmService } from '../../../../../../main/webapp/app/entities/my-asset-mgm/my-asset-mgm.service';
import { MyAssetMgm } from '../../../../../../main/webapp/app/entities/my-asset-mgm/my-asset-mgm.model';

describe('Component Tests', () => {

    describe('MyAssetMgm Management Component', () => {
        let comp: MyAssetMgmComponent;
        let fixture: ComponentFixture<MyAssetMgmComponent>;
        let service: MyAssetMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [MyAssetMgmComponent],
                providers: [
                    MyAssetMgmService
                ]
            })
            .overrideTemplate(MyAssetMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(MyAssetMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MyAssetMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new MyAssetMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.myAssets[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
