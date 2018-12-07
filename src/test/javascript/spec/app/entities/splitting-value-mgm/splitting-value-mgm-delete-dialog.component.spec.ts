/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { SplittingValueMgmDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/splitting-value-mgm/splitting-value-mgm-delete-dialog.component';
import { SplittingValueMgmService } from '../../../../../../main/webapp/app/entities/splitting-value-mgm/splitting-value-mgm.service';

describe('Component Tests', () => {

    describe('SplittingValueMgm Management Delete Component', () => {
        let comp: SplittingValueMgmDeleteDialogComponent;
        let fixture: ComponentFixture<SplittingValueMgmDeleteDialogComponent>;
        let service: SplittingValueMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [SplittingValueMgmDeleteDialogComponent],
                providers: [
                    SplittingValueMgmService
                ]
            })
            .overrideTemplate(SplittingValueMgmDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SplittingValueMgmDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SplittingValueMgmService);
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
