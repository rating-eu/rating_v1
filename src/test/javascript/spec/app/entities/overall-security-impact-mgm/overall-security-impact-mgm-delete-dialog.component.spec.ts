/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { OverallSecurityImpactMgmDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/overall-security-impact-mgm/overall-security-impact-mgm-delete-dialog.component';
import { OverallSecurityImpactMgmService } from '../../../../../../main/webapp/app/entities/overall-security-impact-mgm/overall-security-impact-mgm.service';

describe('Component Tests', () => {

    describe('OverallSecurityImpactMgm Management Delete Component', () => {
        let comp: OverallSecurityImpactMgmDeleteDialogComponent;
        let fixture: ComponentFixture<OverallSecurityImpactMgmDeleteDialogComponent>;
        let service: OverallSecurityImpactMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [OverallSecurityImpactMgmDeleteDialogComponent],
                providers: [
                    OverallSecurityImpactMgmService
                ]
            })
            .overrideTemplate(OverallSecurityImpactMgmDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(OverallSecurityImpactMgmDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OverallSecurityImpactMgmService);
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
