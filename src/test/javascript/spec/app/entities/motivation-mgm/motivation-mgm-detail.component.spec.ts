/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { MotivationMgmDetailComponent } from '../../../../../../main/webapp/app/entities/motivation-mgm/motivation-mgm-detail.component';
import { MotivationMgmService } from '../../../../../../main/webapp/app/entities/motivation-mgm/motivation-mgm.service';
import { MotivationMgm } from '../../../../../../main/webapp/app/entities/motivation-mgm/motivation-mgm.model';

describe('Component Tests', () => {

    describe('MotivationMgm Management Detail Component', () => {
        let comp: MotivationMgmDetailComponent;
        let fixture: ComponentFixture<MotivationMgmDetailComponent>;
        let service: MotivationMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [MotivationMgmDetailComponent],
                providers: [
                    MotivationMgmService
                ]
            })
            .overrideTemplate(MotivationMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(MotivationMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MotivationMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new MotivationMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.motivation).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
