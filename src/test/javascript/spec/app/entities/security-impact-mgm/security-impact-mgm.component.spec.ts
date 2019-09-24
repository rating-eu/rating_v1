/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { SecurityImpactMgmComponent } from '../../../../../../main/webapp/app/entities/security-impact-mgm/security-impact-mgm.component';
import { SecurityImpactMgmService } from '../../../../../../main/webapp/app/entities/security-impact-mgm/security-impact-mgm.service';
import { SecurityImpactMgm } from '../../../../../../main/webapp/app/entities/security-impact-mgm/security-impact-mgm.model';

describe('Component Tests', () => {

    describe('SecurityImpactMgm Management Component', () => {
        let comp: SecurityImpactMgmComponent;
        let fixture: ComponentFixture<SecurityImpactMgmComponent>;
        let service: SecurityImpactMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [SecurityImpactMgmComponent],
                providers: [
                    SecurityImpactMgmService
                ]
            })
            .overrideTemplate(SecurityImpactMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SecurityImpactMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SecurityImpactMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new SecurityImpactMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.securityImpacts[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
