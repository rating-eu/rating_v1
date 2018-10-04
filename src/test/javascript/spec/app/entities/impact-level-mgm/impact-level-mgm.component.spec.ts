/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { ImpactLevelMgmComponent } from '../../../../../../main/webapp/app/entities/impact-level-mgm/impact-level-mgm.component';
import { ImpactLevelMgmService } from '../../../../../../main/webapp/app/entities/impact-level-mgm/impact-level-mgm.service';
import { ImpactLevelMgm } from '../../../../../../main/webapp/app/entities/impact-level-mgm/impact-level-mgm.model';

describe('Component Tests', () => {

    describe('ImpactLevelMgm Management Component', () => {
        let comp: ImpactLevelMgmComponent;
        let fixture: ComponentFixture<ImpactLevelMgmComponent>;
        let service: ImpactLevelMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [ImpactLevelMgmComponent],
                providers: [
                    ImpactLevelMgmService
                ]
            })
            .overrideTemplate(ImpactLevelMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ImpactLevelMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ImpactLevelMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new ImpactLevelMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.impactLevels[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
