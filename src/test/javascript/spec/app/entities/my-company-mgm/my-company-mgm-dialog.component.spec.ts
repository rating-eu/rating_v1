/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { MyCompanyMgmDialogComponent } from '../../../../../../main/webapp/app/entities/my-company-mgm/my-company-mgm-dialog.component';
import { MyCompanyMgmService } from '../../../../../../main/webapp/app/entities/my-company-mgm/my-company-mgm.service';
import { MyCompanyMgm } from '../../../../../../main/webapp/app/entities/my-company-mgm/my-company-mgm.model';
import { UserService } from '../../../../../../main/webapp/app/shared';
import { CompanyProfileMgmService } from '../../../../../../main/webapp/app/entities/company-profile-mgm';

describe('Component Tests', () => {

    describe('MyCompanyMgm Management Dialog Component', () => {
        let comp: MyCompanyMgmDialogComponent;
        let fixture: ComponentFixture<MyCompanyMgmDialogComponent>;
        let service: MyCompanyMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [MyCompanyMgmDialogComponent],
                providers: [
                    UserService,
                    CompanyProfileMgmService,
                    MyCompanyMgmService
                ]
            })
            .overrideTemplate(MyCompanyMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(MyCompanyMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MyCompanyMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new MyCompanyMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.myCompany = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'myCompanyListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new MyCompanyMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.myCompany = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'myCompanyListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
