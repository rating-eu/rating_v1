/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { HermeneutTestModule } from '../../../test.module';
import { MyAnswerMgmDialogComponent } from '../../../../../../main/webapp/app/entities/my-answer-mgm/my-answer-mgm-dialog.component';
import { MyAnswerMgmService } from '../../../../../../main/webapp/app/entities/my-answer-mgm/my-answer-mgm.service';
import { MyAnswerMgm } from '../../../../../../main/webapp/app/entities/my-answer-mgm/my-answer-mgm.model';
import { AnswerMgmService } from '../../../../../../main/webapp/app/entities/answer-mgm';
import { QuestionMgmService } from '../../../../../../main/webapp/app/entities/question-mgm';
import { QuestionnaireMgmService } from '../../../../../../main/webapp/app/entities/questionnaire-mgm';
import { UserService } from '../../../../../../main/webapp/app/shared';

describe('Component Tests', () => {

    describe('MyAnswerMgm Management Dialog Component', () => {
        let comp: MyAnswerMgmDialogComponent;
        let fixture: ComponentFixture<MyAnswerMgmDialogComponent>;
        let service: MyAnswerMgmService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [MyAnswerMgmDialogComponent],
                providers: [
                    AnswerMgmService,
                    QuestionMgmService,
                    QuestionnaireMgmService,
                    UserService,
                    MyAnswerMgmService
                ]
            })
            .overrideTemplate(MyAnswerMgmDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(MyAnswerMgmDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MyAnswerMgmService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new MyAnswerMgm(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.myAnswer = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'myAnswerListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new MyAnswerMgm();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.myAnswer = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'myAnswerListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
