/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { SecurityImpactMgmDetailComponent } from '../../../../../../main/webapp/app/entities/security-impact-mgm/security-impact-mgm-detail.component';
import { SecurityImpactMgmService } from '../../../../../../main/webapp/app/entities/security-impact-mgm/security-impact-mgm.service';
import { SecurityImpactMgm } from '../../../../../../main/webapp/app/entities/security-impact-mgm/security-impact-mgm.model';

describe('Component Tests', () => {

    describe('SecurityImpactMgm Management Detail Component', () => {
        let comp: SecurityImpactMgmDetailComponent;
        let fixture: ComponentFixture<SecurityImpactMgmDetailComponent>;
        let service: SecurityImpactMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [SecurityImpactMgmDetailComponent],
                providers: [
                    SecurityImpactMgmService
                ]
            })
            .overrideTemplate(SecurityImpactMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SecurityImpactMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SecurityImpactMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new SecurityImpactMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.securityImpact).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
