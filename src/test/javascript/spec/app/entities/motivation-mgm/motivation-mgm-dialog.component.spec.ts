/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { MotivationMgmDialogComponent } from '../../../../../../main/webapp/app/entities/motivation-mgm/motivation-mgm-dialog.component';
import { MotivationMgmService } from '../../../../../../main/webapp/app/entities/motivation-mgm/motivation-mgm.service';
import { MotivationMgm } from '../../../../../../main/webapp/app/entities/motivation-mgm/motivation-mgm.model';
import { ThreatAgentMgmService } from '../../../../../../main/webapp/app/entities/threat-agent-mgm';

describe('Component Tests', () => {

    describe('MotivationMgm Management Dialog Component', () => {
        let comp: MotivationMgmDialogComponent;
        let fixture: ComponentFixture<MotivationMgmDialogComponent>;
        let service: MotivationMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [MotivationMgmDialogComponent],
                providers: [
                    ThreatAgentMgmService,
                    MotivationMgmService
                ]
            })
            .overrideTemplate(MotivationMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(MotivationMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MotivationMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new MotivationMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.motivation = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'motivationListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new MotivationMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.motivation = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'motivationListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
