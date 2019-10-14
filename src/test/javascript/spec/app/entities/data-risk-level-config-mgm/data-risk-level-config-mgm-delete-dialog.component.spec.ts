/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { DataRiskLevelConfigMgmDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/data-risk-level-config-mgm/data-risk-level-config-mgm-delete-dialog.component';
import { DataRiskLevelConfigMgmService } from '../../../../../../main/webapp/app/entities/data-risk-level-config-mgm/data-risk-level-config-mgm.service';

describe('Component Tests', () => {

    describe('DataRiskLevelConfigMgm Management Delete Component', () => {
        let comp: DataRiskLevelConfigMgmDeleteDialogComponent;
        let fixture: ComponentFixture<DataRiskLevelConfigMgmDeleteDialogComponent>;
        let service: DataRiskLevelConfigMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [DataRiskLevelConfigMgmDeleteDialogComponent],
                providers: [
                    DataRiskLevelConfigMgmService
                ]
            })
            .overrideTemplate(DataRiskLevelConfigMgmDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DataRiskLevelConfigMgmDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DataRiskLevelConfigMgmService);
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
