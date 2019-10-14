/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { GDPRAnswerMgmDetailComponent } from '../../../../../../main/webapp/app/entities/gdpr-answer-mgm/gdpr-answer-mgm-detail.component';
import { GDPRAnswerMgmService } from '../../../../../../main/webapp/app/entities/gdpr-answer-mgm/gdpr-answer-mgm.service';
import { GDPRAnswerMgm } from '../../../../../../main/webapp/app/entities/gdpr-answer-mgm/gdpr-answer-mgm.model';

describe('Component Tests', () => {

    describe('GDPRAnswerMgm Management Detail Component', () => {
        let comp: GDPRAnswerMgmDetailComponent;
        let fixture: ComponentFixture<GDPRAnswerMgmDetailComponent>;
        let service: GDPRAnswerMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [GDPRAnswerMgmDetailComponent],
                providers: [
                    GDPRAnswerMgmService
                ]
            })
            .overrideTemplate(GDPRAnswerMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(GDPRAnswerMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(GDPRAnswerMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new GDPRAnswerMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.gDPRAnswer).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
