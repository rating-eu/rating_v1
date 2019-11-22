/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { QuestionRelevanceMgmDetailComponent } from '../../../../../../main/webapp/app/entities/question-relevance-mgm/question-relevance-mgm-detail.component';
import { QuestionRelevanceMgmService } from '../../../../../../main/webapp/app/entities/question-relevance-mgm/question-relevance-mgm.service';
import { QuestionRelevanceMgm } from '../../../../../../main/webapp/app/entities/question-relevance-mgm/question-relevance-mgm.model';

describe('Component Tests', () => {

    describe('QuestionRelevanceMgm Management Detail Component', () => {
        let comp: QuestionRelevanceMgmDetailComponent;
        let fixture: ComponentFixture<QuestionRelevanceMgmDetailComponent>;
        let service: QuestionRelevanceMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [QuestionRelevanceMgmDetailComponent],
                providers: [
                    QuestionRelevanceMgmService
                ]
            })
            .overrideTemplate(QuestionRelevanceMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(QuestionRelevanceMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(QuestionRelevanceMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new QuestionRelevanceMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.questionRelevance).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
