/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { GDPRQuestionnaireStatusMgmComponent } from '../../../../../../main/webapp/app/entities/gdpr-questionnaire-status-mgm/gdpr-questionnaire-status-mgm.component';
import { GDPRQuestionnaireStatusMgmService } from '../../../../../../main/webapp/app/entities/gdpr-questionnaire-status-mgm/gdpr-questionnaire-status-mgm.service';
import { GDPRQuestionnaireStatusMgm } from '../../../../../../main/webapp/app/entities/gdpr-questionnaire-status-mgm/gdpr-questionnaire-status-mgm.model';

describe('Component Tests', () => {

    describe('GDPRQuestionnaireStatusMgm Management Component', () => {
        let comp: GDPRQuestionnaireStatusMgmComponent;
        let fixture: ComponentFixture<GDPRQuestionnaireStatusMgmComponent>;
        let service: GDPRQuestionnaireStatusMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [GDPRQuestionnaireStatusMgmComponent],
                providers: [
                    GDPRQuestionnaireStatusMgmService
                ]
            })
            .overrideTemplate(GDPRQuestionnaireStatusMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(GDPRQuestionnaireStatusMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(GDPRQuestionnaireStatusMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new GDPRQuestionnaireStatusMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.gDPRQuestionnaireStatuses[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
