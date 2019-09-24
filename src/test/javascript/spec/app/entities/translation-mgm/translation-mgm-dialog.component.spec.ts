/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { TranslationMgmDialogComponent } from '../../../../../../main/webapp/app/entities/translation-mgm/translation-mgm-dialog.component';
import { TranslationMgmService } from '../../../../../../main/webapp/app/entities/translation-mgm/translation-mgm.service';
import { TranslationMgm } from '../../../../../../main/webapp/app/entities/translation-mgm/translation-mgm.model';
import { DataImpactDescriptionMgmService } from '../../../../../../main/webapp/app/entities/data-impact-description-mgm';
import { GDPRQuestionMgmService } from '../../../../../../main/webapp/app/entities/gdpr-question-mgm';
import { GDPRAnswerMgmService } from '../../../../../../main/webapp/app/entities/gdpr-answer-mgm';

describe('Component Tests', () => {

    describe('TranslationMgm Management Dialog Component', () => {
        let comp: TranslationMgmDialogComponent;
        let fixture: ComponentFixture<TranslationMgmDialogComponent>;
        let service: TranslationMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [TranslationMgmDialogComponent],
                providers: [
                    DataImpactDescriptionMgmService,
                    GDPRQuestionMgmService,
                    GDPRAnswerMgmService,
                    TranslationMgmService
                ]
            })
            .overrideTemplate(TranslationMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(TranslationMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TranslationMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new TranslationMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.translation = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'translationListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new TranslationMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.translation = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'translationListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
