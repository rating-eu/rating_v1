/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { LikelihoodScaleMgmDialogComponent } from '../../../../../../main/webapp/app/entities/likelihood-scale-mgm/likelihood-scale-mgm-dialog.component';
import { LikelihoodScaleMgmService } from '../../../../../../main/webapp/app/entities/likelihood-scale-mgm/likelihood-scale-mgm.service';
import { LikelihoodScaleMgm } from '../../../../../../main/webapp/app/entities/likelihood-scale-mgm/likelihood-scale-mgm.model';
import { SelfAssessmentMgmService } from '../../../../../../main/webapp/app/entities/self-assessment-mgm';

describe('Component Tests', () => {

    describe('LikelihoodScaleMgm Management Dialog Component', () => {
        let comp: LikelihoodScaleMgmDialogComponent;
        let fixture: ComponentFixture<LikelihoodScaleMgmDialogComponent>;
        let service: LikelihoodScaleMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [LikelihoodScaleMgmDialogComponent],
                providers: [
                    SelfAssessmentMgmService,
                    LikelihoodScaleMgmService
                ]
            })
            .overrideTemplate(LikelihoodScaleMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LikelihoodScaleMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LikelihoodScaleMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new LikelihoodScaleMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.likelihoodScale = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'likelihoodScaleListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new LikelihoodScaleMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.likelihoodScale = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'likelihoodScaleListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
