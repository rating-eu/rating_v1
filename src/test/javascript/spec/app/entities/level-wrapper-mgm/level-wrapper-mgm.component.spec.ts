/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { LevelWrapperMgmComponent } from '../../../../../../main/webapp/app/entities/level-wrapper-mgm/level-wrapper-mgm.component';
import { LevelWrapperMgmService } from '../../../../../../main/webapp/app/entities/level-wrapper-mgm/level-wrapper-mgm.service';
import { LevelWrapperMgm } from '../../../../../../main/webapp/app/entities/level-wrapper-mgm/level-wrapper-mgm.model';

describe('Component Tests', () => {

    describe('LevelWrapperMgm Management Component', () => {
        let comp: LevelWrapperMgmComponent;
        let fixture: ComponentFixture<LevelWrapperMgmComponent>;
        let service: LevelWrapperMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [LevelWrapperMgmComponent],
                providers: [
                    LevelWrapperMgmService
                ]
            })
            .overrideTemplate(LevelWrapperMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LevelWrapperMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LevelWrapperMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new LevelWrapperMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.levelWrappers[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
