/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { ContainerMgmDialogComponent } from '../../../../../../main/webapp/app/entities/container-mgm/container-mgm-dialog.component';
import { ContainerMgmService } from '../../../../../../main/webapp/app/entities/container-mgm/container-mgm.service';
import { ContainerMgm } from '../../../../../../main/webapp/app/entities/container-mgm/container-mgm.model';
import { CompanyProfileMgmService } from '../../../../../../main/webapp/app/entities/company-profile-mgm';
import { AssetMgmService } from '../../../../../../main/webapp/app/entities/asset-mgm';

describe('Component Tests', () => {

    describe('ContainerMgm Management Dialog Component', () => {
        let comp: ContainerMgmDialogComponent;
        let fixture: ComponentFixture<ContainerMgmDialogComponent>;
        let service: ContainerMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [ContainerMgmDialogComponent],
                providers: [
                    CompanyProfileMgmService,
                    AssetMgmService,
                    ContainerMgmService
                ]
            })
            .overrideTemplate(ContainerMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ContainerMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ContainerMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new ContainerMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.container = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'containerListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new ContainerMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.container = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'containerListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
