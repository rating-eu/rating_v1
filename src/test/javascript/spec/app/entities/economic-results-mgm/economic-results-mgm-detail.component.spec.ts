/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { EconomicResultsMgmDetailComponent } from '../../../../../../main/webapp/app/entities/economic-results-mgm/economic-results-mgm-detail.component';
import { EconomicResultsMgmService } from '../../../../../../main/webapp/app/entities/economic-results-mgm/economic-results-mgm.service';
import { EconomicResultsMgm } from '../../../../../../main/webapp/app/entities/economic-results-mgm/economic-results-mgm.model';

describe('Component Tests', () => {

    describe('EconomicResultsMgm Management Detail Component', () => {
        let comp: EconomicResultsMgmDetailComponent;
        let fixture: ComponentFixture<EconomicResultsMgmDetailComponent>;
        let service: EconomicResultsMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [EconomicResultsMgmDetailComponent],
                providers: [
                    EconomicResultsMgmService
                ]
            })
            .overrideTemplate(EconomicResultsMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(EconomicResultsMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EconomicResultsMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new EconomicResultsMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.economicResults).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
