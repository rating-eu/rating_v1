/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { GDPRMyAnswerMgmDetailComponent } from '../../../../../../main/webapp/app/entities/gdpr-my-answer-mgm/gdpr-my-answer-mgm-detail.component';
import { GDPRMyAnswerMgmService } from '../../../../../../main/webapp/app/entities/gdpr-my-answer-mgm/gdpr-my-answer-mgm.service';
import { GDPRMyAnswerMgm } from '../../../../../../main/webapp/app/entities/gdpr-my-answer-mgm/gdpr-my-answer-mgm.model';

describe('Component Tests', () => {

    describe('GDPRMyAnswerMgm Management Detail Component', () => {
        let comp: GDPRMyAnswerMgmDetailComponent;
        let fixture: ComponentFixture<GDPRMyAnswerMgmDetailComponent>;
        let service: GDPRMyAnswerMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [GDPRMyAnswerMgmDetailComponent],
                providers: [
                    GDPRMyAnswerMgmService
                ]
            })
            .overrideTemplate(GDPRMyAnswerMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(GDPRMyAnswerMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(GDPRMyAnswerMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new GDPRMyAnswerMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.gDPRMyAnswer).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
