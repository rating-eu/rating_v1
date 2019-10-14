import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('GDPRMyAnswer e2e test', () => {

    let navBarPage: NavBarPage;
    let gDPRMyAnswerDialogPage: GDPRMyAnswerDialogPage;
    let gDPRMyAnswerComponentsPage: GDPRMyAnswerComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load GDPRMyAnswers', () => {
        navBarPage.goToEntity('gdpr-my-answer-mgm');
        gDPRMyAnswerComponentsPage = new GDPRMyAnswerComponentsPage();
        expect(gDPRMyAnswerComponentsPage.getTitle())
            .toMatch(/hermeneutApp.gDPRMyAnswer.home.title/);

    });

    it('should load create GDPRMyAnswer dialog', () => {
        gDPRMyAnswerComponentsPage.clickOnCreateButton();
        gDPRMyAnswerDialogPage = new GDPRMyAnswerDialogPage();
        expect(gDPRMyAnswerDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.gDPRMyAnswer.home.createOrEditLabel/);
        gDPRMyAnswerDialogPage.close();
    });

    it('should create and save GDPRMyAnswers', () => {
        gDPRMyAnswerComponentsPage.clickOnCreateButton();
        gDPRMyAnswerDialogPage.gDPRQuestionnaireStatusSelectLastOption();
        gDPRMyAnswerDialogPage.questionSelectLastOption();
        gDPRMyAnswerDialogPage.answerSelectLastOption();
        gDPRMyAnswerDialogPage.save();
        expect(gDPRMyAnswerDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class GDPRMyAnswerComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-gdpr-my-answer-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class GDPRMyAnswerDialogPage {
    modalTitle = element(by.css('h4#myGDPRMyAnswerLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    gDPRQuestionnaireStatusSelect = element(by.css('select#field_gDPRQuestionnaireStatus'));
    questionSelect = element(by.css('select#field_question'));
    answerSelect = element(by.css('select#field_answer'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    gDPRQuestionnaireStatusSelectLastOption = function() {
        this.gDPRQuestionnaireStatusSelect.all(by.tagName('option')).last().click();
    };

    gDPRQuestionnaireStatusSelectOption = function(option) {
        this.gDPRQuestionnaireStatusSelect.sendKeys(option);
    };

    getGDPRQuestionnaireStatusSelect = function() {
        return this.gDPRQuestionnaireStatusSelect;
    };

    getGDPRQuestionnaireStatusSelectedOption = function() {
        return this.gDPRQuestionnaireStatusSelect.element(by.css('option:checked')).getText();
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

    answerSelectLastOption = function() {
        this.answerSelect.all(by.tagName('option')).last().click();
    };

    answerSelectOption = function(option) {
        this.answerSelect.sendKeys(option);
    };

    getAnswerSelect = function() {
        return this.answerSelect;
    };

    getAnswerSelectedOption = function() {
        return this.answerSelect.element(by.css('option:checked')).getText();
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
