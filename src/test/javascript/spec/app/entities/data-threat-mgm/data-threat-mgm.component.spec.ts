/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { DataThreatMgmComponent } from '../../../../../../main/webapp/app/entities/data-threat-mgm/data-threat-mgm.component';
import { DataThreatMgmService } from '../../../../../../main/webapp/app/entities/data-threat-mgm/data-threat-mgm.service';
import { DataThreatMgm } from '../../../../../../main/webapp/app/entities/data-threat-mgm/data-threat-mgm.model';

describe('Component Tests', () => {

    describe('DataThreatMgm Management Component', () => {
        let comp: DataThreatMgmComponent;
        let fixture: ComponentFixture<DataThreatMgmComponent>;
        let service: DataThreatMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [DataThreatMgmComponent],
                providers: [
                    DataThreatMgmService
                ]
            })
            .overrideTemplate(DataThreatMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DataThreatMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DataThreatMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new DataThreatMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.dataThreats[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
