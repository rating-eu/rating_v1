import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('MyAsset e2e test', () => {

    let navBarPage: NavBarPage;
    let myAssetDialogPage: MyAssetDialogPage;
    let myAssetComponentsPage: MyAssetComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load MyAssets', () => {
        navBarPage.goToEntity('my-asset-mgm');
        myAssetComponentsPage = new MyAssetComponentsPage();
        expect(myAssetComponentsPage.getTitle())
            .toMatch(/hermeneutApp.myAsset.home.title/);

    });

    it('should load create MyAsset dialog', () => {
        myAssetComponentsPage.clickOnCreateButton();
        myAssetDialogPage = new MyAssetDialogPage();
        expect(myAssetDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.myAsset.home.createOrEditLabel/);
        myAssetDialogPage.close();
    });

    it('should create and save MyAssets', () => {
        myAssetComponentsPage.clickOnCreateButton();
        myAssetDialogPage.setMagnitudeInput('magnitude');
        expect(myAssetDialogPage.getMagnitudeInput()).toMatch('magnitude');
        myAssetDialogPage.setRankingInput('5');
        expect(myAssetDialogPage.getRankingInput()).toMatch('5');
        myAssetDialogPage.getEstimatedInput().isSelected().then((selected) => {
            if (selected) {
                myAssetDialogPage.getEstimatedInput().click();
                expect(myAssetDialogPage.getEstimatedInput().isSelected()).toBeFalsy();
            } else {
                myAssetDialogPage.getEstimatedInput().click();
                expect(myAssetDialogPage.getEstimatedInput().isSelected()).toBeTruthy();
            }
        });
        myAssetDialogPage.setEconomicValueInput('5');
        expect(myAssetDialogPage.getEconomicValueInput()).toMatch('5');
        myAssetDialogPage.assetSelectLastOption();
        myAssetDialogPage.selfAssessmentSelectLastOption();
        myAssetDialogPage.questionnaireSelectLastOption();
        myAssetDialogPage.save();
        expect(myAssetDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class MyAssetComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-my-asset-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class MyAssetDialogPage {
    modalTitle = element(by.css('h4#myMyAssetLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    magnitudeInput = element(by.css('input#field_magnitude'));
    rankingInput = element(by.css('input#field_ranking'));
    estimatedInput = element(by.css('input#field_estimated'));
    economicValueInput = element(by.css('input#field_economicValue'));
    assetSelect = element(by.css('select#field_asset'));
    selfAssessmentSelect = element(by.css('select#field_selfAssessment'));
    questionnaireSelect = element(by.css('select#field_questionnaire'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setMagnitudeInput = function(magnitude) {
        this.magnitudeInput.sendKeys(magnitude);
    };

    getMagnitudeInput = function() {
        return this.magnitudeInput.getAttribute('value');
    };

    setRankingInput = function(ranking) {
        this.rankingInput.sendKeys(ranking);
    };

    getRankingInput = function() {
        return this.rankingInput.getAttribute('value');
    };

    getEstimatedInput = function() {
        return this.estimatedInput;
    };
    setEconomicValueInput = function(economicValue) {
        this.economicValueInput.sendKeys(economicValue);
    };

    getEconomicValueInput = function() {
        return this.economicValueInput.getAttribute('value');
    };

    assetSelectLastOption = function() {
        this.assetSelect.all(by.tagName('option')).last().click();
    };

    assetSelectOption = function(option) {
        this.assetSelect.sendKeys(option);
    };

    getAssetSelect = function() {
        return this.assetSelect;
    };

    getAssetSelectedOption = function() {
        return this.assetSelect.element(by.css('option:checked')).getText();
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
