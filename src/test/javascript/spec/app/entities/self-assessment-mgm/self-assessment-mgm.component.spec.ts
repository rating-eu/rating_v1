/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { SelfAssessmentMgmComponent } from '../../../../../../main/webapp/app/entities/self-assessment-mgm/self-assessment-mgm.component';
import { SelfAssessmentMgmService } from '../../../../../../main/webapp/app/entities/self-assessment-mgm/self-assessment-mgm.service';
import { SelfAssessmentMgm } from '../../../../../../main/webapp/app/entities/self-assessment-mgm/self-assessment-mgm.model';

describe('Component Tests', () => {

    describe('SelfAssessmentMgm Management Component', () => {
        let comp: SelfAssessmentMgmComponent;
        let fixture: ComponentFixture<SelfAssessmentMgmComponent>;
        let service: SelfAssessmentMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [SelfAssessmentMgmComponent],
                providers: [
                    SelfAssessmentMgmService
                ]
            })
            .overrideTemplate(SelfAssessmentMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SelfAssessmentMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SelfAssessmentMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new SelfAssessmentMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.selfAssessments[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
