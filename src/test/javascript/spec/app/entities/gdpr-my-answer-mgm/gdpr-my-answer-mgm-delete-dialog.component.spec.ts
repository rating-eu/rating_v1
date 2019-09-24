/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { GDPRMyAnswerMgmDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/gdpr-my-answer-mgm/gdpr-my-answer-mgm-delete-dialog.component';
import { GDPRMyAnswerMgmService } from '../../../../../../main/webapp/app/entities/gdpr-my-answer-mgm/gdpr-my-answer-mgm.service';

describe('Component Tests', () => {

    describe('GDPRMyAnswerMgm Management Delete Component', () => {
        let comp: GDPRMyAnswerMgmDeleteDialogComponent;
        let fixture: ComponentFixture<GDPRMyAnswerMgmDeleteDialogComponent>;
        let service: GDPRMyAnswerMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [GDPRMyAnswerMgmDeleteDialogComponent],
                providers: [
                    GDPRMyAnswerMgmService
                ]
            })
            .overrideTemplate(GDPRMyAnswerMgmDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(GDPRMyAnswerMgmDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(GDPRMyAnswerMgmService);
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
