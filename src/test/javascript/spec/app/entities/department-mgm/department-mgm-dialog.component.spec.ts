/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { DepartmentMgmDialogComponent } from '../../../../../../main/webapp/app/entities/department-mgm/department-mgm-dialog.component';
import { DepartmentMgmService } from '../../../../../../main/webapp/app/entities/department-mgm/department-mgm.service';
import { DepartmentMgm } from '../../../../../../main/webapp/app/entities/department-mgm/department-mgm.model';
import { UserService } from '../../../../../../main/webapp/app/shared';
import { CompanyProfileMgmService } from '../../../../../../main/webapp/app/entities/company-profile-mgm';
import { SelfAssessmentMgmService } from '../../../../../../main/webapp/app/entities/self-assessment-mgm';

describe('Component Tests', () => {

    describe('DepartmentMgm Management Dialog Component', () => {
        let comp: DepartmentMgmDialogComponent;
        let fixture: ComponentFixture<DepartmentMgmDialogComponent>;
        let service: DepartmentMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [DepartmentMgmDialogComponent],
                providers: [
                    UserService,
                    CompanyProfileMgmService,
                    SelfAssessmentMgmService,
                    DepartmentMgmService
                ]
            })
            .overrideTemplate(DepartmentMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DepartmentMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DepartmentMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new DepartmentMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.department = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'departmentListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new DepartmentMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.department = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'departmentListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
