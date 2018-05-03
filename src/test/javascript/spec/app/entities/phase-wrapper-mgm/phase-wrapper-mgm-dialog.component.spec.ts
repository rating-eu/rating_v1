/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { PhaseWrapperMgmDialogComponent } from '../../../../../../main/webapp/app/entities/phase-wrapper-mgm/phase-wrapper-mgm-dialog.component';
import { PhaseWrapperMgmService } from '../../../../../../main/webapp/app/entities/phase-wrapper-mgm/phase-wrapper-mgm.service';
import { PhaseWrapperMgm } from '../../../../../../main/webapp/app/entities/phase-wrapper-mgm/phase-wrapper-mgm.model';
import { AttackStrategyMgmService } from '../../../../../../main/webapp/app/entities/attack-strategy-mgm';

describe('Component Tests', () => {

    describe('PhaseWrapperMgm Management Dialog Component', () => {
        let comp: PhaseWrapperMgmDialogComponent;
        let fixture: ComponentFixture<PhaseWrapperMgmDialogComponent>;
        let service: PhaseWrapperMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [PhaseWrapperMgmDialogComponent],
                providers: [
                    AttackStrategyMgmService,
                    PhaseWrapperMgmService
                ]
            })
            .overrideTemplate(PhaseWrapperMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PhaseWrapperMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PhaseWrapperMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new PhaseWrapperMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.phaseWrapper = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'phaseWrapperListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new PhaseWrapperMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.phaseWrapper = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'phaseWrapperListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
