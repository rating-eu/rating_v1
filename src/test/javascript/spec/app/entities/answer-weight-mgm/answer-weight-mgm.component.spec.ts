/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { AnswerWeightMgmComponent } from '../../../../../../main/webapp/app/entities/answer-weight-mgm/answer-weight-mgm.component';
import { AnswerWeightMgmService } from '../../../../../../main/webapp/app/entities/answer-weight-mgm/answer-weight-mgm.service';
import { AnswerWeightMgm } from '../../../../../../main/webapp/app/entities/answer-weight-mgm/answer-weight-mgm.model';

describe('Component Tests', () => {

    describe('AnswerWeightMgm Management Component', () => {
        let comp: AnswerWeightMgmComponent;
        let fixture: ComponentFixture<AnswerWeightMgmComponent>;
        let service: AnswerWeightMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [AnswerWeightMgmComponent],
                providers: [
                    AnswerWeightMgmService
                ]
            })
            .overrideTemplate(AnswerWeightMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(AnswerWeightMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AnswerWeightMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new AnswerWeightMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.answerWeights[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
