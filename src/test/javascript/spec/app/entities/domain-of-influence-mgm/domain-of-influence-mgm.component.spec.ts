/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HermeneutTestModule } from '../../../test.module';
import { DomainOfInfluenceMgmComponent } from '../../../../../../main/webapp/app/entities/domain-of-influence-mgm/domain-of-influence-mgm.component';
import { DomainOfInfluenceMgmService } from '../../../../../../main/webapp/app/entities/domain-of-influence-mgm/domain-of-influence-mgm.service';
import { DomainOfInfluenceMgm } from '../../../../../../main/webapp/app/entities/domain-of-influence-mgm/domain-of-influence-mgm.model';

describe('Component Tests', () => {

    describe('DomainOfInfluenceMgm Management Component', () => {
        let comp: DomainOfInfluenceMgmComponent;
        let fixture: ComponentFixture<DomainOfInfluenceMgmComponent>;
        let service: DomainOfInfluenceMgmService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [HermeneutTestModule],
                declarations: [DomainOfInfluenceMgmComponent],
                providers: [
                    DomainOfInfluenceMgmService
                ]
            })
            .overrideTemplate(DomainOfInfluenceMgmComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(DomainOfInfluenceMgmComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DomainOfInfluenceMgmService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new DomainOfInfluenceMgm(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.domainOfInfluences[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
