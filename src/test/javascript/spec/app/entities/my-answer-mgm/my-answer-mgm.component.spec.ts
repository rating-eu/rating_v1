/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { MyAnswerMgmComponent } from '../../../../../../main/webapp/app/entities/my-answer-mgm/my-answer-mgm.component';
import { MyAnswerMgmService } from '../../../../../../main/webapp/app/entities/my-answer-mgm/my-answer-mgm.service';
import { MyAnswerMgm } from '../../../../../../main/webapp/app/entities/my-answer-mgm/my-answer-mgm.model';

describe('Component Tests', () => {

    describe('MyAnswerMgm Management Component', () => {
        let comp: MyAnswerMgmComponent;
        let fixture: ComponentFixture<MyAnswerMgmComponent>;
        let service: MyAnswerMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [MyAnswerMgmComponent],
                providers: [
                    MyAnswerMgmService
                ]
            })
            .overrideTemplate(MyAnswerMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(MyAnswerMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MyAnswerMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new MyAnswerMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.myAnswers[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
