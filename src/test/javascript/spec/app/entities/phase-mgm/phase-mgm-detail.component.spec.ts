/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { PhaseMgmDetailComponent } from '../../../../../../main/webapp/app/entities/phase-mgm/phase-mgm-detail.component';
import { PhaseMgmService } from '../../../../../../main/webapp/app/entities/phase-mgm/phase-mgm.service';
import { PhaseMgm } from '../../../../../../main/webapp/app/entities/phase-mgm/phase-mgm.model';

describe('Component Tests', () => {

    describe('PhaseMgm Management Detail Component', () => {
        let comp: PhaseMgmDetailComponent;
        let fixture: ComponentFixture<PhaseMgmDetailComponent>;
        let service: PhaseMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [PhaseMgmDetailComponent],
                providers: [
                    PhaseMgmService
                ]
            })
            .overrideTemplate(PhaseMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PhaseMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PhaseMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new PhaseMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.phase).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
