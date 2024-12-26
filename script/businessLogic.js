class modifyTable{
    constructor(row){        
        this.row = row;
    }

    getCurrentRow(currentRow){
        var row ={};
        row.eventTarget = currentRow.eventTarget;
        row.key = currentRow.key;
        row.value = currentRow.value;
        return row;
    }

    addNewRow(){
        var row = this.getCurrentRow(this.row);
        var array = tableToArray(currentTable)
        array.push([row.key, row.value]);
        return renderArrayAsTable(array, currentTable.parentNode);
    }

    editExistingRow(){
        var row = this.getCurrentRow(this.row);
        var array = tableToArray(currentTable);
        for(let index=0; index<array.length; index++){
            if(array[index][0]==row.key){
                array[index][1] = row.value;
            } 
        }
        return renderArrayAsTable(array, currentTable.parentNode);
    }

    deleteExistingRow(){
        var row = this.getCurrentRow(this.row);
        var array = tableToArray(currentTable);
        for(let index=0; index<array.length; index++){
            if(array[index][0]==row.key && array[index][1]==row.value){
                array.splice(index, 1);
            }
        }
        return renderArrayAsTable(array, currentTable.parentNode);
    }
}

class compareArrays{
    constructor(arrayOne, arrayTwo){
        this.arrayOne = arrayOne;
        this.arrayTwo = arrayTwo;
    }

    compare(){
        let modifiedArrays = [];
        let deldetedInTableTwo = [];
        let deldetedInTableOne = [];
        let sameElements = [];
        const mapOne = new Map(this.arrayOne);
        const mapTwo = new Map(this.arrayTwo);
        for(let index=0; index<this.arrayTwo.length; index++){
            const [keyTwo, valueTwo] = this.arrayTwo[index];
            if(mapOne.has(keyTwo)){
                const valueOne = mapOne.get(keyTwo);
                valueOne!==valueTwo ? modifiedArrays.push([keyTwo, valueTwo]) : sameElements.push([keyTwo, valueTwo]);
            }
            else{
                deldetedInTableOne.push([keyTwo, valueTwo]);
            }
        }
        for(let index=0; index<this.arrayOne.length; index++){
            const [keyOne, valueOne] = this.arrayOne[index];
            if(!mapTwo.has(keyOne)){
                deldetedInTableTwo.push([keyOne, valueOne]);
            }
        }
        return [modifiedArrays, deldetedInTableOne, deldetedInTableTwo, sameElements];
    }
}

class sort{
    constructor(array){
        this.array = array;
    }

    ascending(){
        this.array.sort((a, b) => a[0].localeCompare(b[0]));
        return this.array;
    }

    descending(){
        this.array.sort((a, b) => b[0].localeCompare(a[0]));
        return this.array;
    }
}

class move{
    constructor(arrayOne, arrayTwo){
        this.arrayOne = arrayOne;
        this.arrayTwo = arrayTwo;
    }

    moveAllToRight(){
        var copiedArray = this.arrayOne;
        return copiedArray;
    }

    moveAllToLeft(){
        var copiedArray = this.arrayTwo;
        return copiedArray;
    }

    equalize(){
        if(this.arrayOne==[] || this.arrayTwo==[]){
            alert('Upload two valid JSON files to cpmpare');
            return false;
        }
        return this.getDeletedArrays();
    }

    getDeletedArrays(){
        var keysOfArrayTwo = new Set();
        for(var index=0; index<this.arrayTwo.length; index++){
            var key = this.arrayTwo[index][0];
            keysOfArrayTwo.add(key);
        }

        var deletedRows=[];
        for(var index=0; index<this.arrayOne.length; index++){
            var key = this.arrayOne[index][0];
            if(!keysOfArrayTwo.has(key)){
                var deletedRow = this.arrayOne[index];
                deletedRows.push(deletedRow);
            }
        }
        return deletedRows;
    }
}

class update{
    constructor(arrayOne, arrayTwo){
        this.arrayOne = arrayOne;
        this.arrayTwo = arrayTwo;
    }

    updateArray(){
        currentArrayOne = this.arrayOne;
        currentArrayTwo = this.arrayTwo;
    }
}

function tableToArray(table){
    if(table==null || table==undefined){return;}
    var array=[];
    var rows = table.rows;
    for(var index=1; index<rows.length; index++){
        array[index-1] = [];
        var key = rows[index].cells[0].textContent;
        var value = rows[index].cells[1].textContent;
        if(value==''){value = null};
        array[index-1][0] = key;
        array[index-1][1] = value;
    }
    return array;
}

function arrayContentToJson(array){
    var fileObject = Object.fromEntries(array);
    var fileJson = JSON.stringify(fileObject, null, 2);
    return fileJson;
}

function convertJsonToArray(fileContent){
    var fileAsJson = fileContent.trim();
    var fileAsObject = JSON.parse(fileAsJson);
    var fileAsArray = Object.entries(fileAsObject);
    return fileAsArray;
}

function updateArray(arrayOne, arrayTwo){
    var updateArray = new update(arrayOne, arrayTwo);
    updateArray.updateArray();
}

function pushAndPop(pushIn, popOut, lastSavedArray, currentArray){
    if(popOut.length){
        pushIn.push(currentArray);
        let array = popOut.pop();
        return array;
    }
    return lastSavedArray
}


function undoRedoObjectHandler(element){
    var object;
    getAndUpdateCurrentArrays();
    if(element==undoFileOne || element==redoFileOne){
        object = {
            undoStack : undoStackOne,
            redoStack : redoStackOne,
            currentArray : currentArrayOne,
            lastSavedArray : lastSavedArrayOne
        }
    }
    else{
        object = {
            undoStack : undoStackTwo,
            redoStack : redoStackTwo,
            currentArray : currentArrayTwo,
            lastSavedArray : lastSavedArrayTwo
        }
    }
    return object;
}

function getLastState(e){
    var target = e.target;
    var classNames = e.target.classList;
    var object = undoRedoObjectHandler(target);
    var array = classNames.contains('undo') ? pushAndPop(object.redoStack, object.undoStack, object.lastSavedArray, object.currentArray) : pushAndPop( object.undoStack, object.redoStack, object.lastSavedArray);
    renderArrayAsTable(array,  target.parentNode.parentNode.childNodes[1].childNodes[0]);
}


function cancelDeletion(){
    alertBox.innerHTML = '';
    alertBox.classList.remove('show');
}

function proceedDeletion(){
    getAndUpdateCurrentArrays();
    updateUndoStack();
    currentTable = currentRow.parentNode.parentNode;
    var rowObject = {
        eventTarget : null,
        key : currentRow.childNodes[0].textContent,
        value : currentRow.childNodes[1].textContent
    }
    var deleteRow = new modifyTable(rowObject);
    deleteRow.deleteExistingRow();
    cancelDeletion();
    getAndUpdateCurrentArrays();
}

function deleteRow(btn){
    if(!btn.classList.contains('deleteBtn')){return;}
    currentRow = btn.parentNode.parentNode;
    createDeleteConfirmation();
}

function downloadFile(array){
    var jsonContent = arrayContentToJson(array);
    var fileAsObject = JSON.parse(jsonContent);
    var jsonFormat = JSON.stringify(fileAsObject, null, 2);
    var blob = new Blob([jsonFormat], {type: "application/json;charset=utf-8"});
    var link = document.createElement('a');
    link.download = 'jsonfile.json';
    link.href = window.URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.removeChild(link);
}

function moveArrayHandler(e){
    var array = new move(currentArrayOne, currentArrayTwo);
    e.target==moveToLeft ? array = array.moveAllToLeft() : array = array.moveAllToRight();
    var tableContainer = e.target==moveToLeft ? tableOneContainer : tableTwoContainer
    renderArrayAsTable(array, tableContainer);
    getAndUpdateCurrentArrays();
    return
}

function getAndUpdateCurrentArrays(){
    var currentArrays = new getCurrentArray();
    currentArrays = currentArrays.returnCurrentArray();
    var updateArray = new update(currentArrays[0], currentArrays[1]);
    updateArray.updateArray();
}

function saveFile(e){
    var value = e.target;
    var tableElement =  value.parentNode.parentNode.lastChild.firstChild.childNodes[0];
    value==saveFileOne ? lastSavedArrayOne = tableToArray(tableElement) : lastSavedArrayTwo = tableToArray(tableElement);
}

function sortIconClick(icon){
    var array;
    var sortedArray;
    icon.parentNode.parentNode.parentNode.parentNode.parentElement == tableOneContainer ? array = currentArrayOne : array = currentArrayTwo;
    var arraySorter = new sort(array);
    if(icon.classList.contains('fa-sort-amount-asc')){
        sortedArray = arraySorter.ascending();
        var classToAdd = 'fa-sort-amount-desc';
        renderArrayAsTable(sortedArray, icon.parentNode.parentNode.parentNode.parentNode.parentElement, classToAdd);
    }
    else if(icon.classList.contains('fa-sort-amount-desc')){
        sortedArray = arraySorter.descending();
        var classToAdd = 'fa-sort-amount-asc';
        renderArrayAsTable(sortedArray, icon.parentNode.parentNode.parentNode.parentNode.parentElement, classToAdd);
    }
}

function compareTables(){
    getAndUpdateCurrentArrays();
    if((currentArrayOne==undefined || currentArrayOne==[]) || (currentArrayTwo==undefined || currentArrayTwo==[])){
        alert("Upload two valid JSON files to compare.");
        return
    }
    var compareInstance = new compareArrays(currentArrayOne, currentArrayTwo);
    var [modifiedArrays, deldetedInTableOne, deldetedInTableTwo, sameElements] = compareInstance.compare();
    new highlight(modifiedArrays, deldetedInTableOne, deldetedInTableTwo, sameElements);
}

function copyFileHandler(array){
    var jsonFormat = arrayContentToJson(array);
    copyToClipboard(jsonFormat);
}

function updateUndoStack(){
    undoStackOne.push(currentArrayOne);
    undoStackTwo.push(currentArrayTwo);
}

function copyFile(e){
    var icon = e.target;
    var currentArray = new getCurrentArray();
    currentArray = currentArray.returnCurrentArray();
    if(icon==copyFileOne){
        return copyFileHandler(currentArray[0]);
    }
    return copyFileHandler(currentArray[1]);
}