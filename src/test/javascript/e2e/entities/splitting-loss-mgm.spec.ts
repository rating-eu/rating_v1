import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('SplittingLoss e2e test', () => {

    let navBarPage: NavBarPage;
    let splittingLossDialogPage: SplittingLossDialogPage;
    let splittingLossComponentsPage: SplittingLossComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load SplittingLosses', () => {
        navBarPage.goToEntity('splitting-loss-mgm');
        splittingLossComponentsPage = new SplittingLossComponentsPage();
        expect(splittingLossComponentsPage.getTitle())
            .toMatch(/hermeneutApp.splittingLoss.home.title/);

    });

    it('should load create SplittingLoss dialog', () => {
        splittingLossComponentsPage.clickOnCreateButton();
        splittingLossDialogPage = new SplittingLossDialogPage();
        expect(splittingLossDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.splittingLoss.home.createOrEditLabel/);
        splittingLossDialogPage.close();
    });

    it('should create and save SplittingLosses', () => {
        splittingLossComponentsPage.clickOnCreateButton();
        splittingLossDialogPage.sectorTypeSelectLastOption();
        splittingLossDialogPage.categoryTypeSelectLastOption();
        splittingLossDialogPage.setLossPercentageInput('5');
        expect(splittingLossDialogPage.getLossPercentageInput()).toMatch('5');
        splittingLossDialogPage.setLossInput('5');
        expect(splittingLossDialogPage.getLossInput()).toMatch('5');
        splittingLossDialogPage.selfAssessmentSelectLastOption();
        splittingLossDialogPage.save();
        expect(splittingLossDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class SplittingLossComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-splitting-loss-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class SplittingLossDialogPage {
    modalTitle = element(by.css('h4#mySplittingLossLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    sectorTypeSelect = element(by.css('select#field_sectorType'));
    categoryTypeSelect = element(by.css('select#field_categoryType'));
    lossPercentageInput = element(by.css('input#field_lossPercentage'));
    lossInput = element(by.css('input#field_loss'));
    selfAssessmentSelect = element(by.css('select#field_selfAssessment'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setSectorTypeSelect = function(sectorType) {
        this.sectorTypeSelect.sendKeys(sectorType);
    };

    getSectorTypeSelect = function() {
        return this.sectorTypeSelect.element(by.css('option:checked')).getText();
    };

    sectorTypeSelectLastOption = function() {
        this.sectorTypeSelect.all(by.tagName('option')).last().click();
    };
    setCategoryTypeSelect = function(categoryType) {
        this.categoryTypeSelect.sendKeys(categoryType);
    };

    getCategoryTypeSelect = function() {
        return this.categoryTypeSelect.element(by.css('option:checked')).getText();
    };

    categoryTypeSelectLastOption = function() {
        this.categoryTypeSelect.all(by.tagName('option')).last().click();
    };
    setLossPercentageInput = function(lossPercentage) {
        this.lossPercentageInput.sendKeys(lossPercentage);
    };

    getLossPercentageInput = function() {
        return this.lossPercentageInput.getAttribute('value');
    };

    setLossInput = function(loss) {
        this.lossInput.sendKeys(loss);
    };

    getLossInput = function() {
        return this.lossInput.getAttribute('value');
    };

    selfAssessmentSelectLastOption = function() {
        this.selfAssessmentSelect.all(by.tagName('option')).last().click();
    };

    selfAssessmentSelectOption = function(option) {
        this.selfAssessmentSelect.sendKeys(option);
    };

    getSelfAssessmentSelect = function() {
        return this.selfAssessmentSelect;
    };

    getSelfAssessmentSelectedOption = function() {
        return this.selfAssessmentSelect.element(by.css('option:checked')).getText();
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
