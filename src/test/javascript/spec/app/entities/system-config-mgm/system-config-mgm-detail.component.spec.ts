/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { SystemConfigMgmDetailComponent } from '../../../../../../main/webapp/app/entities/system-config-mgm/system-config-mgm-detail.component';
import { SystemConfigMgmService } from '../../../../../../main/webapp/app/entities/system-config-mgm/system-config-mgm.service';
import { SystemConfigMgm } from '../../../../../../main/webapp/app/entities/system-config-mgm/system-config-mgm.model';

describe('Component Tests', () => {

    describe('SystemConfigMgm Management Detail Component', () => {
        let comp: SystemConfigMgmDetailComponent;
        let fixture: ComponentFixture<SystemConfigMgmDetailComponent>;
        let service: SystemConfigMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [SystemConfigMgmDetailComponent],
                providers: [
                    SystemConfigMgmService
                ]
            })
            .overrideTemplate(SystemConfigMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SystemConfigMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SystemConfigMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new SystemConfigMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.systemConfig).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
