/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { OverallDataRiskMgmDialogComponent } from '../../../../../../main/webapp/app/entities/overall-data-risk-mgm/overall-data-risk-mgm-dialog.component';
import { OverallDataRiskMgmService } from '../../../../../../main/webapp/app/entities/overall-data-risk-mgm/overall-data-risk-mgm.service';
import { OverallDataRiskMgm } from '../../../../../../main/webapp/app/entities/overall-data-risk-mgm/overall-data-risk-mgm.model';
import { DataOperationMgmService } from '../../../../../../main/webapp/app/entities/data-operation-mgm';

describe('Component Tests', () => {

    describe('OverallDataRiskMgm Management Dialog Component', () => {
        let comp: OverallDataRiskMgmDialogComponent;
        let fixture: ComponentFixture<OverallDataRiskMgmDialogComponent>;
        let service: OverallDataRiskMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [OverallDataRiskMgmDialogComponent],
                providers: [
                    DataOperationMgmService,
                    OverallDataRiskMgmService
                ]
            })
            .overrideTemplate(OverallDataRiskMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(OverallDataRiskMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OverallDataRiskMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new OverallDataRiskMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.overallDataRisk = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'overallDataRiskListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new OverallDataRiskMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.overallDataRisk = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'overallDataRiskListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
