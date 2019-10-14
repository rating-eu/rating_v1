/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { DataThreatMgmDialogComponent } from '../../../../../../main/webapp/app/entities/data-threat-mgm/data-threat-mgm-dialog.component';
import { DataThreatMgmService } from '../../../../../../main/webapp/app/entities/data-threat-mgm/data-threat-mgm.service';
import { DataThreatMgm } from '../../../../../../main/webapp/app/entities/data-threat-mgm/data-threat-mgm.model';
import { DataOperationMgmService } from '../../../../../../main/webapp/app/entities/data-operation-mgm';
import { OverallDataThreatMgmService } from '../../../../../../main/webapp/app/entities/overall-data-threat-mgm';

describe('Component Tests', () => {

    describe('DataThreatMgm Management Dialog Component', () => {
        let comp: DataThreatMgmDialogComponent;
        let fixture: ComponentFixture<DataThreatMgmDialogComponent>;
        let service: DataThreatMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [DataThreatMgmDialogComponent],
                providers: [
                    DataOperationMgmService,
                    OverallDataThreatMgmService,
                    DataThreatMgmService
                ]
            })
            .overrideTemplate(DataThreatMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DataThreatMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DataThreatMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new DataThreatMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.dataThreat = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'dataThreatListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new DataThreatMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.dataThreat = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'dataThreatListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
