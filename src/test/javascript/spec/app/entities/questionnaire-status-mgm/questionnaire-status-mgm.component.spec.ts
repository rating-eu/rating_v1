/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { QuestionnaireStatusMgmComponent } from '../../../../../../main/webapp/app/entities/questionnaire-status-mgm/questionnaire-status-mgm.component';
import { QuestionnaireStatusMgmService } from '../../../../../../main/webapp/app/entities/questionnaire-status-mgm/questionnaire-status-mgm.service';
import { QuestionnaireStatusMgm } from '../../../../../../main/webapp/app/entities/questionnaire-status-mgm/questionnaire-status-mgm.model';

describe('Component Tests', () => {

    describe('QuestionnaireStatusMgm Management Component', () => {
        let comp: QuestionnaireStatusMgmComponent;
        let fixture: ComponentFixture<QuestionnaireStatusMgmComponent>;
        let service: QuestionnaireStatusMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [QuestionnaireStatusMgmComponent],
                providers: [
                    QuestionnaireStatusMgmService
                ]
            })
            .overrideTemplate(QuestionnaireStatusMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(QuestionnaireStatusMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(QuestionnaireStatusMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new QuestionnaireStatusMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.questionnaireStatuses[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
