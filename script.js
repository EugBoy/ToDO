const taskContainer = document.querySelector('.tasks');
const taskForm = document.querySelector('.taskForm');
const filterContainer = document.querySelector('.inputFilter');

let tasks = [];
let filters = {
    'complited': false,
    'high': true,
    'medium': true,
    'low': true,
    'time': true,
    
};
let tasksAmount = tasks.length;
let id = tasksAmount;

function filterTasks(){
    let outputTasks =  JSON.stringify(tasks);
    outputTasks = JSON.parse(outputTasks);
    if (filters.time){
        outputTasks.sort(function(a,b){
            console.log(a.taskDate)
            return 1
        })
    } else {
        outputTasks.sort(function(a,b){
            console.log(a.taskDate)
            return -1
        })
    }
    outputTasks = outputTasks.filter(function(el){
        console.log(el.priority);
        let p = el.priority.toLowerCase();

        console.log(p);

        return filters[p]
    })
    outputTasks = outputTasks.filter(function(el){
        console.log(el.status);
        let c = el.status
        if (c == 'performing' && filters.complited == false){
            return true
        } else if (c != 'performing' && filters.complited){
            return true
        }
        return false
    })
    outputTasks.forEach(createTaskElement)
}

taskForm.onsubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(taskForm);
    const name = formData.get('name');
    const priority = formData.get('priority');
    const changing = false;

    const taskDate = new Date;
    const day = taskDate.getDate();
    const month = String(taskDate.getMonth());
    const year = taskDate.getFullYear();
    const hours = taskDate.getHours();
    const minutes = taskDate.getMinutes();
    const date = day + '/' + month.padStart(2,'0') + '/' +year + ' ' + hours + ':' + minutes;



    const status = "performing";
    const actionDate = "";
    tasksAmount+=1;
    id = tasksAmount;
    
    tasks.push({name, priority, date, status, id, taskDate, actionDate, changing});
    e.target.reset();
    console.log({name, priority, date, status, id, taskDate, actionDate, changing});
    taskContainer.innerHTML = '';
    filterTasks();
    saveData();
}

taskContainer.addEventListener('click', function(e){
    if (e.target.className === "actionDelete"){
        let taskId = e.target.parentElement.parentElement.querySelector('.taskId').innerHTML;
        tasks[taskId-1].status = 'deleted';
        taskContainer.innerHTML = '';
        filterTasks();

    }
    else if (e.target.className === "actionCompleted"){
        let taskId = e.target.parentElement.parentElement.querySelector('.taskId').innerHTML;
        tasks[taskId-1].status = 'completed'

        const taskDate = new Date;
        const day = taskDate.getDate();
        const month = String(taskDate.getMonth());
        const year = taskDate.getFullYear();
        const hours = taskDate.getHours();
        const minutes = taskDate.getMinutes();
        const date = day + '/' + month.padStart(2,'0') + '/' +year + ' ' + hours + ':' + minutes;
        tasks[taskId-1].actionDate = date;
        // tasks[taskId-1].taskDate = taskDate;

        taskContainer.innerHTML = '';
        filterTasks();

    }
    else if (e.target.className === "actionCansel"){
        let taskId = e.target.parentElement.parentElement.querySelector('.taskId').innerHTML;
        tasks[taskId-1].status = 'canceled'

        const taskDate = new Date;
        const day = taskDate.getDate();
        const month = String(taskDate.getMonth());
        const year = taskDate.getFullYear();
        const hours = taskDate.getHours();
        const minutes = taskDate.getMinutes();
        const date = day + '/' + month.padStart(2,'0') + '/' +year + ' ' + hours + ':' + minutes;

        tasks[taskId-1].actionDate = date;
        taskContainer.innerHTML = '';
        filterTasks();

    } 
    else if (e.target.className === "taskName"){
        let taskId = e.target.parentElement.parentElement.querySelector('.taskId').innerHTML;
        tasks[taskId-1].changing = true;
        taskContainer.innerHTML = '';
        filterTasks();

    }
    saveData();
})

filterContainer.addEventListener('click', function(e) {
    let check = document.querySelector('.checkComplited');
    let checkbox = document.querySelectorAll('.checkbox input');
    let caret = document.querySelector('.checkbox img');
    let caretDate = document.querySelector('.checkbox div');
    console.log(checkbox);
    if (e.target = check) {
        if (check.checked){
            filters.complited = true;
            console.log('добавлено');
            taskContainer.innerHTML = '';
            filterTasks();

            
        } else {
            filters.complited = false;
            console.log('удалено');
            taskContainer.innerHTML = '';
            filterTasks();
            
        }
    } 

    if (e.target = checkbox[1]) {
        if (checkbox[1].checked){
            filters.high = true;
            console.log('добавлено');
            taskContainer.innerHTML = '';
            filterTasks();
            
        } else {
            filters.high = false;
            console.log('удалено');
            taskContainer.innerHTML = '';
            filterTasks();
            
        }
    }

    if (e.target = checkbox[2]) {
        if (checkbox[2].checked){
            filters.medium = true;
            console.log('добавлено');
            taskContainer.innerHTML = '';
            filterTasks();
            
        } else {
            filters.medium = false;
            console.log('удалено');
            taskContainer.innerHTML = '';
            filterTasks();
            
        }
    }

    if (e.target = checkbox[3]) {
        if (checkbox[3].checked){
            filters.low = true;
            console.log('добавлено');
            taskContainer.innerHTML = '';
            filterTasks();
            
        } else {
            filters.low = false;
            console.log('удалено');
            taskContainer.innerHTML = '';
            filterTasks();
            
        }
    }
    if ((e.target == caret) || (e.target == caretDate) ) {
        console.log('время')
        if (filters.time){
            filters.time = false;
            console.log('добавлено');
            taskContainer.innerHTML = '';
            filterTasks();
            
            caret.style.transform = 'rotate(180deg)';
            
        } else {
            filters.time = true;
            console.log('удалено');
            taskContainer.innerHTML = '';
            filterTasks();

            caret.style.transform = 'rotate(360deg)';
            
        }
    }
})

function createTaskElement ({name, priority, date, status, id, actionDate, changing}) {
    
    if (status == "deleted"){

    } else if (status == 'performing' && changing == false){
        taskContainer.insertAdjacentHTML('beforeend', 
        `<div class="task">
            <div class="taskInfo">
                <div class="taskName">${name}</div>
                <div class="taskPriority">${priority}</div>
                <div class="taskDate">${date}</div>
                <div class="taskId">${id}</div>
            </div>
            <div class="taskAction">
                <img src="trash.png" alt="" class="actionDelete">
                <img src="check.png" alt="" class="actionCompleted">
                <img src="cross.png" alt="" class="actionCansel">
            </div>
        </div>`);

    } else if (status == 'completed' && changing == false){
        taskContainer.insertAdjacentHTML('beforeend', 
        `<div class="task">
            <div class="taskInfo">
                <div class="taskName">${name}</div>
                <div class="taskPriority">${priority}</div>
                <div class="taskDate">${date}</div>
                <div class="taskDate">Done ${actionDate}</div>
                <div class="taskId">${id}</div>
            </div>
            <div class="taskAction">
                <img src="trash.png" alt="" class="actionDelete">
                
            </div>
        </div>`);

    }   else if (status == 'canceled' && changing == false){
        taskContainer.insertAdjacentHTML('beforeend', 
        `<div class="task">
            <div class="taskInfo">
                <div class="taskName">${name}</div>
                <div class="taskPriority">${priority}</div>
                <div class="taskDate">${date}</div>
                <div class="taskDate">Canceled ${actionDate}</div>
                <div class="taskId">${id}</div>
            </div>
            <div class="taskAction">
                <img src="trash.png" alt="" class="actionDelete"> 
            </div>
        </div>`);
    }   else if (changing == true){
            taskContainer.insertAdjacentHTML('beforeend', 
            `<div class="task">
                <div class="taskInfo">
                    <form class="taskChangeForm">
                        <input type="text" name="name" placeholder="Write new task" autofocus>
                        <button>Change</button>
                    </form>
                    <div class="taskPriority">${priority}</div>
                    <div class="taskDate">${date}</div>
                    <div class="taskId">${id}</div>
                </div>
                
            </div>`);
            let changeBtn = document.querySelector('.taskChangeForm button');
            let changeName = document.querySelector('.taskChangeForm input');
            console.log(changeBtn, changeName);
            changeBtn.addEventListener('click',(e) => {
                e.preventDefault();
                const newName = changeName.value;
                tasks[id-1].name = newName;
                tasks[id-1].changing = false;
                taskContainer.innerHTML = '';
                filterTasks();



            } )
    }

}






function saveData (){
    localStorage.setItem('taskData', JSON.stringify(tasks));
    localStorage.setItem('taskHTML', taskContainer.innerHTML);

}

function showData(){
    if (JSON.parse(localStorage.getItem('taskData')) == null){
        tasks = []
    } else {
        tasks = JSON.parse(localStorage.getItem('taskData'))
    };
    taskContainer.innerHTML = localStorage.getItem('taskHTML');
    tasksAmount = tasks.length;
    id = tasksAmount;
    
    

}

showData();


