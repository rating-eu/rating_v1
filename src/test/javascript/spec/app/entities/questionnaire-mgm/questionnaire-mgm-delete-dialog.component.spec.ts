/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { QuestionnaireMgmDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/questionnaire-mgm/questionnaire-mgm-delete-dialog.component';
import { QuestionnaireMgmService } from '../../../../../../main/webapp/app/entities/questionnaire-mgm/questionnaire-mgm.service';

describe('Component Tests', () => {

    describe('QuestionnaireMgm Management Delete Component', () => {
        let comp: QuestionnaireMgmDeleteDialogComponent;
        let fixture: ComponentFixture<QuestionnaireMgmDeleteDialogComponent>;
        let service: QuestionnaireMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [QuestionnaireMgmDeleteDialogComponent],
                providers: [
                    QuestionnaireMgmService
                ]
            })
            .overrideTemplate(QuestionnaireMgmDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(QuestionnaireMgmDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(QuestionnaireMgmService);
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
