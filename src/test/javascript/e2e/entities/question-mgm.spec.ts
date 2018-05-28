import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('Question e2e test', () => {

    let navBarPage: NavBarPage;
    let questionDialogPage: QuestionDialogPage;
    let questionComponentsPage: QuestionComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Questions', () => {
        navBarPage.goToEntity('question-mgm');
        questionComponentsPage = new QuestionComponentsPage();
        expect(questionComponentsPage.getTitle())
            .toMatch(/hermeneutApp.question.home.title/);

    });

    it('should load create Question dialog', () => {
        questionComponentsPage.clickOnCreateButton();
        questionDialogPage = new QuestionDialogPage();
        expect(questionDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.question.home.createOrEditLabel/);
        questionDialogPage.close();
    });

    it('should create and save Questions', () => {
        questionComponentsPage.clickOnCreateButton();
        questionDialogPage.setNameInput('name');
        expect(questionDialogPage.getNameInput()).toMatch('name');
        questionDialogPage.setCreatedInput(12310020012301);
        expect(questionDialogPage.getCreatedInput()).toMatch('2001-12-31T02:30');
        questionDialogPage.setModifiedInput(12310020012301);
        expect(questionDialogPage.getModifiedInput()).toMatch('2001-12-31T02:30');
        questionDialogPage.setOrderInput('5');
        expect(questionDialogPage.getOrderInput()).toMatch('5');
        questionDialogPage.questionTypeSelectLastOption();
        questionDialogPage.answerTypeSelectLastOption();
        questionDialogPage.threatAgentSelectLastOption();
        // questionDialogPage.attackStrategiesSelectLastOption();
        questionDialogPage.questionnaireSelectLastOption();
        questionDialogPage.save();
        expect(questionDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class QuestionComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-question-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class QuestionDialogPage {
    modalTitle = element(by.css('h4#myQuestionLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    nameInput = element(by.css('input#field_name'));
    createdInput = element(by.css('input#field_created'));
    modifiedInput = element(by.css('input#field_modified'));
    orderInput = element(by.css('input#field_order'));
    questionTypeSelect = element(by.css('select#field_questionType'));
    answerTypeSelect = element(by.css('select#field_answerType'));
    threatAgentSelect = element(by.css('select#field_threatAgent'));
    attackStrategiesSelect = element(by.css('select#field_attackStrategies'));
    questionnaireSelect = element(by.css('select#field_questionnaire'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setNameInput = function(name) {
        this.nameInput.sendKeys(name);
    };

    getNameInput = function() {
        return this.nameInput.getAttribute('value');
    };

    setCreatedInput = function(created) {
        this.createdInput.sendKeys(created);
    };

    getCreatedInput = function() {
        return this.createdInput.getAttribute('value');
    };

    setModifiedInput = function(modified) {
        this.modifiedInput.sendKeys(modified);
    };

    getModifiedInput = function() {
        return this.modifiedInput.getAttribute('value');
    };

    setOrderInput = function(order) {
        this.orderInput.sendKeys(order);
    };

    getOrderInput = function() {
        return this.orderInput.getAttribute('value');
    };

    setQuestionTypeSelect = function(questionType) {
        this.questionTypeSelect.sendKeys(questionType);
    };

    getQuestionTypeSelect = function() {
        return this.questionTypeSelect.element(by.css('option:checked')).getText();
    };

    questionTypeSelectLastOption = function() {
        this.questionTypeSelect.all(by.tagName('option')).last().click();
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
    threatAgentSelectLastOption = function() {
        this.threatAgentSelect.all(by.tagName('option')).last().click();
    };

    threatAgentSelectOption = function(option) {
        this.threatAgentSelect.sendKeys(option);
    };

    getThreatAgentSelect = function() {
        return this.threatAgentSelect;
    };

    getThreatAgentSelectedOption = function() {
        return this.threatAgentSelect.element(by.css('option:checked')).getText();
    };

    attackStrategiesSelectLastOption = function() {
        this.attackStrategiesSelect.all(by.tagName('option')).last().click();
    };

    attackStrategiesSelectOption = function(option) {
        this.attackStrategiesSelect.sendKeys(option);
    };

    getAttackStrategiesSelect = function() {
        return this.attackStrategiesSelect;
    };

    getAttackStrategiesSelectedOption = function() {
        return this.attackStrategiesSelect.element(by.css('option:checked')).getText();
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
