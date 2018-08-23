/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { CompanyProfileMgmDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/company-profile-mgm/company-profile-mgm-delete-dialog.component';
import { CompanyProfileMgmService } from '../../../../../../main/webapp/app/entities/company-profile-mgm/company-profile-mgm.service';

describe('Component Tests', () => {

    describe('CompanyProfileMgm Management Delete Component', () => {
        let comp: CompanyProfileMgmDeleteDialogComponent;
        let fixture: ComponentFixture<CompanyProfileMgmDeleteDialogComponent>;
        let service: CompanyProfileMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [CompanyProfileMgmDeleteDialogComponent],
                providers: [
                    CompanyProfileMgmService
                ]
            })
            .overrideTemplate(CompanyProfileMgmDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CompanyProfileMgmDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CompanyProfileMgmService);
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
