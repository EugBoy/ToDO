const taskContainer = document.querySelector('.tasks');
const taskForm = document.querySelector('.task-form');
const filterContainer = document.querySelector('.input-filter');
const url = 'http://127.0.0.1:3000/items';

let tasks = [];

async function postData(data) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data) 
    }).then(() => getData())
}

async function getData() {
    const response = await fetch(url);
    tasks = await response.text();
    tasks = JSON.parse(tasks);
    taskContainer.innerHTML = '';
    filterTasks();
}

async function deleteData(id) {
    const response = await fetch(url+'/'+id, {
      method: 'DELETE',
    }).then(() => getData())
}

async function putData(id, data){
    const response = await fetch(url+'/'+id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then(() => getData())
}

let filters = {
    'completed': false,
    'high': false,
    'medium': false,
    'low': false,
    'time': true,    
};

function filterTasks(){
    let outputTasks =  structuredClone(tasks);
    outputTasks.sort(() => (filters.time) ? 1 : -1 )
    outputTasks = outputTasks.filter(function(el){
        let p = el.priority.toLowerCase();
        let s = el.status.toLowerCase();
        if (filters.completed){
            if (filters.high || filters.medium || filters.low){
                return filters[p] && (s === "completed")   
            } else {
                return s == "completed"
            }
        } else {
            if (filters.high || filters.medium || filters.low){      
                return filters[p]
            } else{
                return true
            }
        }   
    })
    outputTasks.forEach(createTaskElement)
}

function newTask (e){
    const name = taskForm.querySelector('input').value;
    if (name === ''){
        alert('Give name to task')
    } else {    
        const priority = taskForm.querySelector('select').value;
        const changing = false;
        const date = new Date().toLocaleString('ru-RU');
        const status = "performing";
        const actionDate = "";
        postData({name, priority, status, date, actionDate, changing});
        taskForm.querySelector('input').value ='';
    }
}

function deleteTask(taskId){
    deleteData(taskId);
    getData();
}

function completeTask(taskId){
    const date = new Date().toLocaleString('ru-RU');
    putData(taskId, {'status':'completed', 'actionDate': date});
}

function canselTask(taskId){
    const date = new Date().toLocaleString('ru-RU');
    putData(taskId, {'status':'canceled', 'actionDate': date});
}

function changeTask(taskId){
    putData(taskId, {'changing': true});
}

function newFilter(e){
    let inputValue = e.value;;
    filters[inputValue] = e.checked;
    taskContainer.innerHTML = '';
    filterTasks();
}

function timeFilter(){
    let caret = document.querySelector('.img-filter');
    if (filters.time){
        filters.time = false;
        taskContainer.innerHTML = '';
        caret.style.transform = 'rotate(180deg)';
    } else {
        filters.time = true;
        taskContainer.innerHTML = '';
        caret.style.transform = 'rotate(360deg)';      
    }
    filterTasks();
}

function createTaskElement({name, priority, date, status, id, actionDate, changing}){
    let color = 'green';
    if (priority.toLowerCase() == 'high'){
        color = 'red'
    } else if (priority.toLowerCase() == 'medium'){
        color = 'yellow'
    }
    if (changing){
        taskContainer.insertAdjacentHTML('beforeend', 
        `<div class="task">
            <div class="task-info">
                <form class="task-change-form">
                    <input  type="text" 
                            name="name" 
                            placeholder="${name}" 
                            autofocus>
                    <button onclick='change(this, ${id})'>
                        Change
                    </button>
                </form>
                <div class="task-priority">
                    ${priority}
                </div>
                <div class="task-date">
                    ${date}
                </div>
            </div>        
        </div>`);        
    } else {
        taskContainer.insertAdjacentHTML('beforeend', 
        `<div class="task">
            <div class="task-info">
                <div    class="task-name" 
                        onclick="changeTask(${id})">
                    ${name}
                </div>
                <div class="task-priority ${color}">
                    ${priority}
                </div>
                <div class="task-date">
                    ${date}
                </div>
                ${(actionDate != '') ? `<div class="task-date">
                    ${status == 'completed' ? 'Done ' : 'Canceled '}${actionDate}
                </div>` : ''}
            </div>
            <div class="task-action">
                <img    src="trash.png" 
                        onclick="deleteTask(${id})" 
                        alt="" class="action-delete">
                    ${(actionDate == '') ? `<img    src="check.png" 
                                                    onclick="completeTask(${id})" 
                                                    alt="" class="action-completed">
                                            <img    src="cross.png" 
                                                    onclick="canselTask(${id})" 
                                                    alt="" class="action-cansel">` : ''}
                
            </div>
        </div>`);
    }
}

function change(el,id){
    let changeForm = el.parentNode;
    let newName = changeForm.querySelector('input').value;
    if (newName === ''){
        alert('Rename task');
        tasks[findIndex(id)].changing = false;
        taskContainer.innerHTML = ''; 
        putData(id, {'changing': false});
    } else {
        tasks[findIndex(id)].name = newName;
        tasks[findIndex(id)].changing = false;
        taskContainer.innerHTML = '';
        putData(id, {'changing': false, 'name': newName})
    }
}

getData();

function findIndex(id){
    let index = 0;
    for (task of tasks){
        if (task.id == id){
            return index
        } else {
            index++
        }
    }
}


