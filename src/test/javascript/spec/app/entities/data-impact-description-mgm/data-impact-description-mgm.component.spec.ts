/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { DataImpactDescriptionMgmComponent } from '../../../../../../main/webapp/app/entities/data-impact-description-mgm/data-impact-description-mgm.component';
import { DataImpactDescriptionMgmService } from '../../../../../../main/webapp/app/entities/data-impact-description-mgm/data-impact-description-mgm.service';
import { DataImpactDescriptionMgm } from '../../../../../../main/webapp/app/entities/data-impact-description-mgm/data-impact-description-mgm.model';

describe('Component Tests', () => {

    describe('DataImpactDescriptionMgm Management Component', () => {
        let comp: DataImpactDescriptionMgmComponent;
        let fixture: ComponentFixture<DataImpactDescriptionMgmComponent>;
        let service: DataImpactDescriptionMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [DataImpactDescriptionMgmComponent],
                providers: [
                    DataImpactDescriptionMgmService
                ]
            })
            .overrideTemplate(DataImpactDescriptionMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DataImpactDescriptionMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DataImpactDescriptionMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new DataImpactDescriptionMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.dataImpactDescriptions[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
