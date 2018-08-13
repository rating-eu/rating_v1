/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { SplittingLossMgmDetailComponent } from '../../../../../../main/webapp/app/entities/splitting-loss-mgm/splitting-loss-mgm-detail.component';
import { SplittingLossMgmService } from '../../../../../../main/webapp/app/entities/splitting-loss-mgm/splitting-loss-mgm.service';
import { SplittingLossMgm } from '../../../../../../main/webapp/app/entities/splitting-loss-mgm/splitting-loss-mgm.model';

describe('Component Tests', () => {

    describe('SplittingLossMgm Management Detail Component', () => {
        let comp: SplittingLossMgmDetailComponent;
        let fixture: ComponentFixture<SplittingLossMgmDetailComponent>;
        let service: SplittingLossMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [SplittingLossMgmDetailComponent],
                providers: [
                    SplittingLossMgmService
                ]
            })
            .overrideTemplate(SplittingLossMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SplittingLossMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SplittingLossMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new SplittingLossMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.splittingLoss).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
