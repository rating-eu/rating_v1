/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { GDPRQuestionMgmDialogComponent } from '../../../../../../main/webapp/app/entities/gdpr-question-mgm/gdpr-question-mgm-dialog.component';
import { GDPRQuestionMgmService } from '../../../../../../main/webapp/app/entities/gdpr-question-mgm/gdpr-question-mgm.service';
import { GDPRQuestionMgm } from '../../../../../../main/webapp/app/entities/gdpr-question-mgm/gdpr-question-mgm.model';
import { GDPRQuestionnaireMgmService } from '../../../../../../main/webapp/app/entities/gdpr-questionnaire-mgm';
import { GDPRAnswerMgmService } from '../../../../../../main/webapp/app/entities/gdpr-answer-mgm';

describe('Component Tests', () => {

    describe('GDPRQuestionMgm Management Dialog Component', () => {
        let comp: GDPRQuestionMgmDialogComponent;
        let fixture: ComponentFixture<GDPRQuestionMgmDialogComponent>;
        let service: GDPRQuestionMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [GDPRQuestionMgmDialogComponent],
                providers: [
                    GDPRQuestionnaireMgmService,
                    GDPRAnswerMgmService,
                    GDPRQuestionMgmService
                ]
            })
            .overrideTemplate(GDPRQuestionMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(GDPRQuestionMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(GDPRQuestionMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new GDPRQuestionMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.gDPRQuestion = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'gDPRQuestionListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new GDPRQuestionMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.gDPRQuestion = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'gDPRQuestionListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
