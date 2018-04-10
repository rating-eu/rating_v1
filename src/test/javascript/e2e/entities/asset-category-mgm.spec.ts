import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('AssetCategory e2e test', () => {

    let navBarPage: NavBarPage;
    let assetCategoryDialogPage: AssetCategoryDialogPage;
    let assetCategoryComponentsPage: AssetCategoryComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load AssetCategories', () => {
        navBarPage.goToEntity('asset-category-mgm');
        assetCategoryComponentsPage = new AssetCategoryComponentsPage();
        expect(assetCategoryComponentsPage.getTitle())
            .toMatch(/hermeneutApp.assetCategory.home.title/);

    });

    it('should load create AssetCategory dialog', () => {
        assetCategoryComponentsPage.clickOnCreateButton();
        assetCategoryDialogPage = new AssetCategoryDialogPage();
        expect(assetCategoryDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.assetCategory.home.createOrEditLabel/);
        assetCategoryDialogPage.close();
    });

    it('should create and save AssetCategories', () => {
        assetCategoryComponentsPage.clickOnCreateButton();
        assetCategoryDialogPage.setNameInput('name');
        expect(assetCategoryDialogPage.getNameInput()).toMatch('name');
        assetCategoryDialogPage.setDescriptionInput('description');
        expect(assetCategoryDialogPage.getDescriptionInput()).toMatch('description');
        assetCategoryDialogPage.typeSelectLastOption();
        assetCategoryDialogPage.save();
        expect(assetCategoryDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class AssetCategoryComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-asset-category-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class AssetCategoryDialogPage {
    modalTitle = element(by.css('h4#myAssetCategoryLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    nameInput = element(by.css('input#field_name'));
    descriptionInput = element(by.css('input#field_description'));
    typeSelect = element(by.css('select#field_type'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setNameInput = function(name) {
        this.nameInput.sendKeys(name);
    };

    getNameInput = function() {
        return this.nameInput.getAttribute('value');
    };

    setDescriptionInput = function(description) {
        this.descriptionInput.sendKeys(description);
    };

    getDescriptionInput = function() {
        return this.descriptionInput.getAttribute('value');
    };

    setTypeSelect = function(type) {
        this.typeSelect.sendKeys(type);
    };

    getTypeSelect = function() {
        return this.typeSelect.element(by.css('option:checked')).getText();
    };

    typeSelectLastOption = function() {
        this.typeSelect.all(by.tagName('option')).last().click();
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
