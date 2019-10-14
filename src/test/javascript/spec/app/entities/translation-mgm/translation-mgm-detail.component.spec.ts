/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { TranslationMgmDetailComponent } from '../../../../../../main/webapp/app/entities/translation-mgm/translation-mgm-detail.component';
import { TranslationMgmService } from '../../../../../../main/webapp/app/entities/translation-mgm/translation-mgm.service';
import { TranslationMgm } from '../../../../../../main/webapp/app/entities/translation-mgm/translation-mgm.model';

describe('Component Tests', () => {

    describe('TranslationMgm Management Detail Component', () => {
        let comp: TranslationMgmDetailComponent;
        let fixture: ComponentFixture<TranslationMgmDetailComponent>;
        let service: TranslationMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [TranslationMgmDetailComponent],
                providers: [
                    TranslationMgmService
                ]
            })
            .overrideTemplate(TranslationMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(TranslationMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TranslationMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new TranslationMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.translation).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
