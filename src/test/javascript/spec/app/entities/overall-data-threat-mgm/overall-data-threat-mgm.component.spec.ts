/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { OverallDataThreatMgmComponent } from '../../../../../../main/webapp/app/entities/overall-data-threat-mgm/overall-data-threat-mgm.component';
import { OverallDataThreatMgmService } from '../../../../../../main/webapp/app/entities/overall-data-threat-mgm/overall-data-threat-mgm.service';
import { OverallDataThreatMgm } from '../../../../../../main/webapp/app/entities/overall-data-threat-mgm/overall-data-threat-mgm.model';

describe('Component Tests', () => {

    describe('OverallDataThreatMgm Management Component', () => {
        let comp: OverallDataThreatMgmComponent;
        let fixture: ComponentFixture<OverallDataThreatMgmComponent>;
        let service: OverallDataThreatMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [OverallDataThreatMgmComponent],
                providers: [
                    OverallDataThreatMgmService
                ]
            })
            .overrideTemplate(OverallDataThreatMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(OverallDataThreatMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OverallDataThreatMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new OverallDataThreatMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.overallDataThreats[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
