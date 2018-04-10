/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { ExternalAuditMgmDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/external-audit-mgm/external-audit-mgm-delete-dialog.component';
import { ExternalAuditMgmService } from '../../../../../../main/webapp/app/entities/external-audit-mgm/external-audit-mgm.service';

describe('Component Tests', () => {

    describe('ExternalAuditMgm Management Delete Component', () => {
        let comp: ExternalAuditMgmDeleteDialogComponent;
        let fixture: ComponentFixture<ExternalAuditMgmDeleteDialogComponent>;
        let service: ExternalAuditMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [ExternalAuditMgmDeleteDialogComponent],
                providers: [
                    ExternalAuditMgmService
                ]
            })
            .overrideTemplate(ExternalAuditMgmDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ExternalAuditMgmDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ExternalAuditMgmService);
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
