/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { SplittingValueMgmComponent } from '../../../../../../main/webapp/app/entities/splitting-value-mgm/splitting-value-mgm.component';
import { SplittingValueMgmService } from '../../../../../../main/webapp/app/entities/splitting-value-mgm/splitting-value-mgm.service';
import { SplittingValueMgm } from '../../../../../../main/webapp/app/entities/splitting-value-mgm/splitting-value-mgm.model';

describe('Component Tests', () => {

    describe('SplittingValueMgm Management Component', () => {
        let comp: SplittingValueMgmComponent;
        let fixture: ComponentFixture<SplittingValueMgmComponent>;
        let service: SplittingValueMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [SplittingValueMgmComponent],
                providers: [
                    SplittingValueMgmService
                ]
            })
            .overrideTemplate(SplittingValueMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SplittingValueMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SplittingValueMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new SplittingValueMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.splittingValues[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
