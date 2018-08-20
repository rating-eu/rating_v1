/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { LikelihoodScaleMgmComponent } from '../../../../../../main/webapp/app/entities/likelihood-scale-mgm/likelihood-scale-mgm.component';
import { LikelihoodScaleMgmService } from '../../../../../../main/webapp/app/entities/likelihood-scale-mgm/likelihood-scale-mgm.service';
import { LikelihoodScaleMgm } from '../../../../../../main/webapp/app/entities/likelihood-scale-mgm/likelihood-scale-mgm.model';

describe('Component Tests', () => {

    describe('LikelihoodScaleMgm Management Component', () => {
        let comp: LikelihoodScaleMgmComponent;
        let fixture: ComponentFixture<LikelihoodScaleMgmComponent>;
        let service: LikelihoodScaleMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [LikelihoodScaleMgmComponent],
                providers: [
                    LikelihoodScaleMgmService
                ]
            })
            .overrideTemplate(LikelihoodScaleMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LikelihoodScaleMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LikelihoodScaleMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new LikelihoodScaleMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.likelihoodScales[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
