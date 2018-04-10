/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { DomainOfInfluenceMgmDialogComponent } from '../../../../../../main/webapp/app/entities/domain-of-influence-mgm/domain-of-influence-mgm-dialog.component';
import { DomainOfInfluenceMgmService } from '../../../../../../main/webapp/app/entities/domain-of-influence-mgm/domain-of-influence-mgm.service';
import { DomainOfInfluenceMgm } from '../../../../../../main/webapp/app/entities/domain-of-influence-mgm/domain-of-influence-mgm.model';
import { AssetMgmService } from '../../../../../../main/webapp/app/entities/asset-mgm';

describe('Component Tests', () => {

    describe('DomainOfInfluenceMgm Management Dialog Component', () => {
        let comp: DomainOfInfluenceMgmDialogComponent;
        let fixture: ComponentFixture<DomainOfInfluenceMgmDialogComponent>;
        let service: DomainOfInfluenceMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [DomainOfInfluenceMgmDialogComponent],
                providers: [
                    AssetMgmService,
                    DomainOfInfluenceMgmService
                ]
            })
            .overrideTemplate(DomainOfInfluenceMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DomainOfInfluenceMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DomainOfInfluenceMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new DomainOfInfluenceMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.domainOfInfluence = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'domainOfInfluenceListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new DomainOfInfluenceMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.domainOfInfluence = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'domainOfInfluenceListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
