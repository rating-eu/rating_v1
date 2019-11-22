/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { QuestionRelevanceMgmDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/question-relevance-mgm/question-relevance-mgm-delete-dialog.component';
import { QuestionRelevanceMgmService } from '../../../../../../main/webapp/app/entities/question-relevance-mgm/question-relevance-mgm.service';

describe('Component Tests', () => {

    describe('QuestionRelevanceMgm Management Delete Component', () => {
        let comp: QuestionRelevanceMgmDeleteDialogComponent;
        let fixture: ComponentFixture<QuestionRelevanceMgmDeleteDialogComponent>;
        let service: QuestionRelevanceMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [QuestionRelevanceMgmDeleteDialogComponent],
                providers: [
                    QuestionRelevanceMgmService
                ]
            })
            .overrideTemplate(QuestionRelevanceMgmDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(QuestionRelevanceMgmDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(QuestionRelevanceMgmService);
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
