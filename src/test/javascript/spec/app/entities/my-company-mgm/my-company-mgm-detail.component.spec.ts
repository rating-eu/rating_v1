/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { MyCompanyMgmDetailComponent } from '../../../../../../main/webapp/app/entities/my-company-mgm/my-company-mgm-detail.component';
import { MyCompanyMgmService } from '../../../../../../main/webapp/app/entities/my-company-mgm/my-company-mgm.service';
import { MyCompanyMgm } from '../../../../../../main/webapp/app/entities/my-company-mgm/my-company-mgm.model';

describe('Component Tests', () => {

    describe('MyCompanyMgm Management Detail Component', () => {
        let comp: MyCompanyMgmDetailComponent;
        let fixture: ComponentFixture<MyCompanyMgmDetailComponent>;
        let service: MyCompanyMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [MyCompanyMgmDetailComponent],
                providers: [
                    MyCompanyMgmService
                ]
            })
            .overrideTemplate(MyCompanyMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(MyCompanyMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MyCompanyMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new MyCompanyMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.myCompany).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
