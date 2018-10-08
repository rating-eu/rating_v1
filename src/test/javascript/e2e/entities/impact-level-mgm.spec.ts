import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('ImpactLevel e2e test', () => {

    let navBarPage: NavBarPage;
    let impactLevelDialogPage: ImpactLevelDialogPage;
    let impactLevelComponentsPage: ImpactLevelComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load ImpactLevels', () => {
        navBarPage.goToEntity('impact-level-mgm');
        impactLevelComponentsPage = new ImpactLevelComponentsPage();
        expect(impactLevelComponentsPage.getTitle())
            .toMatch(/hermeneutApp.impactLevel.home.title/);

    });

    it('should load create ImpactLevel dialog', () => {
        impactLevelComponentsPage.clickOnCreateButton();
        impactLevelDialogPage = new ImpactLevelDialogPage();
        expect(impactLevelDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.impactLevel.home.createOrEditLabel/);
        impactLevelDialogPage.close();
    });

    it('should create and save ImpactLevels', () => {
        impactLevelComponentsPage.clickOnCreateButton();
        impactLevelDialogPage.setSelfAssessmentIDInput('5');
        expect(impactLevelDialogPage.getSelfAssessmentIDInput()).toMatch('5');
        impactLevelDialogPage.setImpactInput('5');
        expect(impactLevelDialogPage.getImpactInput()).toMatch('5');
        impactLevelDialogPage.setMinLossInput('5');
        expect(impactLevelDialogPage.getMinLossInput()).toMatch('5');
        impactLevelDialogPage.setMaxLossInput('5');
        expect(impactLevelDialogPage.getMaxLossInput()).toMatch('5');
        impactLevelDialogPage.save();
        expect(impactLevelDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class ImpactLevelComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-impact-level-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class ImpactLevelDialogPage {
    modalTitle = element(by.css('h4#myImpactLevelLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    selfAssessmentIDInput = element(by.css('input#field_selfAssessmentID'));
    impactInput = element(by.css('input#field_impact'));
    minLossInput = element(by.css('input#field_minLoss'));
    maxLossInput = element(by.css('input#field_maxLoss'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setSelfAssessmentIDInput = function(selfAssessmentID) {
        this.selfAssessmentIDInput.sendKeys(selfAssessmentID);
    };

    getSelfAssessmentIDInput = function() {
        return this.selfAssessmentIDInput.getAttribute('value');
    };

    setImpactInput = function(impact) {
        this.impactInput.sendKeys(impact);
    };

    getImpactInput = function() {
        return this.impactInput.getAttribute('value');
    };

    setMinLossInput = function(minLoss) {
        this.minLossInput.sendKeys(minLoss);
    };

    getMinLossInput = function() {
        return this.minLossInput.getAttribute('value');
    };

    setMaxLossInput = function(maxLoss) {
        this.maxLossInput.sendKeys(maxLoss);
    };

    getMaxLossInput = function() {
        return this.maxLossInput.getAttribute('value');
    };

    save() {
        this.saveButton.click();
    }

    close() {
        this.closeButton.click();
    }

    getSaveButton() {
        return this.saveButton;
    }
}
