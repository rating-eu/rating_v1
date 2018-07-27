/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { MyAssetMgmDialogComponent } from '../../../../../../main/webapp/app/entities/my-asset-mgm/my-asset-mgm-dialog.component';
import { MyAssetMgmService } from '../../../../../../main/webapp/app/entities/my-asset-mgm/my-asset-mgm.service';
import { MyAssetMgm } from '../../../../../../main/webapp/app/entities/my-asset-mgm/my-asset-mgm.model';
import { AssetMgmService } from '../../../../../../main/webapp/app/entities/asset-mgm';
import { SelfAssessmentMgmService } from '../../../../../../main/webapp/app/entities/self-assessment-mgm';
import { QuestionnaireMgmService } from '../../../../../../main/webapp/app/entities/questionnaire-mgm';

describe('Component Tests', () => {

    describe('MyAssetMgm Management Dialog Component', () => {
        let comp: MyAssetMgmDialogComponent;
        let fixture: ComponentFixture<MyAssetMgmDialogComponent>;
        let service: MyAssetMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [MyAssetMgmDialogComponent],
                providers: [
                    AssetMgmService,
                    SelfAssessmentMgmService,
                    QuestionnaireMgmService,
                    MyAssetMgmService
                ]
            })
            .overrideTemplate(MyAssetMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(MyAssetMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MyAssetMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new MyAssetMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.myAsset = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'myAssetListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new MyAssetMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.myAsset = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'myAssetListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
