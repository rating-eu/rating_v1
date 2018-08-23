/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { CompanyProfileMgmDialogComponent } from '../../../../../../main/webapp/app/entities/company-profile-mgm/company-profile-mgm-dialog.component';
import { CompanyProfileMgmService } from '../../../../../../main/webapp/app/entities/company-profile-mgm/company-profile-mgm.service';
import { CompanyProfileMgm } from '../../../../../../main/webapp/app/entities/company-profile-mgm/company-profile-mgm.model';
import { UserService } from '../../../../../../main/webapp/app/shared';
import { ContainerMgmService } from '../../../../../../main/webapp/app/entities/container-mgm';

describe('Component Tests', () => {

    describe('CompanyProfileMgm Management Dialog Component', () => {
        let comp: CompanyProfileMgmDialogComponent;
        let fixture: ComponentFixture<CompanyProfileMgmDialogComponent>;
        let service: CompanyProfileMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [CompanyProfileMgmDialogComponent],
                providers: [
                    UserService,
                    ContainerMgmService,
                    CompanyProfileMgmService
                ]
            })
            .overrideTemplate(CompanyProfileMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CompanyProfileMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CompanyProfileMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new CompanyProfileMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.companyProfile = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'companyProfileListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new CompanyProfileMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.companyProfile = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'companyProfileListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
