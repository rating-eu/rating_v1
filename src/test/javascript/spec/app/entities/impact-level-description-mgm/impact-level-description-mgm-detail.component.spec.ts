/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { ImpactLevelDescriptionMgmDetailComponent } from '../../../../../../main/webapp/app/entities/impact-level-description-mgm/impact-level-description-mgm-detail.component';
import { ImpactLevelDescriptionMgmService } from '../../../../../../main/webapp/app/entities/impact-level-description-mgm/impact-level-description-mgm.service';
import { ImpactLevelDescriptionMgm } from '../../../../../../main/webapp/app/entities/impact-level-description-mgm/impact-level-description-mgm.model';

describe('Component Tests', () => {

    describe('ImpactLevelDescriptionMgm Management Detail Component', () => {
        let comp: ImpactLevelDescriptionMgmDetailComponent;
        let fixture: ComponentFixture<ImpactLevelDescriptionMgmDetailComponent>;
        let service: ImpactLevelDescriptionMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [ImpactLevelDescriptionMgmDetailComponent],
                providers: [
                    ImpactLevelDescriptionMgmService
                ]
            })
            .overrideTemplate(ImpactLevelDescriptionMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ImpactLevelDescriptionMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ImpactLevelDescriptionMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new ImpactLevelDescriptionMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.impactLevelDescription).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
