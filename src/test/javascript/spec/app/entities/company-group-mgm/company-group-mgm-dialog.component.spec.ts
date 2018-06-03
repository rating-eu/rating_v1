/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { CompanyGroupMgmDialogComponent } from '../../../../../../main/webapp/app/entities/company-group-mgm/company-group-mgm-dialog.component';
import { CompanyGroupMgmService } from '../../../../../../main/webapp/app/entities/company-group-mgm/company-group-mgm.service';
import { CompanyGroupMgm } from '../../../../../../main/webapp/app/entities/company-group-mgm/company-group-mgm.model';
import { UserService } from '../../../../../../main/webapp/app/shared';
import { CompanyProfileMgmService } from '../../../../../../main/webapp/app/entities/company-profile-mgm';
import { SelfAssessmentMgmService } from '../../../../../../main/webapp/app/entities/self-assessment-mgm';

describe('Component Tests', () => {

    describe('CompanyGroupMgm Management Dialog Component', () => {
        let comp: CompanyGroupMgmDialogComponent;
        let fixture: ComponentFixture<CompanyGroupMgmDialogComponent>;
        let service: CompanyGroupMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [CompanyGroupMgmDialogComponent],
                providers: [
                    UserService,
                    CompanyProfileMgmService,
                    SelfAssessmentMgmService,
                    CompanyGroupMgmService
                ]
            })
            .overrideTemplate(CompanyGroupMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CompanyGroupMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CompanyGroupMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new CompanyGroupMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.companyGroup = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'companyGroupListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new CompanyGroupMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.companyGroup = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'companyGroupListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
