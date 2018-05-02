/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { LevelWrapperMgmDialogComponent } from '../../../../../../main/webapp/app/entities/level-wrapper-mgm/level-wrapper-mgm-dialog.component';
import { LevelWrapperMgmService } from '../../../../../../main/webapp/app/entities/level-wrapper-mgm/level-wrapper-mgm.service';
import { LevelWrapperMgm } from '../../../../../../main/webapp/app/entities/level-wrapper-mgm/level-wrapper-mgm.model';
import { AttackStrategyMgmService } from '../../../../../../main/webapp/app/entities/attack-strategy-mgm';

describe('Component Tests', () => {

    describe('LevelWrapperMgm Management Dialog Component', () => {
        let comp: LevelWrapperMgmDialogComponent;
        let fixture: ComponentFixture<LevelWrapperMgmDialogComponent>;
        let service: LevelWrapperMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [LevelWrapperMgmDialogComponent],
                providers: [
                    AttackStrategyMgmService,
                    LevelWrapperMgmService
                ]
            })
            .overrideTemplate(LevelWrapperMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LevelWrapperMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LevelWrapperMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new LevelWrapperMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.levelWrapper = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'levelWrapperListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new LevelWrapperMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.levelWrapper = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'levelWrapperListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
