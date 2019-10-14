/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { SecurityImpactMgmDialogComponent } from '../../../../../../main/webapp/app/entities/security-impact-mgm/security-impact-mgm-dialog.component';
import { SecurityImpactMgmService } from '../../../../../../main/webapp/app/entities/security-impact-mgm/security-impact-mgm.service';
import { SecurityImpactMgm } from '../../../../../../main/webapp/app/entities/security-impact-mgm/security-impact-mgm.model';
import { DataOperationMgmService } from '../../../../../../main/webapp/app/entities/data-operation-mgm';
import { OverallSecurityImpactMgmService } from '../../../../../../main/webapp/app/entities/overall-security-impact-mgm';

describe('Component Tests', () => {

    describe('SecurityImpactMgm Management Dialog Component', () => {
        let comp: SecurityImpactMgmDialogComponent;
        let fixture: ComponentFixture<SecurityImpactMgmDialogComponent>;
        let service: SecurityImpactMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [SecurityImpactMgmDialogComponent],
                providers: [
                    DataOperationMgmService,
                    OverallSecurityImpactMgmService,
                    SecurityImpactMgmService
                ]
            })
            .overrideTemplate(SecurityImpactMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SecurityImpactMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SecurityImpactMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new SecurityImpactMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.securityImpact = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'securityImpactListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new SecurityImpactMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.securityImpact = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'securityImpactListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
