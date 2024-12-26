function createHtmlElement(element){
    const htmlElement = document.createElement(element.tagname);
    if(element.classes!=[]){
        element.classes.forEach(function(classname){
            htmlElement.classList.add(classname);
        });
    }
    if(element.content){
        htmlElement.appendChild(document.createTextNode(element.content));
    }
    if(element.events!=[] && element.eventCallBack!=[]){
        element.events.forEach(function(event, index){
            htmlElement.setAttribute(event, element.eventCallBack[index]);
        });
    }
    return htmlElement;
}
function appendChidElement(parent, child){
    child.forEach(childData => {
        const childElement = createHtmlElement(childData);
        parent.appendChild(childElement);
        if(childData.children != []){
            appendChidElement(childElement, childData.children)
        }
    });
}
var setOfChildrens = jsonAsObject.body;
appendChidElement(document.body, setOfChildrens);