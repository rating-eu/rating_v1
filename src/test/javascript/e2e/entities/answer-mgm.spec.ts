import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('Answer e2e test', () => {

    let navBarPage: NavBarPage;
    let answerDialogPage: AnswerDialogPage;
    let answerComponentsPage: AnswerComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Answers', () => {
        navBarPage.goToEntity('answer-mgm');
        answerComponentsPage = new AnswerComponentsPage();
        expect(answerComponentsPage.getTitle())
            .toMatch(/hermeneutApp.answer.home.title/);

    });

    it('should load create Answer dialog', () => {
        answerComponentsPage.clickOnCreateButton();
        answerDialogPage = new AnswerDialogPage();
        expect(answerDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.answer.home.createOrEditLabel/);
        answerDialogPage.close();
    });

    it('should create and save Answers', () => {
        answerComponentsPage.clickOnCreateButton();
        answerDialogPage.setNameInput('name');
        expect(answerDialogPage.getNameInput()).toMatch('name');
        answerDialogPage.setCreatedInput(12310020012301);
        expect(answerDialogPage.getCreatedInput()).toMatch('2001-12-31T02:30');
        answerDialogPage.setModifiedInput(12310020012301);
        expect(answerDialogPage.getModifiedInput()).toMatch('2001-12-31T02:30');
        // answerDialogPage.threatAgentsSelectLastOption();
        // answerDialogPage.attacksSelectLastOption();
        answerDialogPage.questionSelectLastOption();
        answerDialogPage.save();
        expect(answerDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class AnswerComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-answer-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class AnswerDialogPage {
    modalTitle = element(by.css('h4#myAnswerLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    nameInput = element(by.css('input#field_name'));
    createdInput = element(by.css('input#field_created'));
    modifiedInput = element(by.css('input#field_modified'));
    threatAgentsSelect = element(by.css('select#field_threatAgents'));
    attacksSelect = element(by.css('select#field_attacks'));
    questionSelect = element(by.css('select#field_question'));

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

    threatAgentsSelectLastOption = function() {
        this.threatAgentsSelect.all(by.tagName('option')).last().click();
    };

    threatAgentsSelectOption = function(option) {
        this.threatAgentsSelect.sendKeys(option);
    };

    getThreatAgentsSelect = function() {
        return this.threatAgentsSelect;
    };

    getThreatAgentsSelectedOption = function() {
        return this.threatAgentsSelect.element(by.css('option:checked')).getText();
    };

    attacksSelectLastOption = function() {
        this.attacksSelect.all(by.tagName('option')).last().click();
    };

    attacksSelectOption = function(option) {
        this.attacksSelect.sendKeys(option);
    };

    getAttacksSelect = function() {
        return this.attacksSelect;
    };

    getAttacksSelectedOption = function() {
        return this.attacksSelect.element(by.css('option:checked')).getText();
    };

    questionSelectLastOption = function() {
        this.questionSelect.all(by.tagName('option')).last().click();
    };

    questionSelectOption = function(option) {
        this.questionSelect.sendKeys(option);
    };

    getQuestionSelect = function() {
        return this.questionSelect;
    };

    getQuestionSelectedOption = function() {
        return this.questionSelect.element(by.css('option:checked')).getText();
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
