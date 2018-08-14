/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { SplittingLossMgmComponent } from '../../../../../../main/webapp/app/entities/splitting-loss-mgm/splitting-loss-mgm.component';
import { SplittingLossMgmService } from '../../../../../../main/webapp/app/entities/splitting-loss-mgm/splitting-loss-mgm.service';
import { SplittingLossMgm } from '../../../../../../main/webapp/app/entities/splitting-loss-mgm/splitting-loss-mgm.model';

describe('Component Tests', () => {

    describe('SplittingLossMgm Management Component', () => {
        let comp: SplittingLossMgmComponent;
        let fixture: ComponentFixture<SplittingLossMgmComponent>;
        let service: SplittingLossMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [SplittingLossMgmComponent],
                providers: [
                    SplittingLossMgmService
                ]
            })
            .overrideTemplate(SplittingLossMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SplittingLossMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SplittingLossMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new SplittingLossMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.splittingLosses[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
