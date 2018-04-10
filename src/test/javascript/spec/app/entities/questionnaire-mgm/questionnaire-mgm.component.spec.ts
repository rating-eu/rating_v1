/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { QuestionnaireMgmComponent } from '../../../../../../main/webapp/app/entities/questionnaire-mgm/questionnaire-mgm.component';
import { QuestionnaireMgmService } from '../../../../../../main/webapp/app/entities/questionnaire-mgm/questionnaire-mgm.service';
import { QuestionnaireMgm } from '../../../../../../main/webapp/app/entities/questionnaire-mgm/questionnaire-mgm.model';

describe('Component Tests', () => {

    describe('QuestionnaireMgm Management Component', () => {
        let comp: QuestionnaireMgmComponent;
        let fixture: ComponentFixture<QuestionnaireMgmComponent>;
        let service: QuestionnaireMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [QuestionnaireMgmComponent],
                providers: [
                    QuestionnaireMgmService
                ]
            })
            .overrideTemplate(QuestionnaireMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(QuestionnaireMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(QuestionnaireMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new QuestionnaireMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.questionnaires[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
