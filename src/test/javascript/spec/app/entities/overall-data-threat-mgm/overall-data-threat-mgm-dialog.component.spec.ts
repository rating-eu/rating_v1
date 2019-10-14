/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { OverallDataThreatMgmDialogComponent } from '../../../../../../main/webapp/app/entities/overall-data-threat-mgm/overall-data-threat-mgm-dialog.component';
import { OverallDataThreatMgmService } from '../../../../../../main/webapp/app/entities/overall-data-threat-mgm/overall-data-threat-mgm.service';
import { OverallDataThreatMgm } from '../../../../../../main/webapp/app/entities/overall-data-threat-mgm/overall-data-threat-mgm.model';
import { DataOperationMgmService } from '../../../../../../main/webapp/app/entities/data-operation-mgm';

describe('Component Tests', () => {

    describe('OverallDataThreatMgm Management Dialog Component', () => {
        let comp: OverallDataThreatMgmDialogComponent;
        let fixture: ComponentFixture<OverallDataThreatMgmDialogComponent>;
        let service: OverallDataThreatMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [OverallDataThreatMgmDialogComponent],
                providers: [
                    DataOperationMgmService,
                    OverallDataThreatMgmService
                ]
            })
            .overrideTemplate(OverallDataThreatMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(OverallDataThreatMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OverallDataThreatMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new OverallDataThreatMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.overallDataThreat = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'overallDataThreatListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new OverallDataThreatMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.overallDataThreat = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'overallDataThreatListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
