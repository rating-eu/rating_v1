/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { AttackCostMgmDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/attack-cost-mgm/attack-cost-mgm-delete-dialog.component';
import { AttackCostMgmService } from '../../../../../../main/webapp/app/entities/attack-cost-mgm/attack-cost-mgm.service';

describe('Component Tests', () => {

    describe('AttackCostMgm Management Delete Component', () => {
        let comp: AttackCostMgmDeleteDialogComponent;
        let fixture: ComponentFixture<AttackCostMgmDeleteDialogComponent>;
        let service: AttackCostMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [AttackCostMgmDeleteDialogComponent],
                providers: [
                    AttackCostMgmService
                ]
            })
            .overrideTemplate(AttackCostMgmDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(AttackCostMgmDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AttackCostMgmService);
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
