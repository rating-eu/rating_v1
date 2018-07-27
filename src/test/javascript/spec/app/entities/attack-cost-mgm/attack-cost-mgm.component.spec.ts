/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { AttackCostMgmComponent } from '../../../../../../main/webapp/app/entities/attack-cost-mgm/attack-cost-mgm.component';
import { AttackCostMgmService } from '../../../../../../main/webapp/app/entities/attack-cost-mgm/attack-cost-mgm.service';
import { AttackCostMgm } from '../../../../../../main/webapp/app/entities/attack-cost-mgm/attack-cost-mgm.model';

describe('Component Tests', () => {

    describe('AttackCostMgm Management Component', () => {
        let comp: AttackCostMgmComponent;
        let fixture: ComponentFixture<AttackCostMgmComponent>;
        let service: AttackCostMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [AttackCostMgmComponent],
                providers: [
                    AttackCostMgmService
                ]
            })
            .overrideTemplate(AttackCostMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(AttackCostMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AttackCostMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new AttackCostMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.attackCosts[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
