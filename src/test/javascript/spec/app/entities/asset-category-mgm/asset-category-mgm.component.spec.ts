/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { AssetCategoryMgmComponent } from '../../../../../../main/webapp/app/entities/asset-category-mgm/asset-category-mgm.component';
import { AssetCategoryMgmService } from '../../../../../../main/webapp/app/entities/asset-category-mgm/asset-category-mgm.service';
import { AssetCategoryMgm } from '../../../../../../main/webapp/app/entities/asset-category-mgm/asset-category-mgm.model';

describe('Component Tests', () => {

    describe('AssetCategoryMgm Management Component', () => {
        let comp: AssetCategoryMgmComponent;
        let fixture: ComponentFixture<AssetCategoryMgmComponent>;
        let service: AssetCategoryMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [AssetCategoryMgmComponent],
                providers: [
                    AssetCategoryMgmService
                ]
            })
            .overrideTemplate(AssetCategoryMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(AssetCategoryMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AssetCategoryMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new AssetCategoryMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.assetCategories[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
