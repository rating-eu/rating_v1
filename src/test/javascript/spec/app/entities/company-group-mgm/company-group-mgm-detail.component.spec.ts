/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { CompanyGroupMgmDetailComponent } from '../../../../../../main/webapp/app/entities/company-group-mgm/company-group-mgm-detail.component';
import { CompanyGroupMgmService } from '../../../../../../main/webapp/app/entities/company-group-mgm/company-group-mgm.service';
import { CompanyGroupMgm } from '../../../../../../main/webapp/app/entities/company-group-mgm/company-group-mgm.model';

describe('Component Tests', () => {

    describe('CompanyGroupMgm Management Detail Component', () => {
        let comp: CompanyGroupMgmDetailComponent;
        let fixture: ComponentFixture<CompanyGroupMgmDetailComponent>;
        let service: CompanyGroupMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [CompanyGroupMgmDetailComponent],
                providers: [
                    CompanyGroupMgmService
                ]
            })
            .overrideTemplate(CompanyGroupMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CompanyGroupMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CompanyGroupMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new CompanyGroupMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.companyGroup).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
