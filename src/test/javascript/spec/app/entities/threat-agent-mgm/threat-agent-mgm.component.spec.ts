/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { ThreatAgentMgmComponent } from '../../../../../../main/webapp/app/entities/threat-agent-mgm/threat-agent-mgm.component';
import { ThreatAgentMgmService } from '../../../../../../main/webapp/app/entities/threat-agent-mgm/threat-agent-mgm.service';
import { ThreatAgentMgm } from '../../../../../../main/webapp/app/entities/threat-agent-mgm/threat-agent-mgm.model';

describe('Component Tests', () => {

    describe('ThreatAgentMgm Management Component', () => {
        let comp: ThreatAgentMgmComponent;
        let fixture: ComponentFixture<ThreatAgentMgmComponent>;
        let service: ThreatAgentMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [ThreatAgentMgmComponent],
                providers: [
                    ThreatAgentMgmService
                ]
            })
            .overrideTemplate(ThreatAgentMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ThreatAgentMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ThreatAgentMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new ThreatAgentMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.threatAgents[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
