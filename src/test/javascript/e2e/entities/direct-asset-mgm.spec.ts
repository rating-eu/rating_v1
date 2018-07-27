import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('DirectAsset e2e test', () => {

    let navBarPage: NavBarPage;
    let directAssetDialogPage: DirectAssetDialogPage;
    let directAssetComponentsPage: DirectAssetComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load DirectAssets', () => {
        navBarPage.goToEntity('direct-asset-mgm');
        directAssetComponentsPage = new DirectAssetComponentsPage();
        expect(directAssetComponentsPage.getTitle())
            .toMatch(/hermeneutApp.directAsset.home.title/);

    });

    it('should load create DirectAsset dialog', () => {
        directAssetComponentsPage.clickOnCreateButton();
        directAssetDialogPage = new DirectAssetDialogPage();
        expect(directAssetDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.directAsset.home.createOrEditLabel/);
        directAssetDialogPage.close();
    });

    it('should create and save DirectAssets', () => {
        directAssetComponentsPage.clickOnCreateButton();
        directAssetDialogPage.assetSelectLastOption();
        directAssetDialogPage.save();
        expect(directAssetDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class DirectAssetComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-direct-asset-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class DirectAssetDialogPage {
    modalTitle = element(by.css('h4#myDirectAssetLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    assetSelect = element(by.css('select#field_asset'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

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
