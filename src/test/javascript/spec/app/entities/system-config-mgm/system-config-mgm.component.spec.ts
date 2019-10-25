/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { SystemConfigMgmComponent } from '../../../../../../main/webapp/app/entities/system-config-mgm/system-config-mgm.component';
import { SystemConfigMgmService } from '../../../../../../main/webapp/app/entities/system-config-mgm/system-config-mgm.service';
import { SystemConfigMgm } from '../../../../../../main/webapp/app/entities/system-config-mgm/system-config-mgm.model';

describe('Component Tests', () => {

    describe('SystemConfigMgm Management Component', () => {
        let comp: SystemConfigMgmComponent;
        let fixture: ComponentFixture<SystemConfigMgmComponent>;
        let service: SystemConfigMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [SystemConfigMgmComponent],
                providers: [
                    SystemConfigMgmService
                ]
            })
            .overrideTemplate(SystemConfigMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SystemConfigMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SystemConfigMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new SystemConfigMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.systemConfigs[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
