/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { DataRiskLevelConfigMgmComponent } from '../../../../../../main/webapp/app/entities/data-risk-level-config-mgm/data-risk-level-config-mgm.component';
import { DataRiskLevelConfigMgmService } from '../../../../../../main/webapp/app/entities/data-risk-level-config-mgm/data-risk-level-config-mgm.service';
import { DataRiskLevelConfigMgm } from '../../../../../../main/webapp/app/entities/data-risk-level-config-mgm/data-risk-level-config-mgm.model';

describe('Component Tests', () => {

    describe('DataRiskLevelConfigMgm Management Component', () => {
        let comp: DataRiskLevelConfigMgmComponent;
        let fixture: ComponentFixture<DataRiskLevelConfigMgmComponent>;
        let service: DataRiskLevelConfigMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [DataRiskLevelConfigMgmComponent],
                providers: [
                    DataRiskLevelConfigMgmService
                ]
            })
            .overrideTemplate(DataRiskLevelConfigMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DataRiskLevelConfigMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DataRiskLevelConfigMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new DataRiskLevelConfigMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.dataRiskLevelConfigs[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
