/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { GDPRQuestionnaireMgmDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/gdpr-questionnaire-mgm/gdpr-questionnaire-mgm-delete-dialog.component';
import { GDPRQuestionnaireMgmService } from '../../../../../../main/webapp/app/entities/gdpr-questionnaire-mgm/gdpr-questionnaire-mgm.service';

describe('Component Tests', () => {

    describe('GDPRQuestionnaireMgm Management Delete Component', () => {
        let comp: GDPRQuestionnaireMgmDeleteDialogComponent;
        let fixture: ComponentFixture<GDPRQuestionnaireMgmDeleteDialogComponent>;
        let service: GDPRQuestionnaireMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [GDPRQuestionnaireMgmDeleteDialogComponent],
                providers: [
                    GDPRQuestionnaireMgmService
                ]
            })
            .overrideTemplate(GDPRQuestionnaireMgmDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(GDPRQuestionnaireMgmDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(GDPRQuestionnaireMgmService);
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
