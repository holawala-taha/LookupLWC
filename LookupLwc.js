import { LightningElement,api,track,wire } from 'lwc';
import getRecords from '@salesforce/apex/LookupConrtoller.getRecords';

/** The delay used when debouncing event handlers before invoking Apex. */
const DELAY = 300;
const FOCUSOUTDELAY = 200;

export default class LookupLwc extends LightningElement {

     @api sobjectName;
     @track selectedObject  = {};
     @track records;
     filter         = '';
     showList       = false;
     listClass      = 'slds-lookup__menu';

     @api getSelectedObject(){

     }

     get pillClass(){
        if(!this.selectedObject || !this.selectedObject.Id)
            return 'slds-pill_label slds-hide';
        else
            return 'slds-pill_label slds-show';
     }

     get inputClass(){
        if(!this.selectedObject || !this.selectedObject.Id)
            return 'slds-input slds-show';
        else
            return 'slds-input slds-hide';
     }

     get iconClass(){
        if(!this.selectedObject || !this.selectedObject.Id)
            return 'slds-input__icon';
        else
            return 'slds-input__icon slds-hide';
     }

    @wire(getRecords, { SObjectName: '$sobjectName',
                            filter: '$filter'})
    populateRecords({ error, data }){
        this.records = data;
    }

    showRecordList(){ 
        this.showList = true;
        this.listClass = 'slds-lookup__menu slds-show';
    }

    hideRecordList(){
        this.showList   = false;
        this.listClass  = 'slds-lookup__menu';
    }

    handleFocusOut(){
        this.delayTimeout = setTimeout(() => {
            this.hideRecordList();
        }, FOCUSOUTDELAY);
    }

    handleSearchTextChange(event) {
        // Debouncing this method: Do not update the reactive property as long as this function is
        // being called within a delay of DELAY. This is to avoid a very large number of Apex method calls.
        window.clearTimeout(this.delayTimeout);
        const filter = event.target.value;
        this.delayTimeout = setTimeout(() => {
            this.filter = filter;
        }, DELAY);
    }

    onRecordSelection(event){
        this.selectedObject.Id      = event.target.dataset.recordId;
        this.selectedObject.Name    = event.target.dataset.recordName;
        this.hideRecordList();
        this.dispatchChangeEvent();
    }

    removeSelection(){
        this.selectedObject = {};
        this.dispatchChangeEvent();
    }

    dispatchChangeEvent(){
        const changeEvent = new CustomEvent('change', { detail: this.selectedObject});
        this.dispatchEvent(changeEvent);
    }


}
