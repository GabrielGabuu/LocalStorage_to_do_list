//Aqui é onde fica as tarefas criadas
let taskList = [];

//DOM
const taskForm = document.getElementById('taskForm');
const todoInput = document.getElementById('taskInput');
const todoList = document.getElementById('todo-list');
const editForm = document.getElementById('edit-form');
const editInput = document.getElementById('edit-input');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const superFiltro = document.getElementById('filtro');
const searchForm = document.querySelector('#search');
const searchInput = document.querySelector('#search-input');
const filterSelect = document.querySelector('#filter-select');

let oldInput;

//LocalStorage Começa aqui
const saveToLocalStorage = () => {
    localStorage.setItem('taskList', JSON.stringify(taskList));
};

// Função para carregar do Local Storage
const loadFromLocalStorage = () => {

    const storedTaskList = localStorage.getItem('taskList');

    if (storedTaskList) {
        taskList = JSON.parse(storedTaskList);

        todoList.innerHTML = '';

        taskList.forEach(({ text, isDone, isEditing }) => {
            addTaskToDOM(text, isDone);
            if (isEditing) {
                toggleForms();
                editInput.value = text;
                oldInput = text;
            }
        });
    }
};

//Fim das funções do Local Storage
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
});

// Adicionar tarefa ao DOM sem duplicação
const addTaskToDOM = (text, isDone = false, ) => {
    const existingTasks = document.querySelectorAll('.todo h3');
    for (const task of existingTasks) {
        if (task.innerText === text) {
            return;  
        }
    }

    const taskElement = document.createElement("div");
    taskElement.classList.add("todo");

    const taskTitle = document.createElement("h3");
    taskTitle.innerText = text;
    taskElement.appendChild(taskTitle);

    if (isDone) {
        taskElement.classList.add("done");
    }

    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    taskElement.appendChild(doneBtn);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    taskElement.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-todo");
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    taskElement.appendChild(deleteBtn);

    todoList.appendChild(taskElement);
};

const saveTask = (text, isDone = false, isEditing = false) => {

    const task = {text, isDone, isEditing };
    
    
    addTaskToDOM(text)

    todoInput.value = '';
    todoInput.focus();
   
    taskList.push(task);
    saveToLocalStorage();
};

//Atualiza a tarefa após editar
const updateTask = (text) => {
    const tasks = document.querySelectorAll(".todo");
    
    tasks.forEach((todo) => {
        let taskTitle = todo.querySelector("h3");
        
        if (taskTitle) {
            if (taskTitle.innerText === oldInput) {
                taskTitle.innerText = text;
            }
        }
    });
}

//Atualizar as funções no Storage
const updateTaskListInStorage = () => {
    taskList = [];
    const tasks = document.querySelectorAll('.todo');
    
    tasks.forEach((task) => {
        const taskTitleElement = task.querySelector('h3');
        const isDone = task.classList.contains('done');
        const isEditing = task.classList.contains('edit');
        
        if (taskTitleElement) {
            const text = taskTitleElement.innerText;
            taskList.push({ text, isDone, isEditing });
        }
    });
    
    saveToLocalStorage();
};



taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const inputValue = todoInput.value;
    
    
    if (inputValue) {
        saveTask(inputValue);
    }
});



//Logica do filtro por pesquisa
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const searchTerm = searchInput.value.toLowerCase();
    const tasks = document.querySelectorAll('.todo');
    
    tasks.forEach((task) => {
        const taskTitleElement = task.querySelector('h3');
        
        if (taskTitleElement) {
            const taskTitle = taskTitleElement.innerText.toLowerCase();
            
            if (taskTitle.includes(searchTerm)) {
                task.style.display = 'flex';
            } else {
                task.style.display = 'none';
            }
            
        } 
        
        
    });
    
});

//Logica do filtro
filterSelect.addEventListener('change', () => {
    const filterValue = filterSelect.value;
    const tasks = document.querySelectorAll('.todo');
    
    tasks.forEach((task) => {
        const isDone = task.classList.contains('done');
        if ((filterValue === 'all') ||
        (filterValue === 'done' && isDone) ||
        (filterValue === 'todo' && !isDone)) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    });
});


document.addEventListener("click", (e) => {
    const targetEl = e.target;
    const parentEl = targetEl.closest("div");
    let taskTitle;
    
    if (parentEl && parentEl.querySelector("h3")) {
        taskTitle = parentEl.querySelector("h3").innerText;
    }
    
    if (targetEl.classList.contains("finish-todo")) {
        parentEl.classList.toggle("done");
        updateTaskListInStorage();
    }
    
    if (targetEl.classList.contains("remove-todo")) {
        parentEl.remove();
        updateTaskListInStorage();
    }
    
    if (targetEl.classList.contains("edit-todo")) {
        toggleForms();
        editInput.value = taskTitle;
        oldInput = taskTitle;
    }
});


cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault()
    
    toggleForms()
});

editForm.addEventListener("submit", (e) => {
    e.preventDefault()
    
    const editInputValue = editInput.value
    
    if (editInputValue) {
        updateTask(editInputValue)
        toggleForms();
        saveToLocalStorage();
        updateTaskListInStorage();
    }
    
})

const toggleForms = () => {
    superFiltro.classList.toggle("hide");
    editForm.classList.toggle("hide");
    taskForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
}
