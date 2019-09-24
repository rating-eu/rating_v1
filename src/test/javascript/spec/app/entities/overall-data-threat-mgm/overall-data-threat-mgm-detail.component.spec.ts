/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { OverallDataThreatMgmDetailComponent } from '../../../../../../main/webapp/app/entities/overall-data-threat-mgm/overall-data-threat-mgm-detail.component';
import { OverallDataThreatMgmService } from '../../../../../../main/webapp/app/entities/overall-data-threat-mgm/overall-data-threat-mgm.service';
import { OverallDataThreatMgm } from '../../../../../../main/webapp/app/entities/overall-data-threat-mgm/overall-data-threat-mgm.model';

describe('Component Tests', () => {

    describe('OverallDataThreatMgm Management Detail Component', () => {
        let comp: OverallDataThreatMgmDetailComponent;
        let fixture: ComponentFixture<OverallDataThreatMgmDetailComponent>;
        let service: OverallDataThreatMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [OverallDataThreatMgmDetailComponent],
                providers: [
                    OverallDataThreatMgmService
                ]
            })
            .overrideTemplate(OverallDataThreatMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(OverallDataThreatMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OverallDataThreatMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new OverallDataThreatMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.overallDataThreat).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
