/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { LikelihoodPositionMgmDialogComponent } from '../../../../../../main/webapp/app/entities/likelihood-position-mgm/likelihood-position-mgm-dialog.component';
import { LikelihoodPositionMgmService } from '../../../../../../main/webapp/app/entities/likelihood-position-mgm/likelihood-position-mgm.service';
import { LikelihoodPositionMgm } from '../../../../../../main/webapp/app/entities/likelihood-position-mgm/likelihood-position-mgm.model';

describe('Component Tests', () => {

    describe('LikelihoodPositionMgm Management Dialog Component', () => {
        let comp: LikelihoodPositionMgmDialogComponent;
        let fixture: ComponentFixture<LikelihoodPositionMgmDialogComponent>;
        let service: LikelihoodPositionMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [LikelihoodPositionMgmDialogComponent],
                providers: [
                    LikelihoodPositionMgmService
                ]
            })
            .overrideTemplate(LikelihoodPositionMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LikelihoodPositionMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LikelihoodPositionMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new LikelihoodPositionMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.likelihoodPosition = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'likelihoodPositionListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new LikelihoodPositionMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.likelihoodPosition = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'likelihoodPositionListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
