/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { DataOperationMgmComponent } from '../../../../../../main/webapp/app/entities/data-operation-mgm/data-operation-mgm.component';
import { DataOperationMgmService } from '../../../../../../main/webapp/app/entities/data-operation-mgm/data-operation-mgm.service';
import { DataOperationMgm } from '../../../../../../main/webapp/app/entities/data-operation-mgm/data-operation-mgm.model';

describe('Component Tests', () => {

    describe('DataOperationMgm Management Component', () => {
        let comp: DataOperationMgmComponent;
        let fixture: ComponentFixture<DataOperationMgmComponent>;
        let service: DataOperationMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [DataOperationMgmComponent],
                providers: [
                    DataOperationMgmService
                ]
            })
            .overrideTemplate(DataOperationMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DataOperationMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DataOperationMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new DataOperationMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.dataOperations[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
