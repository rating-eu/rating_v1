/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { CompanySectorMgmComponent } from '../../../../../../main/webapp/app/entities/company-sector-mgm/company-sector-mgm.component';
import { CompanySectorMgmService } from '../../../../../../main/webapp/app/entities/company-sector-mgm/company-sector-mgm.service';
import { CompanySectorMgm } from '../../../../../../main/webapp/app/entities/company-sector-mgm/company-sector-mgm.model';

describe('Component Tests', () => {

    describe('CompanySectorMgm Management Component', () => {
        let comp: CompanySectorMgmComponent;
        let fixture: ComponentFixture<CompanySectorMgmComponent>;
        let service: CompanySectorMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [CompanySectorMgmComponent],
                providers: [
                    CompanySectorMgmService
                ]
            })
            .overrideTemplate(CompanySectorMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CompanySectorMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CompanySectorMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new CompanySectorMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.companySectors[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
