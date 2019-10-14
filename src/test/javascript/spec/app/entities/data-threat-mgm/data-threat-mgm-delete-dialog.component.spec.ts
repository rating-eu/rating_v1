/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { DataThreatMgmDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/data-threat-mgm/data-threat-mgm-delete-dialog.component';
import { DataThreatMgmService } from '../../../../../../main/webapp/app/entities/data-threat-mgm/data-threat-mgm.service';

describe('Component Tests', () => {

    describe('DataThreatMgm Management Delete Component', () => {
        let comp: DataThreatMgmDeleteDialogComponent;
        let fixture: ComponentFixture<DataThreatMgmDeleteDialogComponent>;
        let service: DataThreatMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [DataThreatMgmDeleteDialogComponent],
                providers: [
                    DataThreatMgmService
                ]
            })
            .overrideTemplate(DataThreatMgmDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DataThreatMgmDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DataThreatMgmService);
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
