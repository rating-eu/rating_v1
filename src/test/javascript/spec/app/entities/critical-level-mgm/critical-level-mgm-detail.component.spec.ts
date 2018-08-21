/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { CriticalLevelMgmDetailComponent } from '../../../../../../main/webapp/app/entities/critical-level-mgm/critical-level-mgm-detail.component';
import { CriticalLevelMgmService } from '../../../../../../main/webapp/app/entities/critical-level-mgm/critical-level-mgm.service';
import { CriticalLevelMgm } from '../../../../../../main/webapp/app/entities/critical-level-mgm/critical-level-mgm.model';

describe('Component Tests', () => {

    describe('CriticalLevelMgm Management Detail Component', () => {
        let comp: CriticalLevelMgmDetailComponent;
        let fixture: ComponentFixture<CriticalLevelMgmDetailComponent>;
        let service: CriticalLevelMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [CriticalLevelMgmDetailComponent],
                providers: [
                    CriticalLevelMgmService
                ]
            })
            .overrideTemplate(CriticalLevelMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CriticalLevelMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CriticalLevelMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new CriticalLevelMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.criticalLevel).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
