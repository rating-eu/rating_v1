/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { CompanyGroupMgmComponent } from '../../../../../../main/webapp/app/entities/company-group-mgm/company-group-mgm.component';
import { CompanyGroupMgmService } from '../../../../../../main/webapp/app/entities/company-group-mgm/company-group-mgm.service';
import { CompanyGroupMgm } from '../../../../../../main/webapp/app/entities/company-group-mgm/company-group-mgm.model';

describe('Component Tests', () => {

    describe('CompanyGroupMgm Management Component', () => {
        let comp: CompanyGroupMgmComponent;
        let fixture: ComponentFixture<CompanyGroupMgmComponent>;
        let service: CompanyGroupMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [CompanyGroupMgmComponent],
                providers: [
                    CompanyGroupMgmService
                ]
            })
            .overrideTemplate(CompanyGroupMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CompanyGroupMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CompanyGroupMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new CompanyGroupMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.companyGroups[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
