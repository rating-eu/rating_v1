import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('GDPRQuestion e2e test', () => {

    let navBarPage: NavBarPage;
    let gDPRQuestionDialogPage: GDPRQuestionDialogPage;
    let gDPRQuestionComponentsPage: GDPRQuestionComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load GDPRQuestions', () => {
        navBarPage.goToEntity('gdpr-question-mgm');
        gDPRQuestionComponentsPage = new GDPRQuestionComponentsPage();
        expect(gDPRQuestionComponentsPage.getTitle())
            .toMatch(/hermeneutApp.gDPRQuestion.home.title/);

    });

    it('should load create GDPRQuestion dialog', () => {
        gDPRQuestionComponentsPage.clickOnCreateButton();
        gDPRQuestionDialogPage = new GDPRQuestionDialogPage();
        expect(gDPRQuestionDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.gDPRQuestion.home.createOrEditLabel/);
        gDPRQuestionDialogPage.close();
    });

    it('should create and save GDPRQuestions', () => {
        gDPRQuestionComponentsPage.clickOnCreateButton();
        gDPRQuestionDialogPage.setTextInput('text');
        expect(gDPRQuestionDialogPage.getTextInput()).toMatch('text');
        gDPRQuestionDialogPage.setDescriptionInput('description');
        expect(gDPRQuestionDialogPage.getDescriptionInput()).toMatch('description');
        gDPRQuestionDialogPage.languageSelectLastOption();
        gDPRQuestionDialogPage.answerTypeSelectLastOption();
        gDPRQuestionDialogPage.setOrderInput('5');
        expect(gDPRQuestionDialogPage.getOrderInput()).toMatch('5');
        gDPRQuestionDialogPage.dataOperationFieldSelectLastOption();
        gDPRQuestionDialogPage.securityPillarSelectLastOption();
        gDPRQuestionDialogPage.threatAreaSelectLastOption();
        gDPRQuestionDialogPage.questionnaireSelectLastOption();
        // gDPRQuestionDialogPage.answersSelectLastOption();
        gDPRQuestionDialogPage.save();
        expect(gDPRQuestionDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class GDPRQuestionComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-gdpr-question-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class GDPRQuestionDialogPage {
    modalTitle = element(by.css('h4#myGDPRQuestionLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    textInput = element(by.css('input#field_text'));
    descriptionInput = element(by.css('input#field_description'));
    languageSelect = element(by.css('select#field_language'));
    answerTypeSelect = element(by.css('select#field_answerType'));
    orderInput = element(by.css('input#field_order'));
    dataOperationFieldSelect = element(by.css('select#field_dataOperationField'));
    securityPillarSelect = element(by.css('select#field_securityPillar'));
    threatAreaSelect = element(by.css('select#field_threatArea'));
    questionnaireSelect = element(by.css('select#field_questionnaire'));
    answersSelect = element(by.css('select#field_answers'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setTextInput = function(text) {
        this.textInput.sendKeys(text);
    };

    getTextInput = function() {
        return this.textInput.getAttribute('value');
    };

    setDescriptionInput = function(description) {
        this.descriptionInput.sendKeys(description);
    };

    getDescriptionInput = function() {
        return this.descriptionInput.getAttribute('value');
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
    setAnswerTypeSelect = function(answerType) {
        this.answerTypeSelect.sendKeys(answerType);
    };

    getAnswerTypeSelect = function() {
        return this.answerTypeSelect.element(by.css('option:checked')).getText();
    };

    answerTypeSelectLastOption = function() {
        this.answerTypeSelect.all(by.tagName('option')).last().click();
    };
    setOrderInput = function(order) {
        this.orderInput.sendKeys(order);
    };

    getOrderInput = function() {
        return this.orderInput.getAttribute('value');
    };

    setDataOperationFieldSelect = function(dataOperationField) {
        this.dataOperationFieldSelect.sendKeys(dataOperationField);
    };

    getDataOperationFieldSelect = function() {
        return this.dataOperationFieldSelect.element(by.css('option:checked')).getText();
    };

    dataOperationFieldSelectLastOption = function() {
        this.dataOperationFieldSelect.all(by.tagName('option')).last().click();
    };
    setSecurityPillarSelect = function(securityPillar) {
        this.securityPillarSelect.sendKeys(securityPillar);
    };

    getSecurityPillarSelect = function() {
        return this.securityPillarSelect.element(by.css('option:checked')).getText();
    };

    securityPillarSelectLastOption = function() {
        this.securityPillarSelect.all(by.tagName('option')).last().click();
    };
    setThreatAreaSelect = function(threatArea) {
        this.threatAreaSelect.sendKeys(threatArea);
    };

    getThreatAreaSelect = function() {
        return this.threatAreaSelect.element(by.css('option:checked')).getText();
    };

    threatAreaSelectLastOption = function() {
        this.threatAreaSelect.all(by.tagName('option')).last().click();
    };
    questionnaireSelectLastOption = function() {
        this.questionnaireSelect.all(by.tagName('option')).last().click();
    };

    questionnaireSelectOption = function(option) {
        this.questionnaireSelect.sendKeys(option);
    };

    getQuestionnaireSelect = function() {
        return this.questionnaireSelect;
    };

    getQuestionnaireSelectedOption = function() {
        return this.questionnaireSelect.element(by.css('option:checked')).getText();
    };

    answersSelectLastOption = function() {
        this.answersSelect.all(by.tagName('option')).last().click();
    };

    answersSelectOption = function(option) {
        this.answersSelect.sendKeys(option);
    };

    getAnswersSelect = function() {
        return this.answersSelect;
    };

    getAnswersSelectedOption = function() {
        return this.answersSelect.element(by.css('option:checked')).getText();
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
