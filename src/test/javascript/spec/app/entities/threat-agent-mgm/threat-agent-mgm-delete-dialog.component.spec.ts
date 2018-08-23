/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { ThreatAgentMgmDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/threat-agent-mgm/threat-agent-mgm-delete-dialog.component';
import { ThreatAgentMgmService } from '../../../../../../main/webapp/app/entities/threat-agent-mgm/threat-agent-mgm.service';

describe('Component Tests', () => {

    describe('ThreatAgentMgm Management Delete Component', () => {
        let comp: ThreatAgentMgmDeleteDialogComponent;
        let fixture: ComponentFixture<ThreatAgentMgmDeleteDialogComponent>;
        let service: ThreatAgentMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [ThreatAgentMgmDeleteDialogComponent],
                providers: [
                    ThreatAgentMgmService
                ]
            })
            .overrideTemplate(ThreatAgentMgmDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ThreatAgentMgmDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ThreatAgentMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        spyOn(service, 'delete').and.returnValue(Observable.of({}));

                        // WHEN
                        comp.confirmDelete(123);
                        tick();

                        // THEN
                        expect(service.delete).toHaveBeenCalledWith(123);
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
