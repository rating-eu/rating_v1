/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { CompanySectorMgmDetailComponent } from '../../../../../../main/webapp/app/entities/company-sector-mgm/company-sector-mgm-detail.component';
import { CompanySectorMgmService } from '../../../../../../main/webapp/app/entities/company-sector-mgm/company-sector-mgm.service';
import { CompanySectorMgm } from '../../../../../../main/webapp/app/entities/company-sector-mgm/company-sector-mgm.model';

describe('Component Tests', () => {

    describe('CompanySectorMgm Management Detail Component', () => {
        let comp: CompanySectorMgmDetailComponent;
        let fixture: ComponentFixture<CompanySectorMgmDetailComponent>;
        let service: CompanySectorMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [CompanySectorMgmDetailComponent],
                providers: [
                    CompanySectorMgmService
                ]
            })
            .overrideTemplate(CompanySectorMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CompanySectorMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CompanySectorMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new CompanySectorMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.companySector).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
