import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('IndirectAsset e2e test', () => {

    let navBarPage: NavBarPage;
    let indirectAssetDialogPage: IndirectAssetDialogPage;
    let indirectAssetComponentsPage: IndirectAssetComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load IndirectAssets', () => {
        navBarPage.goToEntity('indirect-asset-mgm');
        indirectAssetComponentsPage = new IndirectAssetComponentsPage();
        expect(indirectAssetComponentsPage.getTitle())
            .toMatch(/hermeneutApp.indirectAsset.home.title/);

    });

    it('should load create IndirectAsset dialog', () => {
        indirectAssetComponentsPage.clickOnCreateButton();
        indirectAssetDialogPage = new IndirectAssetDialogPage();
        expect(indirectAssetDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.indirectAsset.home.createOrEditLabel/);
        indirectAssetDialogPage.close();
    });

    it('should create and save IndirectAssets', () => {
        indirectAssetComponentsPage.clickOnCreateButton();
        indirectAssetDialogPage.directAssetSelectLastOption();
        indirectAssetDialogPage.myAssetSelectLastOption();
        indirectAssetDialogPage.save();
        expect(indirectAssetDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class IndirectAssetComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-indirect-asset-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class IndirectAssetDialogPage {
    modalTitle = element(by.css('h4#myIndirectAssetLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    directAssetSelect = element(by.css('select#field_directAsset'));
    myAssetSelect = element(by.css('select#field_myAsset'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    directAssetSelectLastOption = function() {
        this.directAssetSelect.all(by.tagName('option')).last().click();
    };

    directAssetSelectOption = function(option) {
        this.directAssetSelect.sendKeys(option);
    };

    getDirectAssetSelect = function() {
        return this.directAssetSelect;
    };

    getDirectAssetSelectedOption = function() {
        return this.directAssetSelect.element(by.css('option:checked')).getText();
    };

    myAssetSelectLastOption = function() {
        this.myAssetSelect.all(by.tagName('option')).last().click();
    };

    myAssetSelectOption = function(option) {
        this.myAssetSelect.sendKeys(option);
    };

    getMyAssetSelect = function() {
        return this.myAssetSelect;
    };

    getMyAssetSelectedOption = function() {
        return this.myAssetSelect.element(by.css('option:checked')).getText();
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
