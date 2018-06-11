/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { AnswerWeightMgmDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/answer-weight-mgm/answer-weight-mgm-delete-dialog.component';
import { AnswerWeightMgmService } from '../../../../../../main/webapp/app/entities/answer-weight-mgm/answer-weight-mgm.service';

describe('Component Tests', () => {

    describe('AnswerWeightMgm Management Delete Component', () => {
        let comp: AnswerWeightMgmDeleteDialogComponent;
        let fixture: ComponentFixture<AnswerWeightMgmDeleteDialogComponent>;
        let service: AnswerWeightMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [AnswerWeightMgmDeleteDialogComponent],
                providers: [
                    AnswerWeightMgmService
                ]
            })
            .overrideTemplate(AnswerWeightMgmDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(AnswerWeightMgmDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AnswerWeightMgmService);
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