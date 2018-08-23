/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { SplittingLossMgmDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/splitting-loss-mgm/splitting-loss-mgm-delete-dialog.component';
import { SplittingLossMgmService } from '../../../../../../main/webapp/app/entities/splitting-loss-mgm/splitting-loss-mgm.service';

describe('Component Tests', () => {

    describe('SplittingLossMgm Management Delete Component', () => {
        let comp: SplittingLossMgmDeleteDialogComponent;
        let fixture: ComponentFixture<SplittingLossMgmDeleteDialogComponent>;
        let service: SplittingLossMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [SplittingLossMgmDeleteDialogComponent],
                providers: [
                    SplittingLossMgmService
                ]
            })
            .overrideTemplate(SplittingLossMgmDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SplittingLossMgmDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SplittingLossMgmService);
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
