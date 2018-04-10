/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { ExternalAuditMgmDialogComponent } from '../../../../../../main/webapp/app/entities/external-audit-mgm/external-audit-mgm-dialog.component';
import { ExternalAuditMgmService } from '../../../../../../main/webapp/app/entities/external-audit-mgm/external-audit-mgm.service';
import { ExternalAuditMgm } from '../../../../../../main/webapp/app/entities/external-audit-mgm/external-audit-mgm.model';
import { UserService } from '../../../../../../main/webapp/app/shared';
import { SelfAssessmentMgmService } from '../../../../../../main/webapp/app/entities/self-assessment-mgm';

describe('Component Tests', () => {

    describe('ExternalAuditMgm Management Dialog Component', () => {
        let comp: ExternalAuditMgmDialogComponent;
        let fixture: ComponentFixture<ExternalAuditMgmDialogComponent>;
        let service: ExternalAuditMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [ExternalAuditMgmDialogComponent],
                providers: [
                    UserService,
                    SelfAssessmentMgmService,
                    ExternalAuditMgmService
                ]
            })
            .overrideTemplate(ExternalAuditMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ExternalAuditMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ExternalAuditMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new ExternalAuditMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.externalAudit = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'externalAuditListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new ExternalAuditMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.externalAudit = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'externalAuditListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
