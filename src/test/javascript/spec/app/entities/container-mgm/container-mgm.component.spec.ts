/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { ContainerMgmComponent } from '../../../../../../main/webapp/app/entities/container-mgm/container-mgm.component';
import { ContainerMgmService } from '../../../../../../main/webapp/app/entities/container-mgm/container-mgm.service';
import { ContainerMgm } from '../../../../../../main/webapp/app/entities/container-mgm/container-mgm.model';

describe('Component Tests', () => {

    describe('ContainerMgm Management Component', () => {
        let comp: ContainerMgmComponent;
        let fixture: ComponentFixture<ContainerMgmComponent>;
        let service: ContainerMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [ContainerMgmComponent],
                providers: [
                    ContainerMgmService
                ]
            })
            .overrideTemplate(ContainerMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ContainerMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ContainerMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new ContainerMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.containers[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
