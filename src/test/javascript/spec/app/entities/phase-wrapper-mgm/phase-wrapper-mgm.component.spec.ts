/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { PhaseWrapperMgmComponent } from '../../../../../../main/webapp/app/entities/phase-wrapper-mgm/phase-wrapper-mgm.component';
import { PhaseWrapperMgmService } from '../../../../../../main/webapp/app/entities/phase-wrapper-mgm/phase-wrapper-mgm.service';
import { PhaseWrapperMgm } from '../../../../../../main/webapp/app/entities/phase-wrapper-mgm/phase-wrapper-mgm.model';

describe('Component Tests', () => {

    describe('PhaseWrapperMgm Management Component', () => {
        let comp: PhaseWrapperMgmComponent;
        let fixture: ComponentFixture<PhaseWrapperMgmComponent>;
        let service: PhaseWrapperMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [PhaseWrapperMgmComponent],
                providers: [
                    PhaseWrapperMgmService
                ]
            })
            .overrideTemplate(PhaseWrapperMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PhaseWrapperMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PhaseWrapperMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new PhaseWrapperMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.phaseWrappers[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
