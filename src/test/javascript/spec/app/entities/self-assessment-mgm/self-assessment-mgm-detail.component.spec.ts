/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { SelfAssessmentMgmDetailComponent } from '../../../../../../main/webapp/app/entities/self-assessment-mgm/self-assessment-mgm-detail.component';
import { SelfAssessmentMgmService } from '../../../../../../main/webapp/app/entities/self-assessment-mgm/self-assessment-mgm.service';
import { SelfAssessmentMgm } from '../../../../../../main/webapp/app/entities/self-assessment-mgm/self-assessment-mgm.model';

describe('Component Tests', () => {

    describe('SelfAssessmentMgm Management Detail Component', () => {
        let comp: SelfAssessmentMgmDetailComponent;
        let fixture: ComponentFixture<SelfAssessmentMgmDetailComponent>;
        let service: SelfAssessmentMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [SelfAssessmentMgmDetailComponent],
                providers: [
                    SelfAssessmentMgmService
                ]
            })
            .overrideTemplate(SelfAssessmentMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SelfAssessmentMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SelfAssessmentMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new SelfAssessmentMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.selfAssessment).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
