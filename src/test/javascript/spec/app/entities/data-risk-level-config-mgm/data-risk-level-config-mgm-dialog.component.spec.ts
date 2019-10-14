/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { DataRiskLevelConfigMgmDialogComponent } from '../../../../../../main/webapp/app/entities/data-risk-level-config-mgm/data-risk-level-config-mgm-dialog.component';
import { DataRiskLevelConfigMgmService } from '../../../../../../main/webapp/app/entities/data-risk-level-config-mgm/data-risk-level-config-mgm.service';
import { DataRiskLevelConfigMgm } from '../../../../../../main/webapp/app/entities/data-risk-level-config-mgm/data-risk-level-config-mgm.model';
import { DataOperationMgmService } from '../../../../../../main/webapp/app/entities/data-operation-mgm';

describe('Component Tests', () => {

    describe('DataRiskLevelConfigMgm Management Dialog Component', () => {
        let comp: DataRiskLevelConfigMgmDialogComponent;
        let fixture: ComponentFixture<DataRiskLevelConfigMgmDialogComponent>;
        let service: DataRiskLevelConfigMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [DataRiskLevelConfigMgmDialogComponent],
                providers: [
                    DataOperationMgmService,
                    DataRiskLevelConfigMgmService
                ]
            })
            .overrideTemplate(DataRiskLevelConfigMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DataRiskLevelConfigMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DataRiskLevelConfigMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new DataRiskLevelConfigMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.dataRiskLevelConfig = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'dataRiskLevelConfigListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new DataRiskLevelConfigMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.dataRiskLevelConfig = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'dataRiskLevelConfigListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
