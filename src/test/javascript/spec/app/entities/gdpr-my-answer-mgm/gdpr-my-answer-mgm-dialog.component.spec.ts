/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { GDPRMyAnswerMgmDialogComponent } from '../../../../../../main/webapp/app/entities/gdpr-my-answer-mgm/gdpr-my-answer-mgm-dialog.component';
import { GDPRMyAnswerMgmService } from '../../../../../../main/webapp/app/entities/gdpr-my-answer-mgm/gdpr-my-answer-mgm.service';
import { GDPRMyAnswerMgm } from '../../../../../../main/webapp/app/entities/gdpr-my-answer-mgm/gdpr-my-answer-mgm.model';
import { GDPRQuestionnaireStatusMgmService } from '../../../../../../main/webapp/app/entities/gdpr-questionnaire-status-mgm';
import { GDPRQuestionMgmService } from '../../../../../../main/webapp/app/entities/gdpr-question-mgm';
import { GDPRAnswerMgmService } from '../../../../../../main/webapp/app/entities/gdpr-answer-mgm';

describe('Component Tests', () => {

    describe('GDPRMyAnswerMgm Management Dialog Component', () => {
        let comp: GDPRMyAnswerMgmDialogComponent;
        let fixture: ComponentFixture<GDPRMyAnswerMgmDialogComponent>;
        let service: GDPRMyAnswerMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [GDPRMyAnswerMgmDialogComponent],
                providers: [
                    GDPRQuestionnaireStatusMgmService,
                    GDPRQuestionMgmService,
                    GDPRAnswerMgmService,
                    GDPRMyAnswerMgmService
                ]
            })
            .overrideTemplate(GDPRMyAnswerMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(GDPRMyAnswerMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(GDPRMyAnswerMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new GDPRMyAnswerMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.gDPRMyAnswer = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'gDPRMyAnswerListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new GDPRMyAnswerMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.gDPRMyAnswer = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'gDPRMyAnswerListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
