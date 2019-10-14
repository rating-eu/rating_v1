/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { OverallSecurityImpactMgmDialogComponent } from '../../../../../../main/webapp/app/entities/overall-security-impact-mgm/overall-security-impact-mgm-dialog.component';
import { OverallSecurityImpactMgmService } from '../../../../../../main/webapp/app/entities/overall-security-impact-mgm/overall-security-impact-mgm.service';
import { OverallSecurityImpactMgm } from '../../../../../../main/webapp/app/entities/overall-security-impact-mgm/overall-security-impact-mgm.model';
import { DataOperationMgmService } from '../../../../../../main/webapp/app/entities/data-operation-mgm';

describe('Component Tests', () => {

    describe('OverallSecurityImpactMgm Management Dialog Component', () => {
        let comp: OverallSecurityImpactMgmDialogComponent;
        let fixture: ComponentFixture<OverallSecurityImpactMgmDialogComponent>;
        let service: OverallSecurityImpactMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [OverallSecurityImpactMgmDialogComponent],
                providers: [
                    DataOperationMgmService,
                    OverallSecurityImpactMgmService
                ]
            })
            .overrideTemplate(OverallSecurityImpactMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(OverallSecurityImpactMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OverallSecurityImpactMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new OverallSecurityImpactMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.overallSecurityImpact = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'overallSecurityImpactListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new OverallSecurityImpactMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.overallSecurityImpact = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'overallSecurityImpactListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
