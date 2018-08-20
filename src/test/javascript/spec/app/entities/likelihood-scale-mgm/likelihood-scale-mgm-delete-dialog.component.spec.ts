/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { LikelihoodScaleMgmDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/likelihood-scale-mgm/likelihood-scale-mgm-delete-dialog.component';
import { LikelihoodScaleMgmService } from '../../../../../../main/webapp/app/entities/likelihood-scale-mgm/likelihood-scale-mgm.service';

describe('Component Tests', () => {

    describe('LikelihoodScaleMgm Management Delete Component', () => {
        let comp: LikelihoodScaleMgmDeleteDialogComponent;
        let fixture: ComponentFixture<LikelihoodScaleMgmDeleteDialogComponent>;
        let service: LikelihoodScaleMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [LikelihoodScaleMgmDeleteDialogComponent],
                providers: [
                    LikelihoodScaleMgmService
                ]
            })
            .overrideTemplate(LikelihoodScaleMgmDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LikelihoodScaleMgmDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LikelihoodScaleMgmService);
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
