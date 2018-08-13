/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { EBITMgmComponent } from '../../../../../../main/webapp/app/entities/ebit-mgm/ebit-mgm.component';
import { EBITMgmService } from '../../../../../../main/webapp/app/entities/ebit-mgm/ebit-mgm.service';
import { EBITMgm } from '../../../../../../main/webapp/app/entities/ebit-mgm/ebit-mgm.model';

describe('Component Tests', () => {

    describe('EBITMgm Management Component', () => {
        let comp: EBITMgmComponent;
        let fixture: ComponentFixture<EBITMgmComponent>;
        let service: EBITMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [EBITMgmComponent],
                providers: [
                    EBITMgmService
                ]
            })
            .overrideTemplate(EBITMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(EBITMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EBITMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new EBITMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.eBITS[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
