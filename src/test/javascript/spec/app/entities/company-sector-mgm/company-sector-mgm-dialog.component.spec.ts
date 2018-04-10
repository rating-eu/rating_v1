/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { CompanySectorMgmDialogComponent } from '../../../../../../main/webapp/app/entities/company-sector-mgm/company-sector-mgm-dialog.component';
import { CompanySectorMgmService } from '../../../../../../main/webapp/app/entities/company-sector-mgm/company-sector-mgm.service';
import { CompanySectorMgm } from '../../../../../../main/webapp/app/entities/company-sector-mgm/company-sector-mgm.model';
import { UserService } from '../../../../../../main/webapp/app/shared';
import { CompanyProfileMgmService } from '../../../../../../main/webapp/app/entities/company-profile-mgm';
import { SelfAssessmentMgmService } from '../../../../../../main/webapp/app/entities/self-assessment-mgm';

describe('Component Tests', () => {

    describe('CompanySectorMgm Management Dialog Component', () => {
        let comp: CompanySectorMgmDialogComponent;
        let fixture: ComponentFixture<CompanySectorMgmDialogComponent>;
        let service: CompanySectorMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [CompanySectorMgmDialogComponent],
                providers: [
                    UserService,
                    CompanyProfileMgmService,
                    SelfAssessmentMgmService,
                    CompanySectorMgmService
                ]
            })
            .overrideTemplate(CompanySectorMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CompanySectorMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CompanySectorMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new CompanySectorMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.companySector = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'companySectorListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new CompanySectorMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.companySector = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'companySectorListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
