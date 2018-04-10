/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { MotivationMgmComponent } from '../../../../../../main/webapp/app/entities/motivation-mgm/motivation-mgm.component';
import { MotivationMgmService } from '../../../../../../main/webapp/app/entities/motivation-mgm/motivation-mgm.service';
import { MotivationMgm } from '../../../../../../main/webapp/app/entities/motivation-mgm/motivation-mgm.model';

describe('Component Tests', () => {

    describe('MotivationMgm Management Component', () => {
        let comp: MotivationMgmComponent;
        let fixture: ComponentFixture<MotivationMgmComponent>;
        let service: MotivationMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [MotivationMgmComponent],
                providers: [
                    MotivationMgmService
                ]
            })
            .overrideTemplate(MotivationMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(MotivationMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MotivationMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new MotivationMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.motivations[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
