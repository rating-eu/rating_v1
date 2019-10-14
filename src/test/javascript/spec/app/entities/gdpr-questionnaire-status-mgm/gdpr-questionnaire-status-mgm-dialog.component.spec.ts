/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { GDPRQuestionnaireStatusMgmDialogComponent } from '../../../../../../main/webapp/app/entities/gdpr-questionnaire-status-mgm/gdpr-questionnaire-status-mgm-dialog.component';
import { GDPRQuestionnaireStatusMgmService } from '../../../../../../main/webapp/app/entities/gdpr-questionnaire-status-mgm/gdpr-questionnaire-status-mgm.service';
import { GDPRQuestionnaireStatusMgm } from '../../../../../../main/webapp/app/entities/gdpr-questionnaire-status-mgm/gdpr-questionnaire-status-mgm.model';
import { DataOperationMgmService } from '../../../../../../main/webapp/app/entities/data-operation-mgm';
import { GDPRQuestionnaireMgmService } from '../../../../../../main/webapp/app/entities/gdpr-questionnaire-mgm';
import { UserService } from '../../../../../../main/webapp/app/shared';

describe('Component Tests', () => {

    describe('GDPRQuestionnaireStatusMgm Management Dialog Component', () => {
        let comp: GDPRQuestionnaireStatusMgmDialogComponent;
        let fixture: ComponentFixture<GDPRQuestionnaireStatusMgmDialogComponent>;
        let service: GDPRQuestionnaireStatusMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [GDPRQuestionnaireStatusMgmDialogComponent],
                providers: [
                    DataOperationMgmService,
                    GDPRQuestionnaireMgmService,
                    UserService,
                    GDPRQuestionnaireStatusMgmService
                ]
            })
            .overrideTemplate(GDPRQuestionnaireStatusMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(GDPRQuestionnaireStatusMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(GDPRQuestionnaireStatusMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new GDPRQuestionnaireStatusMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.gDPRQuestionnaireStatus = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'gDPRQuestionnaireStatusListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new GDPRQuestionnaireStatusMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.gDPRQuestionnaireStatus = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'gDPRQuestionnaireStatusListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
