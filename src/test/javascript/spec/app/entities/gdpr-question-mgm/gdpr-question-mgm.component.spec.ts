/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { GDPRQuestionMgmComponent } from '../../../../../../main/webapp/app/entities/gdpr-question-mgm/gdpr-question-mgm.component';
import { GDPRQuestionMgmService } from '../../../../../../main/webapp/app/entities/gdpr-question-mgm/gdpr-question-mgm.service';
import { GDPRQuestionMgm } from '../../../../../../main/webapp/app/entities/gdpr-question-mgm/gdpr-question-mgm.model';

describe('Component Tests', () => {

    describe('GDPRQuestionMgm Management Component', () => {
        let comp: GDPRQuestionMgmComponent;
        let fixture: ComponentFixture<GDPRQuestionMgmComponent>;
        let service: GDPRQuestionMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [GDPRQuestionMgmComponent],
                providers: [
                    GDPRQuestionMgmService
                ]
            })
            .overrideTemplate(GDPRQuestionMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(GDPRQuestionMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(GDPRQuestionMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new GDPRQuestionMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.gDPRQuestions[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
