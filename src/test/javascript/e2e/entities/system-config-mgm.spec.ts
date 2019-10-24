import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('SystemConfig e2e test', () => {

    let navBarPage: NavBarPage;
    let systemConfigDialogPage: SystemConfigDialogPage;
    let systemConfigComponentsPage: SystemConfigComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load SystemConfigs', () => {
        navBarPage.goToEntity('system-config-mgm');
        systemConfigComponentsPage = new SystemConfigComponentsPage();
        expect(systemConfigComponentsPage.getTitle())
            .toMatch(/hermeneutApp.systemConfig.home.title/);

    });

    it('should load create SystemConfig dialog', () => {
        systemConfigComponentsPage.clickOnCreateButton();
        systemConfigDialogPage = new SystemConfigDialogPage();
        expect(systemConfigDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.systemConfig.home.createOrEditLabel/);
        systemConfigDialogPage.close();
    });

    it('should create and save SystemConfigs', () => {
        systemConfigComponentsPage.clickOnCreateButton();
        systemConfigDialogPage.keySelectLastOption();
        systemConfigDialogPage.setValueInput('value');
        expect(systemConfigDialogPage.getValueInput()).toMatch('value');
        systemConfigDialogPage.save();
        expect(systemConfigDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class SystemConfigComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-system-config-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class SystemConfigDialogPage {
    modalTitle = element(by.css('h4#mySystemConfigLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    keySelect = element(by.css('select#field_key'));
    valueInput = element(by.css('input#field_value'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setKeySelect = function(key) {
        this.keySelect.sendKeys(key);
    };

    getKeySelect = function() {
        return this.keySelect.element(by.css('option:checked')).getText();
    };

    keySelectLastOption = function() {
        this.keySelect.all(by.tagName('option')).last().click();
    };
    setValueInput = function(value) {
        this.valueInput.sendKeys(value);
    };

    getValueInput = function() {
        return this.valueInput.getAttribute('value');
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
