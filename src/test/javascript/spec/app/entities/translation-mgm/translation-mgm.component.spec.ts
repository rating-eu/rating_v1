/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { TranslationMgmComponent } from '../../../../../../main/webapp/app/entities/translation-mgm/translation-mgm.component';
import { TranslationMgmService } from '../../../../../../main/webapp/app/entities/translation-mgm/translation-mgm.service';
import { TranslationMgm } from '../../../../../../main/webapp/app/entities/translation-mgm/translation-mgm.model';

describe('Component Tests', () => {

    describe('TranslationMgm Management Component', () => {
        let comp: TranslationMgmComponent;
        let fixture: ComponentFixture<TranslationMgmComponent>;
        let service: TranslationMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [TranslationMgmComponent],
                providers: [
                    TranslationMgmService
                ]
            })
            .overrideTemplate(TranslationMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(TranslationMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TranslationMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new TranslationMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.translations[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
