/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { EconomicResultsMgmComponent } from '../../../../../../main/webapp/app/entities/economic-results-mgm/economic-results-mgm.component';
import { EconomicResultsMgmService } from '../../../../../../main/webapp/app/entities/economic-results-mgm/economic-results-mgm.service';
import { EconomicResultsMgm } from '../../../../../../main/webapp/app/entities/economic-results-mgm/economic-results-mgm.model';

describe('Component Tests', () => {

    describe('EconomicResultsMgm Management Component', () => {
        let comp: EconomicResultsMgmComponent;
        let fixture: ComponentFixture<EconomicResultsMgmComponent>;
        let service: EconomicResultsMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [EconomicResultsMgmComponent],
                providers: [
                    EconomicResultsMgmService
                ]
            })
            .overrideTemplate(EconomicResultsMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(EconomicResultsMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EconomicResultsMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new EconomicResultsMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.economicResults[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
