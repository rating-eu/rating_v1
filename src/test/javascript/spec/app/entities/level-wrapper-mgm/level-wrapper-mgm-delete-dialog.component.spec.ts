/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { LevelWrapperMgmDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/level-wrapper-mgm/level-wrapper-mgm-delete-dialog.component';
import { LevelWrapperMgmService } from '../../../../../../main/webapp/app/entities/level-wrapper-mgm/level-wrapper-mgm.service';

describe('Component Tests', () => {

    describe('LevelWrapperMgm Management Delete Component', () => {
        let comp: LevelWrapperMgmDeleteDialogComponent;
        let fixture: ComponentFixture<LevelWrapperMgmDeleteDialogComponent>;
        let service: LevelWrapperMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [LevelWrapperMgmDeleteDialogComponent],
                providers: [
                    LevelWrapperMgmService
                ]
            })
            .overrideTemplate(LevelWrapperMgmDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LevelWrapperMgmDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LevelWrapperMgmService);
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
