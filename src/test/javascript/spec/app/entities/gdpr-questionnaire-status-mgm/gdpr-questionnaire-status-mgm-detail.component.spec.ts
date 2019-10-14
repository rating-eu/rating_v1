/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { GDPRQuestionnaireStatusMgmDetailComponent } from '../../../../../../main/webapp/app/entities/gdpr-questionnaire-status-mgm/gdpr-questionnaire-status-mgm-detail.component';
import { GDPRQuestionnaireStatusMgmService } from '../../../../../../main/webapp/app/entities/gdpr-questionnaire-status-mgm/gdpr-questionnaire-status-mgm.service';
import { GDPRQuestionnaireStatusMgm } from '../../../../../../main/webapp/app/entities/gdpr-questionnaire-status-mgm/gdpr-questionnaire-status-mgm.model';

describe('Component Tests', () => {

    describe('GDPRQuestionnaireStatusMgm Management Detail Component', () => {
        let comp: GDPRQuestionnaireStatusMgmDetailComponent;
        let fixture: ComponentFixture<GDPRQuestionnaireStatusMgmDetailComponent>;
        let service: GDPRQuestionnaireStatusMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [GDPRQuestionnaireStatusMgmDetailComponent],
                providers: [
                    GDPRQuestionnaireStatusMgmService
                ]
            })
            .overrideTemplate(GDPRQuestionnaireStatusMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(GDPRQuestionnaireStatusMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(GDPRQuestionnaireStatusMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new GDPRQuestionnaireStatusMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.gDPRQuestionnaireStatus).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
