/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { LikelihoodPositionMgmComponent } from '../../../../../../main/webapp/app/entities/likelihood-position-mgm/likelihood-position-mgm.component';
import { LikelihoodPositionMgmService } from '../../../../../../main/webapp/app/entities/likelihood-position-mgm/likelihood-position-mgm.service';
import { LikelihoodPositionMgm } from '../../../../../../main/webapp/app/entities/likelihood-position-mgm/likelihood-position-mgm.model';

describe('Component Tests', () => {

    describe('LikelihoodPositionMgm Management Component', () => {
        let comp: LikelihoodPositionMgmComponent;
        let fixture: ComponentFixture<LikelihoodPositionMgmComponent>;
        let service: LikelihoodPositionMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [LikelihoodPositionMgmComponent],
                providers: [
                    LikelihoodPositionMgmService
                ]
            })
            .overrideTemplate(LikelihoodPositionMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LikelihoodPositionMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LikelihoodPositionMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new LikelihoodPositionMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.likelihoodPositions[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
