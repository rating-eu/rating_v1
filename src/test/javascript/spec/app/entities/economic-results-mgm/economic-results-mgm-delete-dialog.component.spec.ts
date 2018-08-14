/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { EconomicResultsMgmDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/economic-results-mgm/economic-results-mgm-delete-dialog.component';
import { EconomicResultsMgmService } from '../../../../../../main/webapp/app/entities/economic-results-mgm/economic-results-mgm.service';

describe('Component Tests', () => {

    describe('EconomicResultsMgm Management Delete Component', () => {
        let comp: EconomicResultsMgmDeleteDialogComponent;
        let fixture: ComponentFixture<EconomicResultsMgmDeleteDialogComponent>;
        let service: EconomicResultsMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [EconomicResultsMgmDeleteDialogComponent],
                providers: [
                    EconomicResultsMgmService
                ]
            })
            .overrideTemplate(EconomicResultsMgmDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(EconomicResultsMgmDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EconomicResultsMgmService);
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
