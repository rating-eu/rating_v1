/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { QuestionRelevanceMgmDialogComponent } from '../../../../../../main/webapp/app/entities/question-relevance-mgm/question-relevance-mgm-dialog.component';
import { QuestionRelevanceMgmService } from '../../../../../../main/webapp/app/entities/question-relevance-mgm/question-relevance-mgm.service';
import { QuestionRelevanceMgm } from '../../../../../../main/webapp/app/entities/question-relevance-mgm/question-relevance-mgm.model';
import { QuestionMgmService } from '../../../../../../main/webapp/app/entities/question-mgm';
import { QuestionnaireStatusMgmService } from '../../../../../../main/webapp/app/entities/questionnaire-status-mgm';

describe('Component Tests', () => {

    describe('QuestionRelevanceMgm Management Dialog Component', () => {
        let comp: QuestionRelevanceMgmDialogComponent;
        let fixture: ComponentFixture<QuestionRelevanceMgmDialogComponent>;
        let service: QuestionRelevanceMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [QuestionRelevanceMgmDialogComponent],
                providers: [
                    QuestionMgmService,
                    QuestionnaireStatusMgmService,
                    QuestionRelevanceMgmService
                ]
            })
            .overrideTemplate(QuestionRelevanceMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(QuestionRelevanceMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(QuestionRelevanceMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new QuestionRelevanceMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.questionRelevance = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'questionRelevanceListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new QuestionRelevanceMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.questionRelevance = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'questionRelevanceListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});