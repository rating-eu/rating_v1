/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { OverallSecurityImpactMgmDetailComponent } from '../../../../../../main/webapp/app/entities/overall-security-impact-mgm/overall-security-impact-mgm-detail.component';
import { OverallSecurityImpactMgmService } from '../../../../../../main/webapp/app/entities/overall-security-impact-mgm/overall-security-impact-mgm.service';
import { OverallSecurityImpactMgm } from '../../../../../../main/webapp/app/entities/overall-security-impact-mgm/overall-security-impact-mgm.model';

describe('Component Tests', () => {

    describe('OverallSecurityImpactMgm Management Detail Component', () => {
        let comp: OverallSecurityImpactMgmDetailComponent;
        let fixture: ComponentFixture<OverallSecurityImpactMgmDetailComponent>;
        let service: OverallSecurityImpactMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [OverallSecurityImpactMgmDetailComponent],
                providers: [
                    OverallSecurityImpactMgmService
                ]
            })
            .overrideTemplate(OverallSecurityImpactMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(OverallSecurityImpactMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OverallSecurityImpactMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new OverallSecurityImpactMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.overallSecurityImpact).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
