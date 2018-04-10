/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { CompanyProfileMgmDetailComponent } from '../../../../../../main/webapp/app/entities/company-profile-mgm/company-profile-mgm-detail.component';
import { CompanyProfileMgmService } from '../../../../../../main/webapp/app/entities/company-profile-mgm/company-profile-mgm.service';
import { CompanyProfileMgm } from '../../../../../../main/webapp/app/entities/company-profile-mgm/company-profile-mgm.model';

describe('Component Tests', () => {

    describe('CompanyProfileMgm Management Detail Component', () => {
        let comp: CompanyProfileMgmDetailComponent;
        let fixture: ComponentFixture<CompanyProfileMgmDetailComponent>;
        let service: CompanyProfileMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [CompanyProfileMgmDetailComponent],
                providers: [
                    CompanyProfileMgmService
                ]
            })
            .overrideTemplate(CompanyProfileMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CompanyProfileMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CompanyProfileMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new CompanyProfileMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.companyProfile).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
