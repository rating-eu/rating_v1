/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { GDPRQuestionnaireMgmDialogComponent } from '../../../../../../main/webapp/app/entities/gdpr-questionnaire-mgm/gdpr-questionnaire-mgm-dialog.component';
import { GDPRQuestionnaireMgmService } from '../../../../../../main/webapp/app/entities/gdpr-questionnaire-mgm/gdpr-questionnaire-mgm.service';
import { GDPRQuestionnaireMgm } from '../../../../../../main/webapp/app/entities/gdpr-questionnaire-mgm/gdpr-questionnaire-mgm.model';

describe('Component Tests', () => {

    describe('GDPRQuestionnaireMgm Management Dialog Component', () => {
        let comp: GDPRQuestionnaireMgmDialogComponent;
        let fixture: ComponentFixture<GDPRQuestionnaireMgmDialogComponent>;
        let service: GDPRQuestionnaireMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [GDPRQuestionnaireMgmDialogComponent],
                providers: [
                    GDPRQuestionnaireMgmService
                ]
            })
            .overrideTemplate(GDPRQuestionnaireMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(GDPRQuestionnaireMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(GDPRQuestionnaireMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new GDPRQuestionnaireMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.gDPRQuestionnaire = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'gDPRQuestionnaireListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new GDPRQuestionnaireMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.gDPRQuestionnaire = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'gDPRQuestionnaireListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
