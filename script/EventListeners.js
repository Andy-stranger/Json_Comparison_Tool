function eventForEqualizer(){
    getAndUpdateCurrentArrays();
    if((currentArrayOne==undefined || currentArrayOne==[]) || (currentArrayTwo==undefined || currentArrayTwo==[])){
        alert("Upload two valid JSON files to compare.");
        return
    }
    var deletedRowsInTableOne = new move(currentArrayTwo, currentArrayOne);
    deletedRowsInTableOne = deletedRowsInTableOne.equalize();
    var deletedRowsInTableTwo = new move(currentArrayOne, currentArrayTwo);
    deletedRowsInTableTwo = deletedRowsInTableTwo.equalize();
    var tableInstance = new table();
    tableInstance.createDataRow(deletedRowsInTableOne, tableOneContainer.firstElementChild);
    tableInstance.createDataRow(deletedRowsInTableTwo, tableTwoContainer.firstElementChild);
    getAndUpdateCurrentArrays();
    updateUndoStack();
}

function eventForEditModalClose(){
    keyInputElement.disabled = false;
    keyInputElement.value = '';
    valueInputElement.value = '';
    hideElement(modal);
}

function eventForAddRowConfirm(e){
    getAndUpdateCurrentArrays();
    updateUndoStack();
    var add = {
        eventTarget : e.target,
        key : keyInputElement.value,
        value : valueInputElement.value
    }
    var rowToAdd = new modifyTable(add);
    rowToAdd.addNewRow();
    editModalClose.click();
    e.preventDefault();
}

function eventForSaveChangesOnEdit(e){
    getAndUpdateCurrentArrays();
    updateUndoStack();
    var edit = {
        eventTarget : e.target,
        key : keyInputElement.value,
        value : valueInputElement.value
    }
    var rowToEdit = new modifyTable(edit);
    rowToEdit.editExistingRow();
    editModalClose.click();
    e.preventDefault();
}

function eventForFilterModal(){
    hideElement(filterModalOne);
    hideElement(filterModalTwo);
}

function eventForFileInput(e){
    var elementClicked = e.target;
    const fileName = elementClicked.value.split('\\').pop();
    fileInputHandler(fileName, e);
}

let clickEventListeners = new Map();
clickEventListeners.set(uploadElementFileOne, (e) => uploadHandler(e));
clickEventListeners.set(uploadElementFileTwo, (e) => uploadHandler(e));
clickEventListeners.set(moveToLeft, (e) => moveArrayHandler(e));
clickEventListeners.set(moveToRight, (e) => moveArrayHandler(e));
clickEventListeners.set(equalizer, (e) => eventForEqualizer());
clickEventListeners.set(editModalClose, (e) => eventForEditModalClose());
clickEventListeners.set(addRowConfirm, (e) => eventForAddRowConfirm(e));
clickEventListeners.set(saveChangesOnEdit, (e) => eventForSaveChangesOnEdit(e));
clickEventListeners.set(saveFileOne, (e) => saveFile(e));
clickEventListeners.set(saveFileTwo, (e) => saveFile(e));
clickEventListeners.set(resetFileOne, (e) => renderArrayAsTable(lastSavedArrayOne, e.target.parentNode.parentNode.childNodes[1].childNodes[0]));
clickEventListeners.set(resetFileTwo, (e) => renderArrayAsTable(lastSavedArrayTwo, e.target.parentNode.parentNode.childNodes[1].childNodes[0]));
clickEventListeners.set(undoFileOne, (e) => getLastState(e));
clickEventListeners.set(undoFileTwo, (e) => getLastState(e));
clickEventListeners.set(redoFileOne, (e) => getLastState(e));
clickEventListeners.set(redoFileTwo, (e) => getLastState(e));
clickEventListeners.set(downloadFileOne, (e) => downloadFile(lastSavedArrayOne));
clickEventListeners.set(downloadFileTwo, (e) => downloadFile(lastSavedArrayTwo));
clickEventListeners.set(filterFileOne, (e) => toggleElement(filterModalOne));
clickEventListeners.set(filterFileTwo, (e) => toggleElement(filterModalTwo));
clickEventListeners.set(filterButtonOne, (e) => toggleElement(filterDropdownDivOne));
clickEventListeners.set(filterButtonTwo, (e) => toggleElement(filterDropdownDivTwo));
clickEventListeners.set(filterModalOne, (e) => eventForFilterModal());
clickEventListeners.set(filterModalTwo, (e) => eventForFilterModal());
clickEventListeners.set(fileInputElementOne, (e) => true);
clickEventListeners.set(fileInputElementTwo, (e) => true);
clickEventListeners.set(addRowToTable, (e) => true);
clickEventListeners.set(editCurrentRow, (e) => true);
clickEventListeners.set(deleteCurrentRow, (e) => true);
clickEventListeners.set(compare, (e) => compareTables());
clickEventListeners.set(sortIcon, (e) => true);
clickEventListeners.set(copyFileOne, (e) => copyFile(e));
clickEventListeners.set(copyFileTwo, (e) => copyFile(e));
clickEventListeners.set(clearFileOne, (e) => clearFile(e));
clickEventListeners.set(clearFileTwo, (e) => clearFile(e));

let changeEventListeners = new Map();
changeEventListeners.set(fileInputElementOne, (e) => eventForFileInput(e));
changeEventListeners.set(fileInputElementTwo, (e) => eventForFileInput(e));

window.addEventListener('DOMContentLoaded', function(){
    this.document.addEventListener('click', function(e){
        var elementClicked = e.target;
        var eventFunction = clickEventListeners.get(elementClicked);
        if(eventFunction==undefined){return;}
        eventFunction(e);
    });
    this.document.addEventListener('change', function(e){
        var elementClicked = e.target;
        let eventFunction = changeEventListeners.get(elementClicked);
        if(eventFunction==undefined){return;}
        eventFunction(e);
    });
});