/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { DirectAssetMgmDialogComponent } from '../../../../../../main/webapp/app/entities/direct-asset-mgm/direct-asset-mgm-dialog.component';
import { DirectAssetMgmService } from '../../../../../../main/webapp/app/entities/direct-asset-mgm/direct-asset-mgm.service';
import { DirectAssetMgm } from '../../../../../../main/webapp/app/entities/direct-asset-mgm/direct-asset-mgm.model';
import { MyAssetMgmService } from '../../../../../../main/webapp/app/entities/my-asset-mgm';

describe('Component Tests', () => {

    describe('DirectAssetMgm Management Dialog Component', () => {
        let comp: DirectAssetMgmDialogComponent;
        let fixture: ComponentFixture<DirectAssetMgmDialogComponent>;
        let service: DirectAssetMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [DirectAssetMgmDialogComponent],
                providers: [
                    MyAssetMgmService,
                    DirectAssetMgmService
                ]
            })
            .overrideTemplate(DirectAssetMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DirectAssetMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DirectAssetMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new DirectAssetMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.directAsset = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'directAssetListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new DirectAssetMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.directAsset = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'directAssetListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
