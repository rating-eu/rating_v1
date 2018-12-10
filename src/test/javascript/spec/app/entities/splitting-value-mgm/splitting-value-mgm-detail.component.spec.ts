/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { SplittingValueMgmDetailComponent } from '../../../../../../main/webapp/app/entities/splitting-value-mgm/splitting-value-mgm-detail.component';
import { SplittingValueMgmService } from '../../../../../../main/webapp/app/entities/splitting-value-mgm/splitting-value-mgm.service';
import { SplittingValueMgm } from '../../../../../../main/webapp/app/entities/splitting-value-mgm/splitting-value-mgm.model';

describe('Component Tests', () => {

    describe('SplittingValueMgm Management Detail Component', () => {
        let comp: SplittingValueMgmDetailComponent;
        let fixture: ComponentFixture<SplittingValueMgmDetailComponent>;
        let service: SplittingValueMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [SplittingValueMgmDetailComponent],
                providers: [
                    SplittingValueMgmService
                ]
            })
            .overrideTemplate(SplittingValueMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SplittingValueMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SplittingValueMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new SplittingValueMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.splittingValue).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});