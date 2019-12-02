import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('QuestionRelevance e2e test', () => {

    let navBarPage: NavBarPage;
    let questionRelevanceDialogPage: QuestionRelevanceDialogPage;
    let questionRelevanceComponentsPage: QuestionRelevanceComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load QuestionRelevances', () => {
        navBarPage.goToEntity('question-relevance-mgm');
        questionRelevanceComponentsPage = new QuestionRelevanceComponentsPage();
        expect(questionRelevanceComponentsPage.getTitle())
            .toMatch(/hermeneutApp.questionRelevance.home.title/);

    });

    it('should load create QuestionRelevance dialog', () => {
        questionRelevanceComponentsPage.clickOnCreateButton();
        questionRelevanceDialogPage = new QuestionRelevanceDialogPage();
        expect(questionRelevanceDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.questionRelevance.home.createOrEditLabel/);
        questionRelevanceDialogPage.close();
    });

    it('should create and save QuestionRelevances', () => {
        questionRelevanceComponentsPage.clickOnCreateButton();
        questionRelevanceDialogPage.setRelevanceInput('5');
        expect(questionRelevanceDialogPage.getRelevanceInput()).toMatch('5');
        questionRelevanceDialogPage.questionSelectLastOption();
        questionRelevanceDialogPage.statusSelectLastOption();
        questionRelevanceDialogPage.save();
        expect(questionRelevanceDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class QuestionRelevanceComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-question-relevance-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class QuestionRelevanceDialogPage {
    modalTitle = element(by.css('h4#myQuestionRelevanceLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    relevanceInput = element(by.css('input#field_relevance'));
    questionSelect = element(by.css('select#field_question'));
    statusSelect = element(by.css('select#field_status'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setRelevanceInput = function(relevance) {
        this.relevanceInput.sendKeys(relevance);
    };

    getRelevanceInput = function() {
        return this.relevanceInput.getAttribute('value');
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

    statusSelectLastOption = function() {
        this.statusSelect.all(by.tagName('option')).last().click();
    };

    statusSelectOption = function(option) {
        this.statusSelect.sendKeys(option);
    };

    getStatusSelect = function() {
        return this.statusSelect;
    };

    getStatusSelectedOption = function() {
        return this.statusSelect.element(by.css('option:checked')).getText();
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
