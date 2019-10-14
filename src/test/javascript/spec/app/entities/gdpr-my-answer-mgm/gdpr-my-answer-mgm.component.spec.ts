/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { GDPRMyAnswerMgmComponent } from '../../../../../../main/webapp/app/entities/gdpr-my-answer-mgm/gdpr-my-answer-mgm.component';
import { GDPRMyAnswerMgmService } from '../../../../../../main/webapp/app/entities/gdpr-my-answer-mgm/gdpr-my-answer-mgm.service';
import { GDPRMyAnswerMgm } from '../../../../../../main/webapp/app/entities/gdpr-my-answer-mgm/gdpr-my-answer-mgm.model';

describe('Component Tests', () => {

    describe('GDPRMyAnswerMgm Management Component', () => {
        let comp: GDPRMyAnswerMgmComponent;
        let fixture: ComponentFixture<GDPRMyAnswerMgmComponent>;
        let service: GDPRMyAnswerMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [GDPRMyAnswerMgmComponent],
                providers: [
                    GDPRMyAnswerMgmService
                ]
            })
            .overrideTemplate(GDPRMyAnswerMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(GDPRMyAnswerMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(GDPRMyAnswerMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new GDPRMyAnswerMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.gDPRMyAnswers[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
