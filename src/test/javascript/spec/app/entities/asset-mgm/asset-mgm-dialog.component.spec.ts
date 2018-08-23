/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { AssetMgmDialogComponent } from '../../../../../../main/webapp/app/entities/asset-mgm/asset-mgm-dialog.component';
import { AssetMgmService } from '../../../../../../main/webapp/app/entities/asset-mgm/asset-mgm.service';
import { AssetMgm } from '../../../../../../main/webapp/app/entities/asset-mgm/asset-mgm.model';
import { ContainerMgmService } from '../../../../../../main/webapp/app/entities/container-mgm';
import { DomainOfInfluenceMgmService } from '../../../../../../main/webapp/app/entities/domain-of-influence-mgm';
import { AssetCategoryMgmService } from '../../../../../../main/webapp/app/entities/asset-category-mgm';

describe('Component Tests', () => {

    describe('AssetMgm Management Dialog Component', () => {
        let comp: AssetMgmDialogComponent;
        let fixture: ComponentFixture<AssetMgmDialogComponent>;
        let service: AssetMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [AssetMgmDialogComponent],
                providers: [
                    ContainerMgmService,
                    DomainOfInfluenceMgmService,
                    AssetCategoryMgmService,
                    AssetMgmService
                ]
            })
            .overrideTemplate(AssetMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(AssetMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AssetMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new AssetMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.asset = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'assetListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new AssetMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.asset = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'assetListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
