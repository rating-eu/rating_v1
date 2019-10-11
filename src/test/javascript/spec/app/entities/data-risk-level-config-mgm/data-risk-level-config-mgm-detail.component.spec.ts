/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { DataRiskLevelConfigMgmDetailComponent } from '../../../../../../main/webapp/app/entities/data-risk-level-config-mgm/data-risk-level-config-mgm-detail.component';
import { DataRiskLevelConfigMgmService } from '../../../../../../main/webapp/app/entities/data-risk-level-config-mgm/data-risk-level-config-mgm.service';
import { DataRiskLevelConfigMgm } from '../../../../../../main/webapp/app/entities/data-risk-level-config-mgm/data-risk-level-config-mgm.model';

describe('Component Tests', () => {

    describe('DataRiskLevelConfigMgm Management Detail Component', () => {
        let comp: DataRiskLevelConfigMgmDetailComponent;
        let fixture: ComponentFixture<DataRiskLevelConfigMgmDetailComponent>;
        let service: DataRiskLevelConfigMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [DataRiskLevelConfigMgmDetailComponent],
                providers: [
                    DataRiskLevelConfigMgmService
                ]
            })
            .overrideTemplate(DataRiskLevelConfigMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DataRiskLevelConfigMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DataRiskLevelConfigMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new DataRiskLevelConfigMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.dataRiskLevelConfig).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
