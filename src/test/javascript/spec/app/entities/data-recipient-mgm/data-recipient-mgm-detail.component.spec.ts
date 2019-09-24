/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { DataRecipientMgmDetailComponent } from '../../../../../../main/webapp/app/entities/data-recipient-mgm/data-recipient-mgm-detail.component';
import { DataRecipientMgmService } from '../../../../../../main/webapp/app/entities/data-recipient-mgm/data-recipient-mgm.service';
import { DataRecipientMgm } from '../../../../../../main/webapp/app/entities/data-recipient-mgm/data-recipient-mgm.model';

describe('Component Tests', () => {

    describe('DataRecipientMgm Management Detail Component', () => {
        let comp: DataRecipientMgmDetailComponent;
        let fixture: ComponentFixture<DataRecipientMgmDetailComponent>;
        let service: DataRecipientMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [DataRecipientMgmDetailComponent],
                providers: [
                    DataRecipientMgmService
                ]
            })
            .overrideTemplate(DataRecipientMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DataRecipientMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DataRecipientMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new DataRecipientMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.dataRecipient).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
