/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { EBITMgmDetailComponent } from '../../../../../../main/webapp/app/entities/ebit-mgm/ebit-mgm-detail.component';
import { EBITMgmService } from '../../../../../../main/webapp/app/entities/ebit-mgm/ebit-mgm.service';
import { EBITMgm } from '../../../../../../main/webapp/app/entities/ebit-mgm/ebit-mgm.model';

describe('Component Tests', () => {

    describe('EBITMgm Management Detail Component', () => {
        let comp: EBITMgmDetailComponent;
        let fixture: ComponentFixture<EBITMgmDetailComponent>;
        let service: EBITMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [EBITMgmDetailComponent],
                providers: [
                    EBITMgmService
                ]
            })
            .overrideTemplate(EBITMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(EBITMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EBITMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new EBITMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.eBIT).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
