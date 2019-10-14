/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { GDPRAnswerMgmDialogComponent } from '../../../../../../main/webapp/app/entities/gdpr-answer-mgm/gdpr-answer-mgm-dialog.component';
import { GDPRAnswerMgmService } from '../../../../../../main/webapp/app/entities/gdpr-answer-mgm/gdpr-answer-mgm.service';
import { GDPRAnswerMgm } from '../../../../../../main/webapp/app/entities/gdpr-answer-mgm/gdpr-answer-mgm.model';
import { GDPRQuestionMgmService } from '../../../../../../main/webapp/app/entities/gdpr-question-mgm';

describe('Component Tests', () => {

    describe('GDPRAnswerMgm Management Dialog Component', () => {
        let comp: GDPRAnswerMgmDialogComponent;
        let fixture: ComponentFixture<GDPRAnswerMgmDialogComponent>;
        let service: GDPRAnswerMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [GDPRAnswerMgmDialogComponent],
                providers: [
                    GDPRQuestionMgmService,
                    GDPRAnswerMgmService
                ]
            })
            .overrideTemplate(GDPRAnswerMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(GDPRAnswerMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(GDPRAnswerMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new GDPRAnswerMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.gDPRAnswer = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'gDPRAnswerListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new GDPRAnswerMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.gDPRAnswer = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'gDPRAnswerListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
