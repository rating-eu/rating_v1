/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { ExternalAuditMgmComponent } from '../../../../../../main/webapp/app/entities/external-audit-mgm/external-audit-mgm.component';
import { ExternalAuditMgmService } from '../../../../../../main/webapp/app/entities/external-audit-mgm/external-audit-mgm.service';
import { ExternalAuditMgm } from '../../../../../../main/webapp/app/entities/external-audit-mgm/external-audit-mgm.model';

describe('Component Tests', () => {

    describe('ExternalAuditMgm Management Component', () => {
        let comp: ExternalAuditMgmComponent;
        let fixture: ComponentFixture<ExternalAuditMgmComponent>;
        let service: ExternalAuditMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [ExternalAuditMgmComponent],
                providers: [
                    ExternalAuditMgmService
                ]
            })
            .overrideTemplate(ExternalAuditMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ExternalAuditMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ExternalAuditMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new ExternalAuditMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.externalAudits[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
