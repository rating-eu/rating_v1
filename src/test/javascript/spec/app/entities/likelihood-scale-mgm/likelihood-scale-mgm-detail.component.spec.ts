/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { LikelihoodScaleMgmDetailComponent } from '../../../../../../main/webapp/app/entities/likelihood-scale-mgm/likelihood-scale-mgm-detail.component';
import { LikelihoodScaleMgmService } from '../../../../../../main/webapp/app/entities/likelihood-scale-mgm/likelihood-scale-mgm.service';
import { LikelihoodScaleMgm } from '../../../../../../main/webapp/app/entities/likelihood-scale-mgm/likelihood-scale-mgm.model';

describe('Component Tests', () => {

    describe('LikelihoodScaleMgm Management Detail Component', () => {
        let comp: LikelihoodScaleMgmDetailComponent;
        let fixture: ComponentFixture<LikelihoodScaleMgmDetailComponent>;
        let service: LikelihoodScaleMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [LikelihoodScaleMgmDetailComponent],
                providers: [
                    LikelihoodScaleMgmService
                ]
            })
            .overrideTemplate(LikelihoodScaleMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LikelihoodScaleMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LikelihoodScaleMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new LikelihoodScaleMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.likelihoodScale).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
