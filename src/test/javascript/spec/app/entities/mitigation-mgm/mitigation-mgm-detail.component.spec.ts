/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { MitigationMgmDetailComponent } from '../../../../../../main/webapp/app/entities/mitigation-mgm/mitigation-mgm-detail.component';
import { MitigationMgmService } from '../../../../../../main/webapp/app/entities/mitigation-mgm/mitigation-mgm.service';
import { MitigationMgm } from '../../../../../../main/webapp/app/entities/mitigation-mgm/mitigation-mgm.model';

describe('Component Tests', () => {

    describe('MitigationMgm Management Detail Component', () => {
        let comp: MitigationMgmDetailComponent;
        let fixture: ComponentFixture<MitigationMgmDetailComponent>;
        let service: MitigationMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [MitigationMgmDetailComponent],
                providers: [
                    MitigationMgmService
                ]
            })
            .overrideTemplate(MitigationMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(MitigationMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MitigationMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new MitigationMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.mitigation).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
