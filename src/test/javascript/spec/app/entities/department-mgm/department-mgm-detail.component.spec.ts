/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { DepartmentMgmDetailComponent } from '../../../../../../main/webapp/app/entities/department-mgm/department-mgm-detail.component';
import { DepartmentMgmService } from '../../../../../../main/webapp/app/entities/department-mgm/department-mgm.service';
import { DepartmentMgm } from '../../../../../../main/webapp/app/entities/department-mgm/department-mgm.model';

describe('Component Tests', () => {

    describe('DepartmentMgm Management Detail Component', () => {
        let comp: DepartmentMgmDetailComponent;
        let fixture: ComponentFixture<DepartmentMgmDetailComponent>;
        let service: DepartmentMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [DepartmentMgmDetailComponent],
                providers: [
                    DepartmentMgmService
                ]
            })
            .overrideTemplate(DepartmentMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DepartmentMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DepartmentMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new DepartmentMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.department).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
