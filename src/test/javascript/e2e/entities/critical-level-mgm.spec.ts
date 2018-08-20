import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('CriticalLevel e2e test', () => {

    let navBarPage: NavBarPage;
    let criticalLevelDialogPage: CriticalLevelDialogPage;
    let criticalLevelComponentsPage: CriticalLevelComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load CriticalLevels', () => {
        navBarPage.goToEntity('critical-level-mgm');
        criticalLevelComponentsPage = new CriticalLevelComponentsPage();
        expect(criticalLevelComponentsPage.getTitle())
            .toMatch(/hermeneutApp.criticalLevel.home.title/);

    });

    it('should load create CriticalLevel dialog', () => {
        criticalLevelComponentsPage.clickOnCreateButton();
        criticalLevelDialogPage = new CriticalLevelDialogPage();
        expect(criticalLevelDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.criticalLevel.home.createOrEditLabel/);
        criticalLevelDialogPage.close();
    });

    it('should create and save CriticalLevels', () => {
        criticalLevelComponentsPage.clickOnCreateButton();
        criticalLevelDialogPage.setSideInput('5');
        expect(criticalLevelDialogPage.getSideInput()).toMatch('5');
        criticalLevelDialogPage.setLowLimitInput('5');
        expect(criticalLevelDialogPage.getLowLimitInput()).toMatch('5');
        criticalLevelDialogPage.setMediumLimitInput('5');
        expect(criticalLevelDialogPage.getMediumLimitInput()).toMatch('5');
        criticalLevelDialogPage.setHighLimitInput('5');
        expect(criticalLevelDialogPage.getHighLimitInput()).toMatch('5');
        criticalLevelDialogPage.selfAssessmentSelectLastOption();
        criticalLevelDialogPage.save();
        expect(criticalLevelDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class CriticalLevelComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-critical-level-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class CriticalLevelDialogPage {
    modalTitle = element(by.css('h4#myCriticalLevelLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    sideInput = element(by.css('input#field_side'));
    lowLimitInput = element(by.css('input#field_lowLimit'));
    mediumLimitInput = element(by.css('input#field_mediumLimit'));
    highLimitInput = element(by.css('input#field_highLimit'));
    selfAssessmentSelect = element(by.css('select#field_selfAssessment'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setSideInput = function(side) {
        this.sideInput.sendKeys(side);
    };

    getSideInput = function() {
        return this.sideInput.getAttribute('value');
    };

    setLowLimitInput = function(lowLimit) {
        this.lowLimitInput.sendKeys(lowLimit);
    };

    getLowLimitInput = function() {
        return this.lowLimitInput.getAttribute('value');
    };

    setMediumLimitInput = function(mediumLimit) {
        this.mediumLimitInput.sendKeys(mediumLimit);
    };

    getMediumLimitInput = function() {
        return this.mediumLimitInput.getAttribute('value');
    };

    setHighLimitInput = function(highLimit) {
        this.highLimitInput.sendKeys(highLimit);
    };

    getHighLimitInput = function() {
        return this.highLimitInput.getAttribute('value');
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
