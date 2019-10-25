/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { QuestionMgmDialogComponent } from '../../../../../../main/webapp/app/entities/question-mgm/question-mgm-dialog.component';
import { QuestionMgmService } from '../../../../../../main/webapp/app/entities/question-mgm/question-mgm.service';
import { QuestionMgm } from '../../../../../../main/webapp/app/entities/question-mgm/question-mgm.model';
import { AttackStrategyMgmService } from '../../../../../../main/webapp/app/entities/attack-strategy-mgm';
import { AnswerMgmService } from '../../../../../../main/webapp/app/entities/answer-mgm';
import { VulnerabilityAreaMgmService } from '../../../../../../main/webapp/app/entities/vulnerability-area-mgm';
import { QuestionnaireMgmService } from '../../../../../../main/webapp/app/entities/questionnaire-mgm';
import { ThreatAgentMgmService } from '../../../../../../main/webapp/app/entities/threat-agent-mgm';

describe('Component Tests', () => {

    describe('QuestionMgm Management Dialog Component', () => {
        let comp: QuestionMgmDialogComponent;
        let fixture: ComponentFixture<QuestionMgmDialogComponent>;
        let service: QuestionMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [QuestionMgmDialogComponent],
                providers: [
                    AttackStrategyMgmService,
                    AnswerMgmService,
                    VulnerabilityAreaMgmService,
                    QuestionnaireMgmService,
                    ThreatAgentMgmService,
                    QuestionMgmService
                ]
            })
            .overrideTemplate(QuestionMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(QuestionMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(QuestionMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new QuestionMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.question = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'questionListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new QuestionMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.question = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'questionListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
