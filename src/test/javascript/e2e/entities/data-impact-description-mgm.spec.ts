import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('DataImpactDescription e2e test', () => {

    let navBarPage: NavBarPage;
    let dataImpactDescriptionDialogPage: DataImpactDescriptionDialogPage;
    let dataImpactDescriptionComponentsPage: DataImpactDescriptionComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load DataImpactDescriptions', () => {
        navBarPage.goToEntity('data-impact-description-mgm');
        dataImpactDescriptionComponentsPage = new DataImpactDescriptionComponentsPage();
        expect(dataImpactDescriptionComponentsPage.getTitle())
            .toMatch(/hermeneutApp.dataImpactDescription.home.title/);

    });

    it('should load create DataImpactDescription dialog', () => {
        dataImpactDescriptionComponentsPage.clickOnCreateButton();
        dataImpactDescriptionDialogPage = new DataImpactDescriptionDialogPage();
        expect(dataImpactDescriptionDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.dataImpactDescription.home.createOrEditLabel/);
        dataImpactDescriptionDialogPage.close();
    });

    it('should create and save DataImpactDescriptions', () => {
        dataImpactDescriptionComponentsPage.clickOnCreateButton();
        dataImpactDescriptionDialogPage.impactSelectLastOption();
        dataImpactDescriptionDialogPage.setDescriptionInput('description');
        expect(dataImpactDescriptionDialogPage.getDescriptionInput()).toMatch('description');
        dataImpactDescriptionDialogPage.languageSelectLastOption();
        dataImpactDescriptionDialogPage.save();
        expect(dataImpactDescriptionDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class DataImpactDescriptionComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-data-impact-description-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class DataImpactDescriptionDialogPage {
    modalTitle = element(by.css('h4#myDataImpactDescriptionLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    impactSelect = element(by.css('select#field_impact'));
    descriptionInput = element(by.css('input#field_description'));
    languageSelect = element(by.css('select#field_language'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setImpactSelect = function(impact) {
        this.impactSelect.sendKeys(impact);
    };

    getImpactSelect = function() {
        return this.impactSelect.element(by.css('option:checked')).getText();
    };

    impactSelectLastOption = function() {
        this.impactSelect.all(by.tagName('option')).last().click();
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
