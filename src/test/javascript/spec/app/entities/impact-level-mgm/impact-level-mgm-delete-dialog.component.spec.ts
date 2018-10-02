/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { ImpactLevelMgmDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/impact-level-mgm/impact-level-mgm-delete-dialog.component';
import { ImpactLevelMgmService } from '../../../../../../main/webapp/app/entities/impact-level-mgm/impact-level-mgm.service';

describe('Component Tests', () => {

    describe('ImpactLevelMgm Management Delete Component', () => {
        let comp: ImpactLevelMgmDeleteDialogComponent;
        let fixture: ComponentFixture<ImpactLevelMgmDeleteDialogComponent>;
        let service: ImpactLevelMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [ImpactLevelMgmDeleteDialogComponent],
                providers: [
                    ImpactLevelMgmService
                ]
            })
            .overrideTemplate(ImpactLevelMgmDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ImpactLevelMgmDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ImpactLevelMgmService);
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
