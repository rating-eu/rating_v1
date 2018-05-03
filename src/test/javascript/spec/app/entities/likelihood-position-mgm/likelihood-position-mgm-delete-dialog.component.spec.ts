/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { LikelihoodPositionMgmDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/likelihood-position-mgm/likelihood-position-mgm-delete-dialog.component';
import { LikelihoodPositionMgmService } from '../../../../../../main/webapp/app/entities/likelihood-position-mgm/likelihood-position-mgm.service';

describe('Component Tests', () => {

    describe('LikelihoodPositionMgm Management Delete Component', () => {
        let comp: LikelihoodPositionMgmDeleteDialogComponent;
        let fixture: ComponentFixture<LikelihoodPositionMgmDeleteDialogComponent>;
        let service: LikelihoodPositionMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [LikelihoodPositionMgmDeleteDialogComponent],
                providers: [
                    LikelihoodPositionMgmService
                ]
            })
            .overrideTemplate(LikelihoodPositionMgmDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LikelihoodPositionMgmDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LikelihoodPositionMgmService);
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
