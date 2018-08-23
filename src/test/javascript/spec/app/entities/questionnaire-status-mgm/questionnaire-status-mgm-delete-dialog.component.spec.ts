/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { QuestionnaireStatusMgmDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/questionnaire-status-mgm/questionnaire-status-mgm-delete-dialog.component';
import { QuestionnaireStatusMgmService } from '../../../../../../main/webapp/app/entities/questionnaire-status-mgm/questionnaire-status-mgm.service';

describe('Component Tests', () => {

    describe('QuestionnaireStatusMgm Management Delete Component', () => {
        let comp: QuestionnaireStatusMgmDeleteDialogComponent;
        let fixture: ComponentFixture<QuestionnaireStatusMgmDeleteDialogComponent>;
        let service: QuestionnaireStatusMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [QuestionnaireStatusMgmDeleteDialogComponent],
                providers: [
                    QuestionnaireStatusMgmService
                ]
            })
            .overrideTemplate(QuestionnaireStatusMgmDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(QuestionnaireStatusMgmDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(QuestionnaireStatusMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        spyOn(service, 'delete').and.returnValue(Observable.of({}));

                        // WHEN
                        comp.confirmDelete(123);
                        tick();

                        // THEN
                        expect(service.delete).toHaveBeenCalledWith(123);
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
