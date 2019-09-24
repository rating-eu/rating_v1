import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('GDPRAnswer e2e test', () => {

    let navBarPage: NavBarPage;
    let gDPRAnswerDialogPage: GDPRAnswerDialogPage;
    let gDPRAnswerComponentsPage: GDPRAnswerComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load GDPRAnswers', () => {
        navBarPage.goToEntity('gdpr-answer-mgm');
        gDPRAnswerComponentsPage = new GDPRAnswerComponentsPage();
        expect(gDPRAnswerComponentsPage.getTitle())
            .toMatch(/hermeneutApp.gDPRAnswer.home.title/);

    });

    it('should load create GDPRAnswer dialog', () => {
        gDPRAnswerComponentsPage.clickOnCreateButton();
        gDPRAnswerDialogPage = new GDPRAnswerDialogPage();
        expect(gDPRAnswerDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.gDPRAnswer.home.createOrEditLabel/);
        gDPRAnswerDialogPage.close();
    });

    it('should create and save GDPRAnswers', () => {
        gDPRAnswerComponentsPage.clickOnCreateButton();
        gDPRAnswerDialogPage.setTextInput('text');
        expect(gDPRAnswerDialogPage.getTextInput()).toMatch('text');
        gDPRAnswerDialogPage.answerValueSelectLastOption();
        gDPRAnswerDialogPage.setOrderInput('5');
        expect(gDPRAnswerDialogPage.getOrderInput()).toMatch('5');
        gDPRAnswerDialogPage.save();
        expect(gDPRAnswerDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class GDPRAnswerComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-gdpr-answer-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class GDPRAnswerDialogPage {
    modalTitle = element(by.css('h4#myGDPRAnswerLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    textInput = element(by.css('input#field_text'));
    answerValueSelect = element(by.css('select#field_answerValue'));
    orderInput = element(by.css('input#field_order'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setTextInput = function(text) {
        this.textInput.sendKeys(text);
    };

    getTextInput = function() {
        return this.textInput.getAttribute('value');
    };

    setAnswerValueSelect = function(answerValue) {
        this.answerValueSelect.sendKeys(answerValue);
    };

    getAnswerValueSelect = function() {
        return this.answerValueSelect.element(by.css('option:checked')).getText();
    };

    answerValueSelectLastOption = function() {
        this.answerValueSelect.all(by.tagName('option')).last().click();
    };
    setOrderInput = function(order) {
        this.orderInput.sendKeys(order);
    };

    getOrderInput = function() {
        return this.orderInput.getAttribute('value');
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
