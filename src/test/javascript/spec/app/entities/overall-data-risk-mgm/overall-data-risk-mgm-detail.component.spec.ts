/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { OverallDataRiskMgmDetailComponent } from '../../../../../../main/webapp/app/entities/overall-data-risk-mgm/overall-data-risk-mgm-detail.component';
import { OverallDataRiskMgmService } from '../../../../../../main/webapp/app/entities/overall-data-risk-mgm/overall-data-risk-mgm.service';
import { OverallDataRiskMgm } from '../../../../../../main/webapp/app/entities/overall-data-risk-mgm/overall-data-risk-mgm.model';

describe('Component Tests', () => {

    describe('OverallDataRiskMgm Management Detail Component', () => {
        let comp: OverallDataRiskMgmDetailComponent;
        let fixture: ComponentFixture<OverallDataRiskMgmDetailComponent>;
        let service: OverallDataRiskMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [OverallDataRiskMgmDetailComponent],
                providers: [
                    OverallDataRiskMgmService
                ]
            })
            .overrideTemplate(OverallDataRiskMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(OverallDataRiskMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OverallDataRiskMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new OverallDataRiskMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.overallDataRisk).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
