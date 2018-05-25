/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { PhaseMgmComponent } from '../../../../../../main/webapp/app/entities/phase-mgm/phase-mgm.component';
import { PhaseMgmService } from '../../../../../../main/webapp/app/entities/phase-mgm/phase-mgm.service';
import { PhaseMgm } from '../../../../../../main/webapp/app/entities/phase-mgm/phase-mgm.model';

describe('Component Tests', () => {

    describe('PhaseMgm Management Component', () => {
        let comp: PhaseMgmComponent;
        let fixture: ComponentFixture<PhaseMgmComponent>;
        let service: PhaseMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [PhaseMgmComponent],
                providers: [
                    PhaseMgmService
                ]
            })
            .overrideTemplate(PhaseMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PhaseMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PhaseMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new PhaseMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.phases[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
