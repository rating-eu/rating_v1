/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HermeneutTestModule } from '../../../test.module';
import { LevelMgmDetailComponent } from '../../../../../../main/webapp/app/entities/level-mgm/level-mgm-detail.component';
import { LevelMgmService } from '../../../../../../main/webapp/app/entities/level-mgm/level-mgm.service';
import { LevelMgm } from '../../../../../../main/webapp/app/entities/level-mgm/level-mgm.model';

describe('Component Tests', () => {

    describe('LevelMgm Management Detail Component', () => {
        let comp: LevelMgmDetailComponent;
        let fixture: ComponentFixture<LevelMgmDetailComponent>;
        let service: LevelMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [LevelMgmDetailComponent],
                providers: [
                    LevelMgmService
                ]
            })
            .overrideTemplate(LevelMgmDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LevelMgmDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LevelMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new LevelMgm(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.level).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
