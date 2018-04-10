/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { ThreatAgentMgmDialogComponent } from '../../../../../../main/webapp/app/entities/threat-agent-mgm/threat-agent-mgm-dialog.component';
import { ThreatAgentMgmService } from '../../../../../../main/webapp/app/entities/threat-agent-mgm/threat-agent-mgm.service';
import { ThreatAgentMgm } from '../../../../../../main/webapp/app/entities/threat-agent-mgm/threat-agent-mgm.model';
import { MotivationMgmService } from '../../../../../../main/webapp/app/entities/motivation-mgm';
import { AnswerMgmService } from '../../../../../../main/webapp/app/entities/answer-mgm';
import { AttackStrategyMgmService } from '../../../../../../main/webapp/app/entities/attack-strategy-mgm';
import { SelfAssessmentMgmService } from '../../../../../../main/webapp/app/entities/self-assessment-mgm';

describe('Component Tests', () => {

    describe('ThreatAgentMgm Management Dialog Component', () => {
        let comp: ThreatAgentMgmDialogComponent;
        let fixture: ComponentFixture<ThreatAgentMgmDialogComponent>;
        let service: ThreatAgentMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [ThreatAgentMgmDialogComponent],
                providers: [
                    MotivationMgmService,
                    AnswerMgmService,
                    AttackStrategyMgmService,
                    SelfAssessmentMgmService,
                    ThreatAgentMgmService
                ]
            })
            .overrideTemplate(ThreatAgentMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ThreatAgentMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ThreatAgentMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new ThreatAgentMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.threatAgent = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'threatAgentListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new ThreatAgentMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.threatAgent = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'threatAgentListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
