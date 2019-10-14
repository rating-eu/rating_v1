/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { DataOperationMgmDetailComponent } from '../../../../../../main/webapp/app/entities/data-operation-mgm/data-operation-mgm-detail.component';
import { DataOperationMgmService } from '../../../../../../main/webapp/app/entities/data-operation-mgm/data-operation-mgm.service';
import { DataOperationMgm } from '../../../../../../main/webapp/app/entities/data-operation-mgm/data-operation-mgm.model';

describe('Component Tests', () => {

    describe('DataOperationMgm Management Detail Component', () => {
        let comp: DataOperationMgmDetailComponent;
        let fixture: ComponentFixture<DataOperationMgmDetailComponent>;
        let service: DataOperationMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [DataOperationMgmDetailComponent],
                providers: [
                    DataOperationMgmService
                ]
            })
            .overrideTemplate(DataOperationMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DataOperationMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DataOperationMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new DataOperationMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.dataOperation).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
