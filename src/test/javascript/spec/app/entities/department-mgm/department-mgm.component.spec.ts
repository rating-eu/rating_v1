/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { DepartmentMgmComponent } from '../../../../../../main/webapp/app/entities/department-mgm/department-mgm.component';
import { DepartmentMgmService } from '../../../../../../main/webapp/app/entities/department-mgm/department-mgm.service';
import { DepartmentMgm } from '../../../../../../main/webapp/app/entities/department-mgm/department-mgm.model';

describe('Component Tests', () => {

    describe('DepartmentMgm Management Component', () => {
        let comp: DepartmentMgmComponent;
        let fixture: ComponentFixture<DepartmentMgmComponent>;
        let service: DepartmentMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [DepartmentMgmComponent],
                providers: [
                    DepartmentMgmService
                ]
            })
            .overrideTemplate(DepartmentMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DepartmentMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DepartmentMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new DepartmentMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.departments[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
