/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { DataImpactDescriptionMgmDetailComponent } from '../../../../../../main/webapp/app/entities/data-impact-description-mgm/data-impact-description-mgm-detail.component';
import { DataImpactDescriptionMgmService } from '../../../../../../main/webapp/app/entities/data-impact-description-mgm/data-impact-description-mgm.service';
import { DataImpactDescriptionMgm } from '../../../../../../main/webapp/app/entities/data-impact-description-mgm/data-impact-description-mgm.model';

describe('Component Tests', () => {

    describe('DataImpactDescriptionMgm Management Detail Component', () => {
        let comp: DataImpactDescriptionMgmDetailComponent;
        let fixture: ComponentFixture<DataImpactDescriptionMgmDetailComponent>;
        let service: DataImpactDescriptionMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [DataImpactDescriptionMgmDetailComponent],
                providers: [
                    DataImpactDescriptionMgmService
                ]
            })
            .overrideTemplate(DataImpactDescriptionMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DataImpactDescriptionMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DataImpactDescriptionMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new DataImpactDescriptionMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.dataImpactDescription).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
