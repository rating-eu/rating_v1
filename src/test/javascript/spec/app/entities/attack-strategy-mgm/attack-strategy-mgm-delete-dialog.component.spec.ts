/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { AttackStrategyMgmDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/attack-strategy-mgm/attack-strategy-mgm-delete-dialog.component';
import { AttackStrategyMgmService } from '../../../../../../main/webapp/app/entities/attack-strategy-mgm/attack-strategy-mgm.service';

describe('Component Tests', () => {

    describe('AttackStrategyMgm Management Delete Component', () => {
        let comp: AttackStrategyMgmDeleteDialogComponent;
        let fixture: ComponentFixture<AttackStrategyMgmDeleteDialogComponent>;
        let service: AttackStrategyMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [AttackStrategyMgmDeleteDialogComponent],
                providers: [
                    AttackStrategyMgmService
                ]
            })
            .overrideTemplate(AttackStrategyMgmDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(AttackStrategyMgmDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AttackStrategyMgmService);
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
