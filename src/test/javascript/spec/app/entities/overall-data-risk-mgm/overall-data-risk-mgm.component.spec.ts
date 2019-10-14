/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { OverallDataRiskMgmComponent } from '../../../../../../main/webapp/app/entities/overall-data-risk-mgm/overall-data-risk-mgm.component';
import { OverallDataRiskMgmService } from '../../../../../../main/webapp/app/entities/overall-data-risk-mgm/overall-data-risk-mgm.service';
import { OverallDataRiskMgm } from '../../../../../../main/webapp/app/entities/overall-data-risk-mgm/overall-data-risk-mgm.model';

describe('Component Tests', () => {

    describe('OverallDataRiskMgm Management Component', () => {
        let comp: OverallDataRiskMgmComponent;
        let fixture: ComponentFixture<OverallDataRiskMgmComponent>;
        let service: OverallDataRiskMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [OverallDataRiskMgmComponent],
                providers: [
                    OverallDataRiskMgmService
                ]
            })
            .overrideTemplate(OverallDataRiskMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(OverallDataRiskMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OverallDataRiskMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new OverallDataRiskMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.overallDataRisks[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
