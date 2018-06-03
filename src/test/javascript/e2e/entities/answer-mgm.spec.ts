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
        answerDialogPage.setOrderInput('5');
        expect(answerDialogPage.getOrderInput()).toMatch('5');
        answerDialogPage.likelihoodSelectLastOption();
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
    orderInput = element(by.css('input#field_order'));
    likelihoodSelect = element(by.css('select#field_likelihood'));

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

    setLikelihoodSelect = function(likelihood) {
        this.likelihoodSelect.sendKeys(likelihood);
    };

    getLikelihoodSelect = function() {
        return this.likelihoodSelect.element(by.css('option:checked')).getText();
    };

    likelihoodSelectLastOption = function() {
        this.likelihoodSelect.all(by.tagName('option')).last().click();
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
