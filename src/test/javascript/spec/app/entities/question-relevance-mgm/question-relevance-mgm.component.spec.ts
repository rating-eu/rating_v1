/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { QuestionRelevanceMgmComponent } from '../../../../../../main/webapp/app/entities/question-relevance-mgm/question-relevance-mgm.component';
import { QuestionRelevanceMgmService } from '../../../../../../main/webapp/app/entities/question-relevance-mgm/question-relevance-mgm.service';
import { QuestionRelevanceMgm } from '../../../../../../main/webapp/app/entities/question-relevance-mgm/question-relevance-mgm.model';

describe('Component Tests', () => {

    describe('QuestionRelevanceMgm Management Component', () => {
        let comp: QuestionRelevanceMgmComponent;
        let fixture: ComponentFixture<QuestionRelevanceMgmComponent>;
        let service: QuestionRelevanceMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [QuestionRelevanceMgmComponent],
                providers: [
                    QuestionRelevanceMgmService
                ]
            })
            .overrideTemplate(QuestionRelevanceMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(QuestionRelevanceMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(QuestionRelevanceMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new QuestionRelevanceMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.questionRelevances[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
