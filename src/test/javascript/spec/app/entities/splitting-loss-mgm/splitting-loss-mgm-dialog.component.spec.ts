/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { SplittingLossMgmDialogComponent } from '../../../../../../main/webapp/app/entities/splitting-loss-mgm/splitting-loss-mgm-dialog.component';
import { SplittingLossMgmService } from '../../../../../../main/webapp/app/entities/splitting-loss-mgm/splitting-loss-mgm.service';
import { SplittingLossMgm } from '../../../../../../main/webapp/app/entities/splitting-loss-mgm/splitting-loss-mgm.model';
import { SelfAssessmentMgmService } from '../../../../../../main/webapp/app/entities/self-assessment-mgm';

describe('Component Tests', () => {

    describe('SplittingLossMgm Management Dialog Component', () => {
        let comp: SplittingLossMgmDialogComponent;
        let fixture: ComponentFixture<SplittingLossMgmDialogComponent>;
        let service: SplittingLossMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [SplittingLossMgmDialogComponent],
                providers: [
                    SelfAssessmentMgmService,
                    SplittingLossMgmService
                ]
            })
            .overrideTemplate(SplittingLossMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SplittingLossMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SplittingLossMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new SplittingLossMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.splittingLoss = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'splittingLossListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new SplittingLossMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.splittingLoss = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'splittingLossListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
