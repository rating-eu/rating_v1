/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { GDPRAnswerMgmComponent } from '../../../../../../main/webapp/app/entities/gdpr-answer-mgm/gdpr-answer-mgm.component';
import { GDPRAnswerMgmService } from '../../../../../../main/webapp/app/entities/gdpr-answer-mgm/gdpr-answer-mgm.service';
import { GDPRAnswerMgm } from '../../../../../../main/webapp/app/entities/gdpr-answer-mgm/gdpr-answer-mgm.model';

describe('Component Tests', () => {

    describe('GDPRAnswerMgm Management Component', () => {
        let comp: GDPRAnswerMgmComponent;
        let fixture: ComponentFixture<GDPRAnswerMgmComponent>;
        let service: GDPRAnswerMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [GDPRAnswerMgmComponent],
                providers: [
                    GDPRAnswerMgmService
                ]
            })
            .overrideTemplate(GDPRAnswerMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(GDPRAnswerMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(GDPRAnswerMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new GDPRAnswerMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.gDPRAnswers[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
