/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { SelfAssessmentMgmDialogComponent } from '../../../../../../main/webapp/app/entities/self-assessment-mgm/self-assessment-mgm-dialog.component';
import { SelfAssessmentMgmService } from '../../../../../../main/webapp/app/entities/self-assessment-mgm/self-assessment-mgm.service';
import { SelfAssessmentMgm } from '../../../../../../main/webapp/app/entities/self-assessment-mgm/self-assessment-mgm.model';
import { UserService } from '../../../../../../main/webapp/app/shared';
import { CompanyProfileMgmService } from '../../../../../../main/webapp/app/entities/company-profile-mgm';
import { CompanyGroupMgmService } from '../../../../../../main/webapp/app/entities/company-group-mgm';
import { ThreatAgentMgmService } from '../../../../../../main/webapp/app/entities/threat-agent-mgm';
import { ExternalAuditMgmService } from '../../../../../../main/webapp/app/entities/external-audit-mgm';

describe('Component Tests', () => {

    describe('SelfAssessmentMgm Management Dialog Component', () => {
        let comp: SelfAssessmentMgmDialogComponent;
        let fixture: ComponentFixture<SelfAssessmentMgmDialogComponent>;
        let service: SelfAssessmentMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [SelfAssessmentMgmDialogComponent],
                providers: [
                    UserService,
                    CompanyProfileMgmService,
                    CompanyGroupMgmService,
                    ThreatAgentMgmService,
                    ExternalAuditMgmService,
                    SelfAssessmentMgmService
                ]
            })
            .overrideTemplate(SelfAssessmentMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SelfAssessmentMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SelfAssessmentMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new SelfAssessmentMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.selfAssessment = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'selfAssessmentListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new SelfAssessmentMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.selfAssessment = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'selfAssessmentListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
