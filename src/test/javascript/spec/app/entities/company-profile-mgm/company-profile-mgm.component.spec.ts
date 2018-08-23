/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { CompanyProfileMgmComponent } from '../../../../../../main/webapp/app/entities/company-profile-mgm/company-profile-mgm.component';
import { CompanyProfileMgmService } from '../../../../../../main/webapp/app/entities/company-profile-mgm/company-profile-mgm.service';
import { CompanyProfileMgm } from '../../../../../../main/webapp/app/entities/company-profile-mgm/company-profile-mgm.model';

describe('Component Tests', () => {

    describe('CompanyProfileMgm Management Component', () => {
        let comp: CompanyProfileMgmComponent;
        let fixture: ComponentFixture<CompanyProfileMgmComponent>;
        let service: CompanyProfileMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [CompanyProfileMgmComponent],
                providers: [
                    CompanyProfileMgmService
                ]
            })
            .overrideTemplate(CompanyProfileMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CompanyProfileMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CompanyProfileMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new CompanyProfileMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.companyProfiles[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
