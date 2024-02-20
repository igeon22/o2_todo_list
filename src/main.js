// import { log } from 'util';

import './style.css';
const { format } = require('date-fns');
const { v4: uuidv4 } = require('uuid');


function sidebardShowHide(){
    document.querySelector(".sidebar").classList.toggle("show");
}

function formShowHide(){
    document.querySelector(".new-task").classList.toggle("hd");
}

let sideOpenBtn = document.querySelector(".side-btn-sh");
let sideCloseBtn = document.querySelector(".state");
let formOpenBtn = document.querySelector("#add-task");
let formCloseBtn = document.querySelector(".closeform");

// console.log(sideBtn);
sideOpenBtn.addEventListener("click",()=>{
    sidebardShowHide();
});
sideCloseBtn.addEventListener("click",()=>{
    sidebardShowHide();
});

formOpenBtn.addEventListener("click",()=>{
    formShowHide();
});

formCloseBtn.addEventListener("click",()=>{
    formShowHide();
});


class Project{
    constructor(name){
        this.name = name;
        this.content = [];
    }
    deleteContent = (id)=>{
        this.content.forEach((item,index)=>{
            if(id  === item.id){
                this.content.splice(index,1);
            }
        });
    };

    

    
}

class Task{
    constructor(name,date,isActive,projectName,id){
        this.name = name;
        this.date = date;
        this.isActive = isActive;
        this.id = id;
    }
}

class Program{
    constructor(){
        this.projects = [];
        this.homebtn();
        this.projects.push( new Project("Home"));
        this.handletaskForm();
        this.handleForm();
        this.loadFromLocalStorage();
        this.loadProject("Home");
        this.currentProject = undefined;
        
    };

    homebtn(){
        let homeBtn = document.querySelector(".home");
        homeBtn.addEventListener("click",()=>{
            this.loadProject(homeBtn.textContent);
        });
    }

    
    create(elementParent,elementType,elementClass,ElementContent){
        let element;
        element = document.createElement(elementType);
        if(elementClass != ""){
            element.classList.add(elementClass);
        }
    
        if(ElementContent != ""){
            element.textContent = ElementContent;
        }
    
        elementParent.appendChild(element);
        return element;
    }


    handleForm = ()=>{
        let projectTitleForm = document.querySelector(".add-form");
        let projectTitleField = document.querySelector("#project-title");
        let projectTitleSubmit = document.querySelector("#submit-project-title");
        projectTitleSubmit.addEventListener("click",(event)=>{
            if(projectTitleForm.checkValidity()){
                event.preventDefault();
                this.projects.push(new Project(projectTitleField.value))
                projectTitleField.value = "";
                this.generateProjectsButtons();
                this.saveToLocalStorage()
            };
        });
    };

    saveToLocalStorage(){
        localStorage.setItem("data",JSON.stringify(this.projects));
    }

    loadFromLocalStorage(){
        if(localStorage.getItem("data")){
            let tmpdata = [];
            let datas = JSON.parse(localStorage.getItem("data"));
            datas.forEach((data)=>{
                let r = new Project(data.name);
                r.content = data.content;
                tmpdata.push(r);
                const loadedProject = data;
            });
            
            this.projects = tmpdata;
            this.generateProjectsButtons()
        }
    }

    insertTask(projectName,task){
        this.projects.forEach((project)=>{
            if(projectName === project.name){
                project.content.push(task);
            }
        });
    }

    handletaskForm(){
        let form = document.querySelector(".add-task-cont");
        let formContainer = document.querySelector("#task-form");
        let name = document.querySelector("#task-txt");
        let date = document.querySelector("#task-date");
        let projectName = document.querySelector("#project-name");

        form.addEventListener("click",(event)=>{
            if(form.checkValidity()){
                event.preventDefault();
                formContainer.classList.toggle("hd");
                let task = new Task(name.value,date.value,false,projectName.value,uuidv4());
                this.insertTask(projectName.value,task);
                name.value = "";
                date.value = "";

                this.loadProject(projectName.value)
                this.saveToLocalStorage()
            }
        });
    }

    loadProject = (name)=>{
        let titleField = document.querySelector("#main-title");
        titleField.textContent = name;
        
        this.loadTasks(name);
    }


    getTodayDate(){
        const today = new Date();

        const formattedDate = format(today, 'yyyy-MM-dd');
        
        return formattedDate;

    }

    

    loadTasks(name){
        this.projects.forEach((project)=>{
            if(project.name === name){
                let taskContainer = document.querySelector(".all-tasks");
                taskContainer.innerHTML = "";
                this.currentProject = name;
                project.content.forEach((content)=>{
                    let taskBlock = this.create(taskContainer,"div","task-block");
                    let taskName = this.create(taskBlock,"p","text",content.name);
                    let taskDate = this.create(taskBlock,"p","date",content.date);
                    if(content.date === this.getTodayDate()){
                        taskDate.style.color = "red"
                    }
                    let taskDone = this.create(taskBlock,"input","complete-mark");
                    taskDone.checked = content.isActive;
                    
                    if(taskDone.checked === true){
                        taskName.style.textDecoration = "line-through"
                    }else{
                        taskName.style.textDecoration = ""
                    }
                    taskDone.addEventListener("click",()=>{
                        content.isActive = taskDone.checked;

                        if(taskDone.checked === true){
                            taskName.style.textDecoration = "line-through"
                        }else{
                            taskName.style.textDecoration = ""
                        }
                        this.saveToLocalStorage();
                    })
                    taskDone.name = "complete"
                    taskDone.type = "checkbox"
                    let taskDelete = this.create(taskBlock,"button","delete","Delete Task");

                    taskDelete.addEventListener("click",()=>{
                        project.deleteContent(content.id);
                        this.loadTasks(name)
                        this.saveToLocalStorage();
                    })
                });
            };
        });
    }


    

    generateProjectsButtons = ()=>{
        let buttonsContainer = document.querySelector(".all-projects");
        let selectContainer = document.querySelector("#project-name");
        selectContainer.innerHTML = "";
        let homeSelect = this.create(selectContainer,"option","","Home");
        homeSelect.value = "Home"
        

        buttonsContainer.innerHTML = "";
        for(let i = 1; i<this.projects.length;i++){
            let projectButton = this.create(buttonsContainer,"button","side-btn",this.projects[i].name); 
            projectButton.addEventListener("click",()=>{
                this.loadProject(projectButton.textContent);
            });

            let select = this.create(selectContainer,"option","",this.projects[i].name);
            select.value = this.projects[i].name;
        };
    };
    

}










let user = new Program();
user.handleForm()