/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { CompanySectorMgmDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/company-sector-mgm/company-sector-mgm-delete-dialog.component';
import { CompanySectorMgmService } from '../../../../../../main/webapp/app/entities/company-sector-mgm/company-sector-mgm.service';

describe('Component Tests', () => {

    describe('CompanySectorMgm Management Delete Component', () => {
        let comp: CompanySectorMgmDeleteDialogComponent;
        let fixture: ComponentFixture<CompanySectorMgmDeleteDialogComponent>;
        let service: CompanySectorMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [CompanySectorMgmDeleteDialogComponent],
                providers: [
                    CompanySectorMgmService
                ]
            })
            .overrideTemplate(CompanySectorMgmDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CompanySectorMgmDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CompanySectorMgmService);
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
