/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { DataThreatMgmDetailComponent } from '../../../../../../main/webapp/app/entities/data-threat-mgm/data-threat-mgm-detail.component';
import { DataThreatMgmService } from '../../../../../../main/webapp/app/entities/data-threat-mgm/data-threat-mgm.service';
import { DataThreatMgm } from '../../../../../../main/webapp/app/entities/data-threat-mgm/data-threat-mgm.model';

describe('Component Tests', () => {

    describe('DataThreatMgm Management Detail Component', () => {
        let comp: DataThreatMgmDetailComponent;
        let fixture: ComponentFixture<DataThreatMgmDetailComponent>;
        let service: DataThreatMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [DataThreatMgmDetailComponent],
                providers: [
                    DataThreatMgmService
                ]
            })
            .overrideTemplate(DataThreatMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DataThreatMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DataThreatMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new DataThreatMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.dataThreat).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
