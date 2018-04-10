/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { AssetCategoryMgmDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/asset-category-mgm/asset-category-mgm-delete-dialog.component';
import { AssetCategoryMgmService } from '../../../../../../main/webapp/app/entities/asset-category-mgm/asset-category-mgm.service';

describe('Component Tests', () => {

    describe('AssetCategoryMgm Management Delete Component', () => {
        let comp: AssetCategoryMgmDeleteDialogComponent;
        let fixture: ComponentFixture<AssetCategoryMgmDeleteDialogComponent>;
        let service: AssetCategoryMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [AssetCategoryMgmDeleteDialogComponent],
                providers: [
                    AssetCategoryMgmService
                ]
            })
            .overrideTemplate(AssetCategoryMgmDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(AssetCategoryMgmDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AssetCategoryMgmService);
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
