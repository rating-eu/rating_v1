/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { MyCompanyMgmDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/my-company-mgm/my-company-mgm-delete-dialog.component';
import { MyCompanyMgmService } from '../../../../../../main/webapp/app/entities/my-company-mgm/my-company-mgm.service';

describe('Component Tests', () => {

    describe('MyCompanyMgm Management Delete Component', () => {
        let comp: MyCompanyMgmDeleteDialogComponent;
        let fixture: ComponentFixture<MyCompanyMgmDeleteDialogComponent>;
        let service: MyCompanyMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [MyCompanyMgmDeleteDialogComponent],
                providers: [
                    MyCompanyMgmService
                ]
            })
            .overrideTemplate(MyCompanyMgmDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(MyCompanyMgmDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MyCompanyMgmService);
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
