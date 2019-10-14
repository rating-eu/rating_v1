/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { GDPRQuestionnaireMgmDetailComponent } from '../../../../../../main/webapp/app/entities/gdpr-questionnaire-mgm/gdpr-questionnaire-mgm-detail.component';
import { GDPRQuestionnaireMgmService } from '../../../../../../main/webapp/app/entities/gdpr-questionnaire-mgm/gdpr-questionnaire-mgm.service';
import { GDPRQuestionnaireMgm } from '../../../../../../main/webapp/app/entities/gdpr-questionnaire-mgm/gdpr-questionnaire-mgm.model';

describe('Component Tests', () => {

    describe('GDPRQuestionnaireMgm Management Detail Component', () => {
        let comp: GDPRQuestionnaireMgmDetailComponent;
        let fixture: ComponentFixture<GDPRQuestionnaireMgmDetailComponent>;
        let service: GDPRQuestionnaireMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [GDPRQuestionnaireMgmDetailComponent],
                providers: [
                    GDPRQuestionnaireMgmService
                ]
            })
            .overrideTemplate(GDPRQuestionnaireMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(GDPRQuestionnaireMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(GDPRQuestionnaireMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new GDPRQuestionnaireMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.gDPRQuestionnaire).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
