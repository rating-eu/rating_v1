/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { CriticalLevelMgmComponent } from '../../../../../../main/webapp/app/entities/critical-level-mgm/critical-level-mgm.component';
import { CriticalLevelMgmService } from '../../../../../../main/webapp/app/entities/critical-level-mgm/critical-level-mgm.service';
import { CriticalLevelMgm } from '../../../../../../main/webapp/app/entities/critical-level-mgm/critical-level-mgm.model';

describe('Component Tests', () => {

    describe('CriticalLevelMgm Management Component', () => {
        let comp: CriticalLevelMgmComponent;
        let fixture: ComponentFixture<CriticalLevelMgmComponent>;
        let service: CriticalLevelMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [CriticalLevelMgmComponent],
                providers: [
                    CriticalLevelMgmService
                ]
            })
            .overrideTemplate(CriticalLevelMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CriticalLevelMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CriticalLevelMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new CriticalLevelMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.criticalLevels[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
