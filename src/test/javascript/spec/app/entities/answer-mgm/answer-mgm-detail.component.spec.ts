/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { AnswerMgmDetailComponent } from '../../../../../../main/webapp/app/entities/answer-mgm/answer-mgm-detail.component';
import { AnswerMgmService } from '../../../../../../main/webapp/app/entities/answer-mgm/answer-mgm.service';
import { AnswerMgm } from '../../../../../../main/webapp/app/entities/answer-mgm/answer-mgm.model';

describe('Component Tests', () => {

    describe('AnswerMgm Management Detail Component', () => {
        let comp: AnswerMgmDetailComponent;
        let fixture: ComponentFixture<AnswerMgmDetailComponent>;
        let service: AnswerMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [AnswerMgmDetailComponent],
                providers: [
                    AnswerMgmService
                ]
            })
            .overrideTemplate(AnswerMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(AnswerMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AnswerMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new AnswerMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.answer).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
