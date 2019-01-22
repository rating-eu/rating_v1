/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { AttackCostParamMgmComponent } from '../../../../../../main/webapp/app/entities/attack-cost-param-mgm/attack-cost-param-mgm.component';
import { AttackCostParamMgmService } from '../../../../../../main/webapp/app/entities/attack-cost-param-mgm/attack-cost-param-mgm.service';
import { AttackCostParamMgm } from '../../../../../../main/webapp/app/entities/attack-cost-param-mgm/attack-cost-param-mgm.model';

describe('Component Tests', () => {

    describe('AttackCostParamMgm Management Component', () => {
        let comp: AttackCostParamMgmComponent;
        let fixture: ComponentFixture<AttackCostParamMgmComponent>;
        let service: AttackCostParamMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [AttackCostParamMgmComponent],
                providers: [
                    AttackCostParamMgmService
                ]
            })
            .overrideTemplate(AttackCostParamMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(AttackCostParamMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AttackCostParamMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new AttackCostParamMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.attackCostParams[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
