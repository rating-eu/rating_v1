/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { LevelMgmComponent } from '../../../../../../main/webapp/app/entities/level-mgm/level-mgm.component';
import { LevelMgmService } from '../../../../../../main/webapp/app/entities/level-mgm/level-mgm.service';
import { LevelMgm } from '../../../../../../main/webapp/app/entities/level-mgm/level-mgm.model';

describe('Component Tests', () => {

    describe('LevelMgm Management Component', () => {
        let comp: LevelMgmComponent;
        let fixture: ComponentFixture<LevelMgmComponent>;
        let service: LevelMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [LevelMgmComponent],
                providers: [
                    LevelMgmService
                ]
            })
            .overrideTemplate(LevelMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LevelMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LevelMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new LevelMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.levels[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
