/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { AttackCostParamMgmDetailComponent } from '../../../../../../main/webapp/app/entities/attack-cost-param-mgm/attack-cost-param-mgm-detail.component';
import { AttackCostParamMgmService } from '../../../../../../main/webapp/app/entities/attack-cost-param-mgm/attack-cost-param-mgm.service';
import { AttackCostParamMgm } from '../../../../../../main/webapp/app/entities/attack-cost-param-mgm/attack-cost-param-mgm.model';

describe('Component Tests', () => {

    describe('AttackCostParamMgm Management Detail Component', () => {
        let comp: AttackCostParamMgmDetailComponent;
        let fixture: ComponentFixture<AttackCostParamMgmDetailComponent>;
        let service: AttackCostParamMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [AttackCostParamMgmDetailComponent],
                providers: [
                    AttackCostParamMgmService
                ]
            })
            .overrideTemplate(AttackCostParamMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(AttackCostParamMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AttackCostParamMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new AttackCostParamMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.attackCostParam).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
