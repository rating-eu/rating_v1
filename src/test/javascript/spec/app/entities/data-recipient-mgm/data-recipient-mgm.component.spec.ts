/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { DataRecipientMgmComponent } from '../../../../../../main/webapp/app/entities/data-recipient-mgm/data-recipient-mgm.component';
import { DataRecipientMgmService } from '../../../../../../main/webapp/app/entities/data-recipient-mgm/data-recipient-mgm.service';
import { DataRecipientMgm } from '../../../../../../main/webapp/app/entities/data-recipient-mgm/data-recipient-mgm.model';

describe('Component Tests', () => {

    describe('DataRecipientMgm Management Component', () => {
        let comp: DataRecipientMgmComponent;
        let fixture: ComponentFixture<DataRecipientMgmComponent>;
        let service: DataRecipientMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [DataRecipientMgmComponent],
                providers: [
                    DataRecipientMgmService
                ]
            })
            .overrideTemplate(DataRecipientMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DataRecipientMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DataRecipientMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new DataRecipientMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.dataRecipients[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
