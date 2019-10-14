/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { GDPRAnswerMgmDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/gdpr-answer-mgm/gdpr-answer-mgm-delete-dialog.component';
import { GDPRAnswerMgmService } from '../../../../../../main/webapp/app/entities/gdpr-answer-mgm/gdpr-answer-mgm.service';

describe('Component Tests', () => {

    describe('GDPRAnswerMgm Management Delete Component', () => {
        let comp: GDPRAnswerMgmDeleteDialogComponent;
        let fixture: ComponentFixture<GDPRAnswerMgmDeleteDialogComponent>;
        let service: GDPRAnswerMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [GDPRAnswerMgmDeleteDialogComponent],
                providers: [
                    GDPRAnswerMgmService
                ]
            })
            .overrideTemplate(GDPRAnswerMgmDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(GDPRAnswerMgmDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(GDPRAnswerMgmService);
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
