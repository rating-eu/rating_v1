/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { ImpactLevelDescriptionMgmDialogComponent } from '../../../../../../main/webapp/app/entities/impact-level-description-mgm/impact-level-description-mgm-dialog.component';
import { ImpactLevelDescriptionMgmService } from '../../../../../../main/webapp/app/entities/impact-level-description-mgm/impact-level-description-mgm.service';
import { ImpactLevelDescriptionMgm } from '../../../../../../main/webapp/app/entities/impact-level-description-mgm/impact-level-description-mgm.model';

describe('Component Tests', () => {

    describe('ImpactLevelDescriptionMgm Management Dialog Component', () => {
        let comp: ImpactLevelDescriptionMgmDialogComponent;
        let fixture: ComponentFixture<ImpactLevelDescriptionMgmDialogComponent>;
        let service: ImpactLevelDescriptionMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [ImpactLevelDescriptionMgmDialogComponent],
                providers: [
                    ImpactLevelDescriptionMgmService
                ]
            })
            .overrideTemplate(ImpactLevelDescriptionMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ImpactLevelDescriptionMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ImpactLevelDescriptionMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new ImpactLevelDescriptionMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.impactLevelDescription = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'impactLevelDescriptionListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new ImpactLevelDescriptionMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.impactLevelDescription = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'impactLevelDescriptionListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
