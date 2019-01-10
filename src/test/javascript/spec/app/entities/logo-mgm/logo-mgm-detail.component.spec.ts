/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { LogoMgmDetailComponent } from '../../../../../../main/webapp/app/entities/logo-mgm/logo-mgm-detail.component';
import { LogoMgmService } from '../../../../../../main/webapp/app/entities/logo-mgm/logo-mgm.service';
import { LogoMgm } from '../../../../../../main/webapp/app/entities/logo-mgm/logo-mgm.model';

describe('Component Tests', () => {

    describe('LogoMgm Management Detail Component', () => {
        let comp: LogoMgmDetailComponent;
        let fixture: ComponentFixture<LogoMgmDetailComponent>;
        let service: LogoMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [LogoMgmDetailComponent],
                providers: [
                    LogoMgmService
                ]
            })
            .overrideTemplate(LogoMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LogoMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LogoMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new LogoMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.logo).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
