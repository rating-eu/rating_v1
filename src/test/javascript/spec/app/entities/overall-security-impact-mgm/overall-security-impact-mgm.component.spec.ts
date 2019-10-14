/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { OverallSecurityImpactMgmComponent } from '../../../../../../main/webapp/app/entities/overall-security-impact-mgm/overall-security-impact-mgm.component';
import { OverallSecurityImpactMgmService } from '../../../../../../main/webapp/app/entities/overall-security-impact-mgm/overall-security-impact-mgm.service';
import { OverallSecurityImpactMgm } from '../../../../../../main/webapp/app/entities/overall-security-impact-mgm/overall-security-impact-mgm.model';

describe('Component Tests', () => {

    describe('OverallSecurityImpactMgm Management Component', () => {
        let comp: OverallSecurityImpactMgmComponent;
        let fixture: ComponentFixture<OverallSecurityImpactMgmComponent>;
        let service: OverallSecurityImpactMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [OverallSecurityImpactMgmComponent],
                providers: [
                    OverallSecurityImpactMgmService
                ]
            })
            .overrideTemplate(OverallSecurityImpactMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(OverallSecurityImpactMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OverallSecurityImpactMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new OverallSecurityImpactMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.overallSecurityImpacts[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
