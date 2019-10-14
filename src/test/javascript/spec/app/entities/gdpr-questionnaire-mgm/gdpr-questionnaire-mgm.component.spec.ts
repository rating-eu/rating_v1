/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { GDPRQuestionnaireMgmComponent } from '../../../../../../main/webapp/app/entities/gdpr-questionnaire-mgm/gdpr-questionnaire-mgm.component';
import { GDPRQuestionnaireMgmService } from '../../../../../../main/webapp/app/entities/gdpr-questionnaire-mgm/gdpr-questionnaire-mgm.service';
import { GDPRQuestionnaireMgm } from '../../../../../../main/webapp/app/entities/gdpr-questionnaire-mgm/gdpr-questionnaire-mgm.model';

describe('Component Tests', () => {

    describe('GDPRQuestionnaireMgm Management Component', () => {
        let comp: GDPRQuestionnaireMgmComponent;
        let fixture: ComponentFixture<GDPRQuestionnaireMgmComponent>;
        let service: GDPRQuestionnaireMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [GDPRQuestionnaireMgmComponent],
                providers: [
                    GDPRQuestionnaireMgmService
                ]
            })
            .overrideTemplate(GDPRQuestionnaireMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(GDPRQuestionnaireMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(GDPRQuestionnaireMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new GDPRQuestionnaireMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.gDPRQuestionnaires[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
