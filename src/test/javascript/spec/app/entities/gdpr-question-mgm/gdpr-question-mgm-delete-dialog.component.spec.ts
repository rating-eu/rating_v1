/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { GDPRQuestionMgmDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/gdpr-question-mgm/gdpr-question-mgm-delete-dialog.component';
import { GDPRQuestionMgmService } from '../../../../../../main/webapp/app/entities/gdpr-question-mgm/gdpr-question-mgm.service';

describe('Component Tests', () => {

    describe('GDPRQuestionMgm Management Delete Component', () => {
        let comp: GDPRQuestionMgmDeleteDialogComponent;
        let fixture: ComponentFixture<GDPRQuestionMgmDeleteDialogComponent>;
        let service: GDPRQuestionMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [GDPRQuestionMgmDeleteDialogComponent],
                providers: [
                    GDPRQuestionMgmService
                ]
            })
            .overrideTemplate(GDPRQuestionMgmDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(GDPRQuestionMgmDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(GDPRQuestionMgmService);
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