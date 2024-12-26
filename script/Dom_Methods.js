const uploadElementFileOne = document.querySelector(".uploadIconOne");
const uploadElementFileTwo = document.querySelector(".uploadIconTwo");
const fileInputElementOne = document.querySelector("#inputFileOne");
const fileInputElementTwo = document.querySelector("#inputFileTwo");
const compare = document.querySelector(".compare");
const moveToLeft = document.querySelector(".moveToLeft");
const moveToRight = document.querySelector(".moveToRight");
const equalizer = document.querySelector(".equalizer");
const editModalClose = document.querySelector(".close");
var sortIcon = document.querySelector(".sortIcon");
var addRowToTable = document.querySelector(".addIcon");
var addRowConfirm = document.querySelector(".dataAddIcon");
var editCurrentRow = document.querySelector(".editIcon");
var deleteCurrentRow = document.querySelector(".deleteBtn");
var saveChangesOnEdit = document.querySelector(".saveIcon");
var keyInputElement = document.querySelector("#key");
var valueInputElement = document.querySelector("#value");
var dataTypeSelectElement = document.querySelector("#dataType");
const saveFileOne = document.querySelector(".saveTableOne");
const saveFileTwo = document.querySelector(".saveTableTwo");
const resetFileOne = document.querySelector(".resetTableOne");
const resetFileTwo = document.querySelector(".resetTableTwo");
const undoFileOne = document.querySelector(".undoIconOne");
const redoFileOne = document.querySelector(".redoIconOne");
const undoFileTwo = document.querySelector(".undoIconTwo");
const redoFileTwo = document.querySelector(".redoIconTwo");
const downloadFileOne = document.querySelector(".downloadIconOne");
const downloadFileTwo = document.querySelector(".downloadIconTwo");
const filterFileOne = document.querySelector(".filterIconOne");
const filterFileTwo = document.querySelector(".filterIconTwo");
const copyFileOne = document.querySelector(".ctcOne");
const copyFileTwo = document.querySelector(".ctcTwo");
const searchFileOne = document.querySelector(".searchIconOne");
const searchFileTwo = document.querySelector(".searchIconTwo");
const filterButtonOne = document.querySelector(".filterButtonOne");
const filterButtonTwo = document.querySelector(".filterButtonTwo");
const alertBox = document.querySelector(".alertBox");
const filterModalOne = document.querySelector(".modalOne");
const filterModalTwo = document.querySelector(".modalTwo");
const filterDropdownDivOne = document.querySelector(".dropdownChildDivOne");
const filterDropdownDivTwo = document.querySelector(".dropdownChildDivTwo");
const modal = document.querySelector(".edit-modal");
const tableOneContainer = document.querySelector(".tableOneContainer");
const tableTwoContainer = document.querySelector(".tableTwoContainer");
const clearFileOne = document.querySelector(".clearFileOne");
const clearFileTwo = document.querySelector(".clearFileTwo");
const fileOneNameContainer = document.querySelector(".fileOneNameContainer");
const fileTwoNameContainer = document.querySelector(".fileTwoNameContainer");

class element{
    constructor(eName, eClasses, content, eventName, eventCallback){
        this.eName = eName;
        this.eClasses = eClasses;
        this.content = content;
        this.eventName = eventName;
        this.eventCallback = eventCallback;
    }

    createElement(){
        var tempElement = document.createElement(this.eName);
        tempElement.textContent = this.content;
        if(this.eClasses.length>0){
            this.eClasses.forEach(entry => tempElement.classList.add(entry));
        }
        if(this.eventName!=null && this.eventCallback!=null){
            this.eventName.forEach(function(entry, index){
                tempElement.setAttribute(entry, this.eventCallback[index]);
            }.bind(this));
        }
        return tempElement;
    }
}

function appendElements(parentElement, childElement){
    childElement.forEach(function(entry){
        parentElement.appendChild(entry);
    });
}

function toggleElement(element){
    if(element===null){
        return
    }
    var currentClassList = element.classList;
    if(currentClassList.contains('hide')){
        currentClassList.remove('hide');
        currentClassList.add('show');
        return
    }
    currentClassList.remove('show');
    currentClassList.add('hide');    
}

function showElement(element){
    if(element===null){
        return
    }
    element.classList.remove('hide');
    element.classList.add('show');
}

function hideElement(element){
    if(element===null){
        return
    }
    element.classList.remove('show');
    element.classList.add('hide');
}

function showAndHideElement(elementToShow, elementToHide){
    showElement(elementToShow);
    hideElement(elementToHide);
}

function editOrAddRowToggleHandler(elementToShow, elementToHide){
    showAndHideElement(elementToShow, elementToHide);
    showElement(modal);
}

function tableEditAlertHandler(e){
    if((e.target==addRowConfirm || e.target==saveChangesOnEdit) && ((keyInputElement.value=='') || (valueInputElement.value=='' && dataTypeSelectElement.value!='null'))){
        alertBox.textContent = "Enter valid values to add/change"
        alertBox.classList.add('show');
        setTimeout(function(){
            alertBox.classList.remove('show');
        },1000);
        return false;
    }
}

function copyToClipboard(text){
    navigator.clipboard.writeText(text)
    .then(function(){
        alertBox.innerHTML = '';
        alertBox.textContent = 'Copied to clipboard';
        alertBox.classList.add('show');
        setTimeout(function(){
            alertBox.classList.remove('show');
        },1000);}, 
        function(err){
        console.error('Async: Could not copy text: ', err);
    });
}

function readerOnload(e){
    var fileContent = e.target.result;
    var arrayOfJson = convertJsonToArray(fileContent);
    documentElement.parentNode.parentNode.classList.contains('fileOneOutterContainer') ? documentOneArray = arrayOfJson : documentTwoArray = arrayOfJson;
    // documentElement.parentNode.parentNode.classList.contains('fileOneOutterContainer') ? undoStackOne.push(arrayOfJson) : undoStackTwo.push(arrayOfJson);
    var updateTable = new update(documentOneArray, documentTwoArray);
    updateTable.updateArray();
    renderArrayAsTable(arrayOfJson, documentElement.parentNode.parentNode.childNodes[1].childNodes[0]);
    documentElement.parentNode.getElementsByClassName('save')[0].click();
}

function readFile(e){
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(e){readerOnload(e);}
}

function renderFileName(fileName){ 
    documentElement.parentNode.lastElementChild.textContent = fileName;
}

function fileInputHandler(fileName, e){
    renderFileName(fileName);
    readFile(e);
}

function uploadHandler(e){
    documentElement = e.target;
    documentElement.parentNode.parentNode.classList.contains('fileOneOutterContainer') ? fileInputElementOne.click() : fileInputElementTwo.click();
}

function editRow(node){
    currentTable = node.parentNode.parentNode.parentNode.parentNode;
    currentRow = node.parentNode.parentNode;
    var key = currentRow.cells[0].innerHTML;
    var value = currentRow.cells[1].innerHTML;
    keyInputElement.value = key;
    valueInputElement.value = value;
    keyInputElement.disabled = true;
    editOrAddRowToggleHandler(saveChangesOnEdit, addRowConfirm);
}

function addIconClick(node){
    currentTable = node.parentNode.parentNode.parentNode.parentNode;
    keyInputElement.value = '';
    valueInputElement.value = '';
    keyInputElement.disabled = false;
    editOrAddRowToggleHandler(addRowConfirm, saveChangesOnEdit);
}

function createDeleteConfirmation(){
    alertBox.innerHTML = '';
    var confirmationQuestion = new element('p', [], 'Are you sure you want to delete the entry?', null, null);
    confirmationQuestion = confirmationQuestion.createElement();
    var cancelButton = new element('i', ['fa', 'fa-times', 'cancelButton'], '', ['onclick'], ['cancelDeletion()']);
    cancelButton = cancelButton.createElement();
    var proceedButton = new element('i', ['fa', 'fa-check', 'proceedBtn'], '', ['onclick'], ['proceedDeletion()']);
    proceedButton = proceedButton.createElement();
    appendElements(alertBox, [confirmationQuestion, cancelButton, proceedButton]);
    alertBox.classList.add('show');
}

function appendIconsToCells(rowElement, sortClass){
    if(rowElement.firstElementChild.tagName.toLowerCase()=='th'){
        var sortIconObject = new element('i', ['fa', sortClass, 'tableIcons', 'icons', 'sortIcon'], '', ['onclick'], ['sortIconClick(this)']);
        var sortIcon = sortIconObject.createElement();
        var addIconObject = new element('i', ['fa', 'fa-plus', 'tableIcons', 'icons', 'addIcon'], '', ['onclick'], ['addIconClick(this)']);
        var addIcon = addIconObject.createElement();
        appendElements(rowElement.firstElementChild, [sortIcon]);
        appendElements(rowElement.lastElementChild, [addIcon]);
    }
    else{
        var editIconObject = new element('i', ['material-icons', 'tableIcons', 'icons','editIcon'], '', ['onclick'], ['editRow(this)']);
        var editIcon = editIconObject.createElement();
        editIcon.textContent = "edit";
        appendElements(rowElement.lastElementChild, [editIcon]);
        var deleteIconObject = new element('i', ['material-icons', 'tableIcons', 'icons', 'deleteBtn'], 'delete', ['onclick'], ['deleteRow(this)']);
        var deleteIcon = deleteIconObject.createElement();
        appendElements(rowElement.lastElementChild, [deleteIcon]);
    }
}

function clearFile(e){
    var container = e.target.parentNode.parentNode.childNodes[1].childNodes[0];
    if(container==tableOneContainer){
        tableOneContainer.innerHTML = '';
        currentArrayOne = '';
        documentOneArray = '';
        fileOneNameContainer.innerHTML = '';
        return
    }
    tableTwoContainer.innerHTML = '';
    currentArrayTwo = '';
    documentTwoArray = '';
    fileTwoNameContainer.innerHTML = '';
}

class table{
    constructor(items = [], sortClass){        
        this.items = items;
        this.sortClass = sortClass;
    }

    createTable(){
        var tableObject = new element('table', ["dataTable"], '', null, null);
        var table = tableObject.createElement();
        var tBody = this.createTableBody();
        this.createHeadRow(headRowContents, tBody);
        tBody = this.createDataRow(this.items, tBody);
        appendElements(table, [tBody]);
        return table;
    }

    createTableBody(){
        var tBody = new element('tbody', ["sortable"], '', null, null);
        tBody = tBody.createElement();
        return tBody;
    }
    
    createHeadRow(headRowContents, table){
        var headerRowElementObject = new element('tr', [], '', null, null);
        var headerRowElement = headerRowElementObject.createElement();
        this.createHeadRowCells(headerRowElement, headRowContents);
        appendIconsToCells(headerRowElement, this.sortClass);
        appendElements(table, [headerRowElement]);
        return
    }
    
    createHeadRowCells(headerRowElement, headRowContents){
        headRowContents.forEach(function(entry, index){
            var newCellObject = new element('th', [`column${index+1}`], entry, null, null);
            var newCell = newCellObject.createElement();
            appendElements(headerRowElement, [newCell]);
        });
        return
    }
    
    createDataRow(array, table){
        array.forEach(function(entry){
            var rowElementObject = new element('tr', [], '', null, null);
            var rowElement = rowElementObject.createElement();
            this.createDataRowCells(rowElement, entry); 
            appendIconsToCells(rowElement, this.sortClass);
            appendElements(table, [rowElement]);
        }.bind(this));
        return table;
    }
    
    createDataRowCells(rowElement, entry){
        entry.forEach(function(entry){
            new cellModal([], entry, rowElement);
        });
        new cellModal(['iconCell'], '', rowElement);
        return
    }
}

function renderArrayAsTable(array, tableContainer, sortClass = 'fa-sort-amount-asc'){
    var dataTable = new table(array, sortClass);
    dataTable = dataTable.createTable();
    tableContainer.innerHTML = '';
    appendElements(tableContainer, [dataTable]);
}

class cellModal{
    constructor(className, entry, row){
        this.className = className;
        this.entry = entry;
        this.row = row;
        this.createCell();
    }

    createCell(){
        var cellObject = new element('td', this.className, this.entry, null, null);
        var cell = cellObject.createElement();
        appendElements(this.row, [cell]);
    }
}

class highlight{
    constructor(modifiedArrays, deldetedInTableOne, deldetedInTableTwo, sameElements){
        this.modifiedArrays = modifiedArrays;
        this.deldetedInTableOne = deldetedInTableOne;
        this.deldetedInTableTwo = deldetedInTableTwo;
        this.sameElements = sameElements;
        this.tableOne = tableOneContainer.childNodes[0];
        this.tableTwo = tableTwoContainer.childNodes[0];
        this.highlight();
    }

    highlight(){
        if(compareFlag){
            for(let index=0; index<this.tableOne.rows.length; index++){
                this.tableOne.rows[index].classList.add('default');
            }
            for(let index=0; index<this.tableTwo.rows.length; index++){
                this.tableTwo.rows[index].classList.add('default');
            }
            compareFlag = false;
            return;
        }
        for(let index=0; index<this.tableOne.rows.length; index++){
            var key = this.tableOne.rows[index].cells[0].innerText;
            this.tableOne.rows[index].className = '';
            if(this.modifiedArrays.some(item => item[0]===key)){
                this.tableOne.rows[index].classList.add('modified');
            }
            if(this.deldetedInTableTwo.some(item => item[0]===key)){
                this.tableOne.rows[index].classList.add('deleted');
            }
            if(this.sameElements.some(item => item[0]===key)){
                this.tableOne.rows[index].classList.add('default');
            }
        }
        for(let index=0; index<this.tableTwo.rows.length; index++){
            var key = this.tableTwo.rows[index].cells[0].innerText;
            this.tableTwo.rows[index].className = '';
            if(this.modifiedArrays.some(item => item[0]===key)){
                this.tableTwo.rows[index].classList.add('modified');
            }
            if(this.deldetedInTableOne.some(item => item[0]===key)){
                this.tableTwo.rows[index].classList.add('deleted');
            }
            if(this.sameElements.some(item => item[0]===key)){
                this.tableTwo.rows[index].classList.add('default');
            }
        }
        compareFlag = true;
    }
}

class getCurrentArray{
    constructor(){
        this.arrayOne = [];
        this.arrayTwo = [];
    }

    returnCurrentArray(){
        this.arrayOne = tableToArray(tableOneContainer.childNodes[0]);
        this.arrayTwo = tableToArray(tableTwoContainer.childNodes[0]);
        return ([this.arrayOne, this.arrayTwo]);
    }
}