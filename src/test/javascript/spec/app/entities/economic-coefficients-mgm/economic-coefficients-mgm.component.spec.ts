/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { EconomicCoefficientsMgmComponent } from '../../../../../../main/webapp/app/entities/economic-coefficients-mgm/economic-coefficients-mgm.component';
import { EconomicCoefficientsMgmService } from '../../../../../../main/webapp/app/entities/economic-coefficients-mgm/economic-coefficients-mgm.service';
import { EconomicCoefficientsMgm } from '../../../../../../main/webapp/app/entities/economic-coefficients-mgm/economic-coefficients-mgm.model';

describe('Component Tests', () => {

    describe('EconomicCoefficientsMgm Management Component', () => {
        let comp: EconomicCoefficientsMgmComponent;
        let fixture: ComponentFixture<EconomicCoefficientsMgmComponent>;
        let service: EconomicCoefficientsMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [EconomicCoefficientsMgmComponent],
                providers: [
                    EconomicCoefficientsMgmService
                ]
            })
            .overrideTemplate(EconomicCoefficientsMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(EconomicCoefficientsMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EconomicCoefficientsMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new EconomicCoefficientsMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.economicCoefficients[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
