/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { IndirectAssetMgmDialogComponent } from '../../../../../../main/webapp/app/entities/indirect-asset-mgm/indirect-asset-mgm-dialog.component';
import { IndirectAssetMgmService } from '../../../../../../main/webapp/app/entities/indirect-asset-mgm/indirect-asset-mgm.service';
import { IndirectAssetMgm } from '../../../../../../main/webapp/app/entities/indirect-asset-mgm/indirect-asset-mgm.model';
import { DirectAssetMgmService } from '../../../../../../main/webapp/app/entities/direct-asset-mgm';
import { MyAssetMgmService } from '../../../../../../main/webapp/app/entities/my-asset-mgm';

describe('Component Tests', () => {

    describe('IndirectAssetMgm Management Dialog Component', () => {
        let comp: IndirectAssetMgmDialogComponent;
        let fixture: ComponentFixture<IndirectAssetMgmDialogComponent>;
        let service: IndirectAssetMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [IndirectAssetMgmDialogComponent],
                providers: [
                    DirectAssetMgmService,
                    MyAssetMgmService,
                    IndirectAssetMgmService
                ]
            })
            .overrideTemplate(IndirectAssetMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(IndirectAssetMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(IndirectAssetMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new IndirectAssetMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.indirectAsset = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'indirectAssetListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new IndirectAssetMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.indirectAsset = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'indirectAssetListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
