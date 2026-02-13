// ============================================================================
// REFERENCIAS AL DOM - ELEMENTOS PRINCIPALES
// ============================================================================

const board = document.querySelector('.board');
const addListBtn = document.querySelector('.board__add-list');
const deleteListBtn = document.querySelector('.board__delete-list');
const deleteHint = document.querySelector('.delete-hint');
const initialListElement = document.querySelector('.task-list');

// ============================================================================
// REFERENCIAS AL DOM - MODALES
// ============================================================================

const confirmDeleteModal = document.querySelector('.confirm-delete-modal');
const cancelDeleteBtn = document.querySelector('.confirm-delete-modal__cancel');

const confirmDeleteTaskModal = document.querySelector('.confirm-delete-modal-task');
const confirmDeleteTaskBtn = document.querySelector('.confirm-delete-modal-task__confirm');
const confirmDeleteTaskCancelBtn = document.querySelector('.confirm-delete-modal-task__cancel');

const addTaskModal = document.querySelector('.add-task-modal');
const taskInput = document.getElementById('task-to-add');
const confirmAddTaskBtn = document.querySelector('.add-task-modal__confirm');
const cancelAddTaskBtn = document.querySelector('.add-task-modal__cancel');

const completionModal = document.querySelector('.completion-modal');
const completionCloseBtn = document.querySelector('.completion-modal__close');

const renameTaskModal = document.querySelector('.rename-task');
const renameTaskInput = renameTaskModal.querySelector('#task-to-rename');
const confirmRenameTaskBtn = document.querySelector('.rename-task__confirm');
const cancelRenameTaskBtn = document.querySelector('.rename-task__cancel');

// ============================================================================
// VARIABLES DE ESTADO GLOBAL
// ============================================================================

const lists = [];
let listCounter = 1;
let deleteMode = false;
let selectedListId = null;
let currentTaskList = null;
let taskToDelete = null;
let listOfTaskToDelete = null;
let taskToRename = null;
let listOfTaskToRename = null;

const deleteBtnDefaultHTML = '<i class="bi bi-trash3-fill"></i> Borrar lista';
const deleteBtnCancelHTML = 'X Cancelar acción';

// ============================================================================
// INICIALIZACIÓN - DETECCIÓN Y SINCRONIZACIÓN DE LISTA EXISTENTE
// ============================================================================

/*DETECCIÓN DE LA LISTA EXISTENTE 
(no puedo creer que estuviese toda una tarde trantando de encontrar el error, no salía por consola y ni la IA lo identificaba,
se creaban listas pero solo en elementos nuevos, no en el existente, luego realicé eso y pude solucionar el problema.) */
if (initialListElement) {
    lists.push({
        id: 1,
        title: initialListElement.querySelector('.task-list__title').value,
        color: 'lightyellow',
        tasks: []
    });
}

// SINCRONIZAR TAREAS EXISTENTES EN LA LISTA POR DEFAULT
if (initialListElement) {
    const defaultList = lists.find(l => l.id === 1);
    const taskItems = initialListElement.querySelectorAll('.task-item');

    taskItems.forEach(taskItem => {
        const text = taskItem.querySelector('.task-item__text')?.textContent.trim();
        const checkbox = taskItem.querySelector('.task-item__check');

        const task = {
            id: Date.now() + Math.random(), // id único
            text: text,
            completed: checkbox.checked
        };

        // Guardar id en el DOM
        taskItem.dataset.taskId = task.id;

        // Agregar al array
        defaultList.tasks.push(task);
    });

    // Actualizar progreso inicial
    updateProgress(initialListElement);
}

// ============================================================================
// FUNCIONES - GESTIÓN DE LISTAS
// ============================================================================

//MANIPULACIÓN DEL DOM PARA CREAR UNA LISTA
function createTaskList() {
    listCounter++;

    //CREAR LISTA
    const list = {
        id: listCounter,
        title: `Lista de Tareas ${listCounter}`,
        color: 'lightyellow',
        tasks: []
    };

    lists.push(list);

    //MODIFICAR DOM
    const section = document.createElement('section');
    section.classList.add('task-list');
    section.dataset.listId = listCounter;

    //(color predeterminado)
    section.dataset.color = 'lightyellow';

    section.innerHTML = `
        <header class="task-list__header">
            <input 
                type="text" 
                class="task-list__title" 
                value="Lista de Tareas ${listCounter}"
                aria-label="Nombre de la lista de tareas"
            />

            <button class="task-list__color-toggle" aria-label="Cambiar color de la lista">
                <i class="bi bi-palette-fill"></i>
            </button>
        </header>

        <div class="task-list__progress">
            <progress value="0" max="100"></progress>
            <span class="task-list__progress-text">0%</span>
        </div>

        <!-- OPCIONES DE COLORES SLIDE MENU -->
         <div class="task-list__color-menu" hidden>
            <button class="task-list__color-button1" data-color="lightpink" aria-label="Rosa claro">Rosa</button>
            <button class="task-list__color-button2" data-color="orange" aria-label="Naranjo">Anaranjado</button>
            <button class="task-list__color-button3" data-color="lightyellow" aria-label="Amarillo claro">Amarillo</button>
            <button class="task-list__color-button4" data-color="green" aria-label="Verde">Verde</button>
            <button class="task-list__color-button5" data-color="lightblue" aria-label="Celeste">Celeste</button>
        </div>

        <ul class="task-list__items"></ul>

        <div class="task-list__actions">
            <button class="task-list__add-task">+ Agregar tarea</button>
        </div>
    `;

    return section;
}

// ============================================================================
// FUNCIONES - GESTIÓN DE TAREAS
// ============================================================================

// MANIPULACIÓN DEL DOM AL CREAR NUEVA TAREA
function addTaskToList(taskList, text) {

    const listId = taskList.dataset.listId;
    const list = lists.find(l => l.id === Number(listId));

    if (!list) return;

    const task = {
        id: Date.now(),
        text: text,
        completed: false
    };

    list.tasks.push(task);

    const taskListItems = taskList.querySelector('.task-list__items');

    const li = document.createElement('li');
    li.classList.add('task-item');
    li.dataset.taskId = task.id;

    li.innerHTML = `
        <label>
            <input type="checkbox" class="task-item__check" />
            <span class="task-item__text">Tarea 1</span>
        </label>
        <button class="task-list__rename" aria-label="Renombrar tarea">
            <i class="bi bi-pencil-square"></i>
        </button>
        <button class="task-item__delete" aria-label="Eliminar tarea">
            <i class="bi bi-trash3-fill"></i>
        </button>
    `;

    li.querySelector('.task-item__text').textContent = text;

    taskListItems.appendChild(li);

    updateProgress(taskList);
}

// ============================================================================
// FUNCIONES - GESTIÓN DE COLORES
// ============================================================================

function handleColorInteractions(event) {
    const colorToggleBtn = event.target.closest('.task-list__color-toggle');
    const colorOptionBtn = event.target.closest('.task-list__color-menu button');

    if (colorToggleBtn) {
        toggleColorMenu(colorToggleBtn);
        return;
    }

    if (colorOptionBtn) {
        applyColor(colorOptionBtn);
    }
}

//ABRIR Y CERRAR SLIDE DE COLORES
function toggleColorMenu(button) {
    const taskList = button.closest('.task-list');
    const colorMenu = taskList.querySelector('.task-list__color-menu');

    const isOpen = !colorMenu.hasAttribute('hidden');

    if (isOpen) {
        colorMenu.setAttribute('hidden', '');
    } else {
        closeAllColorMenus();
        colorMenu.removeAttribute('hidden');
    }
}

function closeAllColorMenus() {
    document.querySelectorAll('.task-list__color-menu').forEach(menu => {
        menu.setAttribute('hidden', '');
    });
}

//APLICAR COLOR SELECCIONADO A POST-IT
function applyColor(colorButton) {
    const selectedColor = colorButton.dataset.color;
    const taskList = colorButton.closest('.task-list');

    taskList.dataset.color = selectedColor;

    const colorMenu = taskList.querySelector('.task-list__color-menu');
    colorMenu.setAttribute('hidden', '');
}

// ============================================================================
// FUNCIONES - PROGRESO Y ANIMACIONES
// ============================================================================

//PORCENTAJE DE PROGRESO EN TAREAS
function updateProgress(taskListElement) {
    const listId = Number(taskListElement.dataset.listId);
    const list = lists.find(l => l.id === listId);
    if (!list) return;

    const totalTasks = list.tasks.length;
    const completedTasks = list.tasks.filter(t => t.completed).length;

    const progressBar = taskListElement.querySelector('progress');
    const progressText = taskListElement.querySelector('.task-list__progress-text');

    let percentage = 0;

    if (totalTasks > 0) {
        percentage = Math.round((completedTasks / totalTasks) * 100);
    }

    // 🔹 porcentaje anterior (lo que ya está visible)
    const previousPercentage = Number(
        progressText.textContent.replace('%', '')
    ) || 0;

    progressBar.value = percentage;
    animatePercentage(progressText, previousPercentage, percentage);

    // 🎉 Si llegó al 100%, felicitamos (solo una vez)
    if (percentage === 100 && !taskListElement.dataset.completedOnce) {
        taskListElement.dataset.completedOnce = 'true';
        showCompletionModal();
    }
}

//ANIMACIÓN PORCENTAJE
function animatePercentage(element, from, to, duration = 400) {
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const currentValue = Math.round(from + (to - from) * progress);
        element.textContent = `${currentValue}%`;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

//EJECUCIÓN DEL MODAL SOLO 1 VEZ
function showCompletionModal() {
    completionModal.showModal();
}

// ============================================================================
// EVENTOS - CREAR Y ELIMINAR LISTAS
// ============================================================================

//EVENTO DE CREAR NUEVA LISTA BOTÓN
addListBtn.addEventListener('click', () => {
    const newList = createTaskList();
    board.appendChild(newList);
});

//ESTADO INICIAL MODO BORRAR
deleteMode = false;
deleteListBtn.classList.remove('is-active');
deleteListBtn.innerHTML = '<i class="bi bi-trash3-fill"></i> Borrar lista';
deleteHint.hidden = true;

//EVENTO AL PINCHAR MODO BORRAR
deleteListBtn.addEventListener('click', () => {
    deleteMode = !deleteMode;

    if (deleteMode) {
        deleteListBtn.classList.add('is-active');
        deleteListBtn.innerHTML = deleteBtnCancelHTML;
        deleteHint.hidden = false;
    } else {
        deleteListBtn.classList.remove('is-active');
        deleteListBtn.innerHTML = deleteBtnDefaultHTML;
        deleteHint.hidden = true;
        selectedListId = null;
    }

    document.querySelectorAll('.task-list').forEach(list => {
        if (deleteMode) {
            list.classList.add('is-deletable');
        } else {
            list.classList.remove('is-deletable');
        }
    });
});

//EVENTO BORRAR AL SELECCIONAR POR ID
board.addEventListener('click', (event) => {
    if (!deleteMode) return;

    if (
        event.target.closest('.task-list__add-task') ||
        event.target.closest('.task-list__color-toggle') ||
        event.target.closest('.task-item__delete')
    ) {
        return;
    }

    const list = event.target.closest('.task-list');
    if (!list) return;

    selectedListId = list.dataset.listId;
    confirmDeleteModal.showModal();
});

//PROCESO DE CONFIRMAR BORRADO
document.querySelector('.confirm-delete-modal__confirm')
    .addEventListener('click', () => {

        const listToDelete = document.querySelector(
            `.task-list[data-list-id="${selectedListId}"]`
        );

        if (listToDelete) {
            listToDelete.remove();
        }

        const index = lists.findIndex(l => l.id === Number(selectedListId));
        if (index !== -1) {
            lists.splice(index, 1);
        }

        confirmDeleteModal.close();
        deleteMode = false;
        deleteHint.hidden = true;
        deleteListBtn.classList.remove('is-active');
        deleteListBtn.textContent = 'Borrar lista';
    });

//CANCELAR BORRAR EN MODAL
cancelDeleteBtn.addEventListener('click', () => {
    confirmDeleteModal.close();
});

// ============================================================================
// EVENTOS - GESTIÓN DE COLORES
// ============================================================================

//PALETTE COLOR SELECCIÓN
document.addEventListener('click', handleColorInteractions);

//COLOR DEFAULT POST-IT EXISTENTES
document.querySelectorAll('.task-list').forEach(list => {
    if (!list.dataset.color) {
        list.dataset.color = 'lightyellow';
    }
});

// ============================================================================
// EVENTOS - AGREGAR TAREAS
// ============================================================================

// ABRIR MODAL AL PRESIONAR AGREGAR TAREA
document.addEventListener('click', event => {
    const addTaskBtn = event.target.closest('.task-list__add-task');

    if (!addTaskBtn) return;

    currentTaskList = addTaskBtn.closest('.task-list');
    taskInput.value = '';
    addTaskModal.showModal();
});

//BOTON CONFIRMAR TAREA
confirmAddTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();

    if (taskText === '') return;

    addTaskToList(currentTaskList, taskText);
    addTaskModal.close();
});

//CANCELAR AGREGAR TAREA
cancelAddTaskBtn.addEventListener('click', () => {
    addTaskModal.close();
});

// ============================================================================
// EVENTOS - ELIMINAR TAREAS
// ============================================================================

//BORRAR ELEMENTO DE LA LISTA
document.addEventListener('click', event => {
    const deleteTaskBtn = event.target.closest('.task-item__delete');
    if (!deleteTaskBtn) return;

    const taskItem = deleteTaskBtn.closest('.task-item');
    const taskList = deleteTaskBtn.closest('.task-list');

    taskToDelete = taskItem;
    listOfTaskToDelete = taskList;

    confirmDeleteTaskModal.showModal();
});

//CONFIRMAR BORRAR
confirmDeleteTaskBtn.addEventListener('click', () => {
    if (!taskToDelete || !listOfTaskToDelete) return;

    const listId = Number(listOfTaskToDelete.dataset.listId);
    const taskId = Number(taskToDelete.dataset.taskId);

    
    const list = lists.find(l => l.id === listId);
    if (!list) return;
    // 1 Borrar del array
    list.tasks = list.tasks.filter(task => task.id !== taskId);
    // 2️ Borrar del DOM  
    taskToDelete.remove();
    // 3️ Actualizar progreso
    updateProgress(listOfTaskToDelete);
    // 4️ Cerrar modal y limpiar estado
    confirmDeleteTaskModal.close();
    taskToDelete = null;
    listOfTaskToDelete = null;
    
});

//CANCELAR BORRAR
confirmDeleteTaskCancelBtn.addEventListener('click', () => {
    taskToDelete = null;
    listOfTaskToDelete = null;
    confirmDeleteTaskModal.close();
});

// ============================================================================
// EVENTOS - MARCAR TAREAS COMO COMPLETADAS
// ============================================================================

//MARCAR TAREAS COMO COMPLETADAS
document.addEventListener('change', event => {
    const checkbox = event.target.closest('.task-item__check');
    if (!checkbox) return;

    const taskItem = checkbox.closest('.task-item');
    const taskList = checkbox.closest('.task-list');

    const listId = Number(taskList.dataset.listId);
    const taskId = Number(taskItem.dataset.taskId);

    const list = lists.find(l => l.id === listId);
    if (!list) return;

    const task = list.tasks.find(t => t.id === taskId);
    if (!task) return;

    task.completed = checkbox.checked;

    updateProgress(taskList);
});

// ============================================================================
// EVENTOS - MODAL DE COMPLETACIÓN
// ============================================================================

completionCloseBtn.addEventListener('click', () => {
    completionModal.close();
});

// ============================================================================
// EVENTOS - RENOMBRAR TAREAS
// ============================================================================

// ABRIR MODAL AL PRESIONAR RENOMBRAR TAREA
document.addEventListener('click', event => {
    const renameTaskBtn = event.target.closest('.task-list__rename');
    if (!renameTaskBtn) return;

    const taskItem = renameTaskBtn.closest('.task-item');
    const taskList = renameTaskBtn.closest('.task-list');

    taskToRename = taskItem;
    listOfTaskToRename = taskList;

    // Obtener el texto actual de la tarea y pre-llenarlo en el input
    const currentText = taskItem.querySelector('.task-item__text').textContent;
    renameTaskInput.value = currentText;
    
    renameTaskModal.showModal();
    
    // Seleccionar todo el texto para facilitar el reemplazo
    renameTaskInput.select();
});

// CONFIRMAR RENOMBRAR TAREA
confirmRenameTaskBtn.addEventListener('click', () => {
    if (!taskToRename || !listOfTaskToRename) return;

    const newTaskText = renameTaskInput.value.trim();
    
    // Validar que no esté vacío
    if (newTaskText === '') return;

    const listId = Number(listOfTaskToRename.dataset.listId);
    const taskId = Number(taskToRename.dataset.taskId);

    // 1️⃣ Actualizar en el array
    const list = lists.find(l => l.id === listId);
    if (list) {
        const task = list.tasks.find(t => t.id === taskId);
        if (task) {
            task.text = newTaskText;
        }
    }

    // 2️⃣ Actualizar en el DOM
    const taskTextElement = taskToRename.querySelector('.task-item__text');
    taskTextElement.textContent = newTaskText;

    // 3️⃣ Cerrar modal y limpiar estado
    renameTaskModal.close();
    taskToRename = null;
    listOfTaskToRename = null;
});

// CANCELAR RENOMBRAR TAREA
cancelRenameTaskBtn.addEventListener('click', () => {
    taskToRename = null;
    listOfTaskToRename = null;
    renameTaskModal.close();
});