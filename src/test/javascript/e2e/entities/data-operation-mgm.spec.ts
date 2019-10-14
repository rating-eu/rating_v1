import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('DataOperation e2e test', () => {

    let navBarPage: NavBarPage;
    let dataOperationDialogPage: DataOperationDialogPage;
    let dataOperationComponentsPage: DataOperationComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load DataOperations', () => {
        navBarPage.goToEntity('data-operation-mgm');
        dataOperationComponentsPage = new DataOperationComponentsPage();
        expect(dataOperationComponentsPage.getTitle())
            .toMatch(/hermeneutApp.dataOperation.home.title/);

    });

    it('should load create DataOperation dialog', () => {
        dataOperationComponentsPage.clickOnCreateButton();
        dataOperationDialogPage = new DataOperationDialogPage();
        expect(dataOperationDialogPage.getModalTitle())
            .toMatch(/hermeneutApp.dataOperation.home.createOrEditLabel/);
        dataOperationDialogPage.close();
    });

    it('should create and save DataOperations', () => {
        dataOperationComponentsPage.clickOnCreateButton();
        dataOperationDialogPage.setNameInput('name');
        expect(dataOperationDialogPage.getNameInput()).toMatch('name');
        dataOperationDialogPage.setProcessedDataInput('processedData');
        expect(dataOperationDialogPage.getProcessedDataInput()).toMatch('processedData');
        dataOperationDialogPage.setProcessingPurposeInput('processingPurpose');
        expect(dataOperationDialogPage.getProcessingPurposeInput()).toMatch('processingPurpose');
        dataOperationDialogPage.setDataSubjectInput('dataSubject');
        expect(dataOperationDialogPage.getDataSubjectInput()).toMatch('dataSubject');
        dataOperationDialogPage.setProcessingMeansInput('processingMeans');
        expect(dataOperationDialogPage.getProcessingMeansInput()).toMatch('processingMeans');
        dataOperationDialogPage.setDataProcessorInput('dataProcessor');
        expect(dataOperationDialogPage.getDataProcessorInput()).toMatch('dataProcessor');
        dataOperationDialogPage.companyProfileSelectLastOption();
        dataOperationDialogPage.save();
        expect(dataOperationDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class DataOperationComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-data-operation-mgm div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class DataOperationDialogPage {
    modalTitle = element(by.css('h4#myDataOperationLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    nameInput = element(by.css('input#field_name'));
    processedDataInput = element(by.css('input#field_processedData'));
    processingPurposeInput = element(by.css('input#field_processingPurpose'));
    dataSubjectInput = element(by.css('input#field_dataSubject'));
    processingMeansInput = element(by.css('input#field_processingMeans'));
    dataProcessorInput = element(by.css('input#field_dataProcessor'));
    companyProfileSelect = element(by.css('select#field_companyProfile'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setNameInput = function(name) {
        this.nameInput.sendKeys(name);
    };

    getNameInput = function() {
        return this.nameInput.getAttribute('value');
    };

    setProcessedDataInput = function(processedData) {
        this.processedDataInput.sendKeys(processedData);
    };

    getProcessedDataInput = function() {
        return this.processedDataInput.getAttribute('value');
    };

    setProcessingPurposeInput = function(processingPurpose) {
        this.processingPurposeInput.sendKeys(processingPurpose);
    };

    getProcessingPurposeInput = function() {
        return this.processingPurposeInput.getAttribute('value');
    };

    setDataSubjectInput = function(dataSubject) {
        this.dataSubjectInput.sendKeys(dataSubject);
    };

    getDataSubjectInput = function() {
        return this.dataSubjectInput.getAttribute('value');
    };

    setProcessingMeansInput = function(processingMeans) {
        this.processingMeansInput.sendKeys(processingMeans);
    };

    getProcessingMeansInput = function() {
        return this.processingMeansInput.getAttribute('value');
    };

    setDataProcessorInput = function(dataProcessor) {
        this.dataProcessorInput.sendKeys(dataProcessor);
    };

    getDataProcessorInput = function() {
        return this.dataProcessorInput.getAttribute('value');
    };

    companyProfileSelectLastOption = function() {
        this.companyProfileSelect.all(by.tagName('option')).last().click();
    };

    companyProfileSelectOption = function(option) {
        this.companyProfileSelect.sendKeys(option);
    };

    getCompanyProfileSelect = function() {
        return this.companyProfileSelect;
    };

    getCompanyProfileSelectedOption = function() {
        return this.companyProfileSelect.element(by.css('option:checked')).getText();
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
