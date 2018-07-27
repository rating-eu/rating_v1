/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { DirectAssetMgmDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/direct-asset-mgm/direct-asset-mgm-delete-dialog.component';
import { DirectAssetMgmService } from '../../../../../../main/webapp/app/entities/direct-asset-mgm/direct-asset-mgm.service';

describe('Component Tests', () => {

    describe('DirectAssetMgm Management Delete Component', () => {
        let comp: DirectAssetMgmDeleteDialogComponent;
        let fixture: ComponentFixture<DirectAssetMgmDeleteDialogComponent>;
        let service: DirectAssetMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [DirectAssetMgmDeleteDialogComponent],
                providers: [
                    DirectAssetMgmService
                ]
            })
            .overrideTemplate(DirectAssetMgmDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DirectAssetMgmDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DirectAssetMgmService);
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
