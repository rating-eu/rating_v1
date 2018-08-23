/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { AttackStrategyMgmComponent } from '../../../../../../main/webapp/app/entities/attack-strategy-mgm/attack-strategy-mgm.component';
import { AttackStrategyMgmService } from '../../../../../../main/webapp/app/entities/attack-strategy-mgm/attack-strategy-mgm.service';
import { AttackStrategyMgm } from '../../../../../../main/webapp/app/entities/attack-strategy-mgm/attack-strategy-mgm.model';

describe('Component Tests', () => {

    describe('AttackStrategyMgm Management Component', () => {
        let comp: AttackStrategyMgmComponent;
        let fixture: ComponentFixture<AttackStrategyMgmComponent>;
        let service: AttackStrategyMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [AttackStrategyMgmComponent],
                providers: [
                    AttackStrategyMgmService
                ]
            })
            .overrideTemplate(AttackStrategyMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(AttackStrategyMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AttackStrategyMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new AttackStrategyMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.attackStrategies[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
