/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { LikelihoodPositionMgmDetailComponent } from '../../../../../../main/webapp/app/entities/likelihood-position-mgm/likelihood-position-mgm-detail.component';
import { LikelihoodPositionMgmService } from '../../../../../../main/webapp/app/entities/likelihood-position-mgm/likelihood-position-mgm.service';
import { LikelihoodPositionMgm } from '../../../../../../main/webapp/app/entities/likelihood-position-mgm/likelihood-position-mgm.model';

describe('Component Tests', () => {

    describe('LikelihoodPositionMgm Management Detail Component', () => {
        let comp: LikelihoodPositionMgmDetailComponent;
        let fixture: ComponentFixture<LikelihoodPositionMgmDetailComponent>;
        let service: LikelihoodPositionMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [LikelihoodPositionMgmDetailComponent],
                providers: [
                    LikelihoodPositionMgmService
                ]
            })
            .overrideTemplate(LikelihoodPositionMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LikelihoodPositionMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LikelihoodPositionMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new LikelihoodPositionMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.likelihoodPosition).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
