/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { MitigationMgmComponent } from '../../../../../../main/webapp/app/entities/mitigation-mgm/mitigation-mgm.component';
import { MitigationMgmService } from '../../../../../../main/webapp/app/entities/mitigation-mgm/mitigation-mgm.service';
import { MitigationMgm } from '../../../../../../main/webapp/app/entities/mitigation-mgm/mitigation-mgm.model';

describe('Component Tests', () => {

    describe('MitigationMgm Management Component', () => {
        let comp: MitigationMgmComponent;
        let fixture: ComponentFixture<MitigationMgmComponent>;
        let service: MitigationMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [MitigationMgmComponent],
                providers: [
                    MitigationMgmService
                ]
            })
            .overrideTemplate(MitigationMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(MitigationMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MitigationMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new MitigationMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.mitigations[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
