/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { AttackStrategyMgmDialogComponent } from '../../../../../../main/webapp/app/entities/attack-strategy-mgm/attack-strategy-mgm-dialog.component';
import { AttackStrategyMgmService } from '../../../../../../main/webapp/app/entities/attack-strategy-mgm/attack-strategy-mgm.service';
import { AttackStrategyMgm } from '../../../../../../main/webapp/app/entities/attack-strategy-mgm/attack-strategy-mgm.model';
import { MitigationMgmService } from '../../../../../../main/webapp/app/entities/mitigation-mgm';
import { LevelMgmService } from '../../../../../../main/webapp/app/entities/level-mgm';
import { PhaseMgmService } from '../../../../../../main/webapp/app/entities/phase-mgm';

describe('Component Tests', () => {

    describe('AttackStrategyMgm Management Dialog Component', () => {
        let comp: AttackStrategyMgmDialogComponent;
        let fixture: ComponentFixture<AttackStrategyMgmDialogComponent>;
        let service: AttackStrategyMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [AttackStrategyMgmDialogComponent],
                providers: [
                    MitigationMgmService,
                    LevelMgmService,
                    PhaseMgmService,
                    AttackStrategyMgmService
                ]
            })
            .overrideTemplate(AttackStrategyMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(AttackStrategyMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AttackStrategyMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new AttackStrategyMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.attackStrategy = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'attackStrategyListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new AttackStrategyMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.attackStrategy = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'attackStrategyListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
