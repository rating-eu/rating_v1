/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { DataOperationMgmDialogComponent } from '../../../../../../main/webapp/app/entities/data-operation-mgm/data-operation-mgm-dialog.component';
import { DataOperationMgmService } from '../../../../../../main/webapp/app/entities/data-operation-mgm/data-operation-mgm.service';
import { DataOperationMgm } from '../../../../../../main/webapp/app/entities/data-operation-mgm/data-operation-mgm.model';
import { CompanyProfileMgmService } from '../../../../../../main/webapp/app/entities/company-profile-mgm';

describe('Component Tests', () => {

    describe('DataOperationMgm Management Dialog Component', () => {
        let comp: DataOperationMgmDialogComponent;
        let fixture: ComponentFixture<DataOperationMgmDialogComponent>;
        let service: DataOperationMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [DataOperationMgmDialogComponent],
                providers: [
                    CompanyProfileMgmService,
                    DataOperationMgmService
                ]
            })
            .overrideTemplate(DataOperationMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DataOperationMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DataOperationMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new DataOperationMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.dataOperation = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'dataOperationListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new DataOperationMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.dataOperation = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'dataOperationListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
