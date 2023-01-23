const linkInput = document.querySelector("#link-input")
const tagInput = document.querySelector("#tag-input")
const renderBox = document.querySelector("#render-box")
const saveButton = document.querySelector("#save-btn") 
const addButton = document.querySelector("#add-btn") 
const deleteButton = document.querySelector("#delete-btn") 
const tagAlert=document.querySelector("#tag-alert")
const linkAlert=document.querySelector("#link-alert")
//let link=[{"just links" : ["www.google.com","www.netflix.com"]},{"just links 2": ["www.amazon.com","www.amazonvideo.com"]}];//array which contains objects with key as product names and value as array of links
let link=JSON.parse( localStorage.getItem("myLinks") )?JSON.parse( localStorage.getItem("myLinks") ):[];
render(link)
//function to render out the Links
function render(dispArray){
    let str=""
    for(let i=0;i<dispArray.length;i++){
        let strTemp="";
        let keys=Object.keys(dispArray[i])
        strTemp=`<hr><h3 class='tag-heading'>${keys}</h3>`;
        let linkValue=Object.values(dispArray[i])
        let linkArray=linkValue[0];
        for(let j=0;j<linkArray.length;j++){
            strTemp+=`<li><a target="_blank" href='${linkArray[j]}'>${linkArray[j]}</a></li>`
        }
        str+=strTemp;
    }
    renderBox.innerHTML=str
}
//function when the add button is clicked
addButton.addEventListener("click",function(){
    let keys
    let tagValue=tagInput.value
    let linkValue=linkInput.value
    //if any of the fields is not present then creating alert
    if(!tagValue){
        displayAlert(tagAlert)
    }
    if(!linkValue){
        displayAlert(linkAlert)
    }
    //executing only if both the values are present
    if(tagValue && linkValue){
        let flag=0 // to check if the tag is present
        for(let i=0;i<link.length;i++){
            keys=Object.keys(link[i])
            if(keys[0]==tagValue){
                let LinkArray=Object.values(link[i]);
                LinkArray[0].push("https://" + linkValue);
                flag=1 // the tag is present
                break
            }
        }//if the tag is not present
        if(flag==0){
            let objTemp={}
            objTemp[tagValue]= ["https://"+linkInput.value];
            link.push(objTemp)
        }
        //Rendering from local storage
        localStorage.setItem("myLinks",JSON.stringify(link))
        let linkFromStorage=JSON.parse( localStorage.getItem("myLinks") )
        //removing alerts if any 
        removeAlert(tagAlert)
        removeAlert(linkAlert)
        //clearing the input field
        tagInput.value=""
        linkInput.value=""
        render(linkFromStorage)
    }
})

//triggering function when save button is clicked 
saveButton.addEventListener("click",function(){
    let keys
    let tagValue=tagInput.value
    if(!tagValue){
        displayAlert(tagAlert)
    }
    else{
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            let flag=0 // to check if the tag is present
            for(let i=0;i<link.length;i++){
                keys=Object.keys(link[i])
                if(keys[0]==tagValue){
                    let LinkArray=Object.values(link[i]);
                    LinkArray[0].push(tabs[0].url);
                    flag=1 // the tag is present
                    break
                }
            }//if the tag is not present
            if(flag==0){
                let objTemp={}
                objTemp[tagValue]= [tabs[0].url];
                link.push(objTemp)
            }
            //updating in the local storage
            localStorage.setItem("myLinks", JSON.stringify(link) )
            let linkFromStorage=JSON.parse( localStorage.getItem("myLinks") )
            //removing alerts if any 
            removeAlert(tagAlert)
            //clearing the input field
            tagInput.value=""
            render(linkFromStorage)
        })
    }
})
deleteButton.addEventListener('click',function(){
    console.log("hi")
    localStorage.clear();
    link=[];
    window.alert("The message is delted");
    render(link)
})
function displayAlert(htmlEl){
    htmlEl.style.display='block'
}
function removeAlert(htmlEl){
    htmlEl.style.display='none'
}