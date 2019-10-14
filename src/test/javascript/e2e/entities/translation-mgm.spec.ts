import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('Translation e2e test', () => {

    let navBarPage: NavBarPage;
    let translationDialogPage: TranslationDialogPage;
    let translationComponentsPage: TranslationComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Translations', () => {
        navBarPage.goToEntity('translation-mgm');
        translationComponentsPage = new TranslationComponentsPage();
        expect(translationComponentsPage.getTitle())
            .toMatch(/hermeneutApp.translation.home.title/);

    });

    it('should load create Translation dialog', () => {
        translationComponentsPage.clickOnCreateButton();
        translationDialogPage = new TranslationDialogPage();
        expect(translationDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.translation.home.createOrEditLabel/);
        translationDialogPage.close();
    });

    it('should create and save Translations', () => {
        translationComponentsPage.clickOnCreateButton();
        translationDialogPage.setTextInput('text');
        expect(translationDialogPage.getTextInput()).toMatch('text');
        translationDialogPage.languageSelectLastOption();
        translationDialogPage.dataImpactDescriptionSelectLastOption();
        translationDialogPage.gDPRQuestionSelectLastOption();
        translationDialogPage.gDPRAnswerSelectLastOption();
        translationDialogPage.save();
        expect(translationDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class TranslationComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-translation-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class TranslationDialogPage {
    modalTitle = element(by.css('h4#myTranslationLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    textInput = element(by.css('input#field_text'));
    languageSelect = element(by.css('select#field_language'));
    dataImpactDescriptionSelect = element(by.css('select#field_dataImpactDescription'));
    gDPRQuestionSelect = element(by.css('select#field_gDPRQuestion'));
    gDPRAnswerSelect = element(by.css('select#field_gDPRAnswer'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setTextInput = function(text) {
        this.textInput.sendKeys(text);
    };

    getTextInput = function() {
        return this.textInput.getAttribute('value');
    };

    setLanguageSelect = function(language) {
        this.languageSelect.sendKeys(language);
    };

    getLanguageSelect = function() {
        return this.languageSelect.element(by.css('option:checked')).getText();
    };

    languageSelectLastOption = function() {
        this.languageSelect.all(by.tagName('option')).last().click();
    };
    dataImpactDescriptionSelectLastOption = function() {
        this.dataImpactDescriptionSelect.all(by.tagName('option')).last().click();
    };

    dataImpactDescriptionSelectOption = function(option) {
        this.dataImpactDescriptionSelect.sendKeys(option);
    };

    getDataImpactDescriptionSelect = function() {
        return this.dataImpactDescriptionSelect;
    };

    getDataImpactDescriptionSelectedOption = function() {
        return this.dataImpactDescriptionSelect.element(by.css('option:checked')).getText();
    };

    gDPRQuestionSelectLastOption = function() {
        this.gDPRQuestionSelect.all(by.tagName('option')).last().click();
    };

    gDPRQuestionSelectOption = function(option) {
        this.gDPRQuestionSelect.sendKeys(option);
    };

    getGDPRQuestionSelect = function() {
        return this.gDPRQuestionSelect;
    };

    getGDPRQuestionSelectedOption = function() {
        return this.gDPRQuestionSelect.element(by.css('option:checked')).getText();
    };

    gDPRAnswerSelectLastOption = function() {
        this.gDPRAnswerSelect.all(by.tagName('option')).last().click();
    };

    gDPRAnswerSelectOption = function(option) {
        this.gDPRAnswerSelect.sendKeys(option);
    };

    getGDPRAnswerSelect = function() {
        return this.gDPRAnswerSelect;
    };

    getGDPRAnswerSelectedOption = function() {
        return this.gDPRAnswerSelect.element(by.css('option:checked')).getText();
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
