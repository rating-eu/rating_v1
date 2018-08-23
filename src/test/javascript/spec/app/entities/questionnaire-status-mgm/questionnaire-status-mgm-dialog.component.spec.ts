/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { QuestionnaireStatusMgmDialogComponent } from '../../../../../../main/webapp/app/entities/questionnaire-status-mgm/questionnaire-status-mgm-dialog.component';
import { QuestionnaireStatusMgmService } from '../../../../../../main/webapp/app/entities/questionnaire-status-mgm/questionnaire-status-mgm.service';
import { QuestionnaireStatusMgm } from '../../../../../../main/webapp/app/entities/questionnaire-status-mgm/questionnaire-status-mgm.model';
import { SelfAssessmentMgmService } from '../../../../../../main/webapp/app/entities/self-assessment-mgm';
import { QuestionnaireMgmService } from '../../../../../../main/webapp/app/entities/questionnaire-mgm';
import { UserService } from '../../../../../../main/webapp/app/shared';

describe('Component Tests', () => {

    describe('QuestionnaireStatusMgm Management Dialog Component', () => {
        let comp: QuestionnaireStatusMgmDialogComponent;
        let fixture: ComponentFixture<QuestionnaireStatusMgmDialogComponent>;
        let service: QuestionnaireStatusMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [QuestionnaireStatusMgmDialogComponent],
                providers: [
                    SelfAssessmentMgmService,
                    QuestionnaireMgmService,
                    UserService,
                    QuestionnaireStatusMgmService
                ]
            })
            .overrideTemplate(QuestionnaireStatusMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(QuestionnaireStatusMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(QuestionnaireStatusMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new QuestionnaireStatusMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.questionnaireStatus = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'questionnaireStatusListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new QuestionnaireStatusMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.questionnaireStatus = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'questionnaireStatusListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
