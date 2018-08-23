/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { QuestionMgmComponent } from '../../../../../../main/webapp/app/entities/question-mgm/question-mgm.component';
import { QuestionMgmService } from '../../../../../../main/webapp/app/entities/question-mgm/question-mgm.service';
import { QuestionMgm } from '../../../../../../main/webapp/app/entities/question-mgm/question-mgm.model';

describe('Component Tests', () => {

    describe('QuestionMgm Management Component', () => {
        let comp: QuestionMgmComponent;
        let fixture: ComponentFixture<QuestionMgmComponent>;
        let service: QuestionMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [QuestionMgmComponent],
                providers: [
                    QuestionMgmService
                ]
            })
            .overrideTemplate(QuestionMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(QuestionMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(QuestionMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new QuestionMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.questions[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
