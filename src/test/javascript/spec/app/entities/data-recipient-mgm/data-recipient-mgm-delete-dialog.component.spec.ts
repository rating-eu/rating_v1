/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { DataRecipientMgmDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/data-recipient-mgm/data-recipient-mgm-delete-dialog.component';
import { DataRecipientMgmService } from '../../../../../../main/webapp/app/entities/data-recipient-mgm/data-recipient-mgm.service';

describe('Component Tests', () => {

    describe('DataRecipientMgm Management Delete Component', () => {
        let comp: DataRecipientMgmDeleteDialogComponent;
        let fixture: ComponentFixture<DataRecipientMgmDeleteDialogComponent>;
        let service: DataRecipientMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [DataRecipientMgmDeleteDialogComponent],
                providers: [
                    DataRecipientMgmService
                ]
            })
            .overrideTemplate(DataRecipientMgmDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DataRecipientMgmDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DataRecipientMgmService);
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
