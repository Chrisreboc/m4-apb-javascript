# PROYECTO MI BOARD, PARA GESTIONAR TAREAS

link del repositorio: https://github.com/Chrisreboc/m4-apb-javascript.git

link del deploy: https://chrisreboc.github.io/m4-apb-javascript/

## 1. INTRODUCCIÓN
Este documento busca describir cómo funciona principalmente la lógica de archivo index.js en el proyecto, que métodos trabaja y cuales son los objectivos de cada parte del codigo, con el fin de tener una idea más clara de la lógica detras de la aplicación. Cabe destacar que se centrará más que nada en la lógica y métodos utilizados.

## 2. ORGANIZACIÓN DEL CÓDIGO
El código posee las siguientes secciones:

### 2.1 Referencias al DOM
En el se capturan todas las referencias al HTML necesarias para comenzar con el script.

### 2.2 Variables de estado global
Se definen las variables globales de la aplicación en este caso array de listas, contadores, nodos de operación y referencias temporales.

### 2.3 Inicio
Se buscan e identifican cualquier elemento del DOM necesario, en este caso listas, para integrarlas al sistema (estas listas a tipo hard-code están como placeholder y feedback para el usuario, así entender como funciona la aplicación.)

### 2.4 Funciones reutilizables
En ella se encuentran las funciones lsa cuales son reutilizables como lo es crear listas, agregar tareas gestionar colores y actualización de progreso (de las tareas existentes).

### 2.5 Eventos
Posee todos los eventos listener que conectan las insteacciones del usuario con la lógica de Js.

## 3. REFERENCIAS AL DOM
El documento hace referencias al DOM basado en clases, de 2 tipos:

### Elementos Principales

- Board
- addListBtn
- deleteListBtn
- deleteHint
- initialListElement

### Elementos Modales

- comfirmDeleteModal
- comfirmDeleteTask
- addTaskModal
- completionModal

## 4. VARIABLES GLOBALES

Las variables globales cumplen diversas funciones a lo largo del código, a continuación serán describidas.

- lists: Es un array que almacena todas las listas de tareas, cada lista es un objeto con propiedades, id, title, color y tasks.
- listCounter: es el contador que aumenta el número con el fin de tener ids diferentes para cada lista.
- deleteMode: es un boleano que se asegura de checkear si está activo el modo borrar listas.
- selectedListId: hace referencia a la id de una lista, seleccionada para ser borrada.
- currentTaskList: es una referencia a la lista en dónde se agregará una tarea.
- tasktoDelte: este a diferencia del otro hace refencia al elemento de lista que se borrara.
- listofTaskToDelete: esta hace referencia a la lista que contiene la tarea que se eliminará, sin esta variable, no sería posible la barra de progreso.

## 5. FUNCIONALIDAD DEL CÓDIGO (AL ARRANCAR)

### 5.1 Detectar si existe una lista

Lo primero que hace le código es revisar si existe in elemento con clase task-list en el DOM, si el elemento existe, entonces crea un objeto de lista con id 1 en el array lists. extrae el título del elemento mediante input. y le asigna el color predeterminado.

### 5.2 Agregar "tareas" existentes en la lista.

El código extrae el task-item__text y luego verifica si su casilla se encuentra marcada (checked) y crea un objeto de tarea con un id único usando Date.now() + Math.random(). Luego asigna el id a data-task-id en el DOM y actualiza el progreso incial de esa lista llamando a updateProgress().

## 6. FUNCIONALIDAD AL CREAR UNA LISTA

la función createTaskList(), crea una lista de tareas nueva, primero incrementa (listCounter) el contador del id para que esta lista tenga una id único. Luego crea un objeto con id, color y tasks (array vacio). A su vez inserta el objeto creado en el array de "lists", luego crea la sección html citada en backticks y la añade al DOM.

## 7. FUNCIONALIDAD AL AGREGAR TAREAS

addTaksToList(taskList, text) agrega una nueva tarea a una lista existente. Primero localiza la lista extrayendo el id de data-list-id en el DOM, luego busca el objeto en el array "lists" mediante .find y crea un objeto "tarea" con un id único, texto y estado en false. Luego agreaga la tarea al array "tasks" para almacenarla y así después crear un elemento con la estructura especificada mediante backticks, para agregarla al DOM. Finalmente actualiza el progreso, mediante updateProgress(taskList).

## 8. GESTION DE COLORES

Este sistema permite personalizar el color de una lista.

- handleColorInteractions(event): detecta si el clic que se hizo fue efectivamente en ".task-list__color-toggle", si es así, llama a toggleColorMenu(), detecta si el clic fue en una opción de color y si es así llama a applyColor().

- toggleColorMenu(button): es encargada de mostrar la lista de colores (menu tipo slide) dentro de la lista padre, verifica también si está abierto (no hidden) si está abierto lo cierra, si está cerrado cierra todos los demás menus a excepción del que se está abriendo (closeAllColorMenus()).

- applyColor(button): Es auto explicativa, aplica el color seleccionado al elemento padre cambiando el atributo (data-color) y una vez realizada esa acción cierra el menu.

## 9. BARRA DE PROGRESO

- updateProgress(taskList): esa función busca y actualiza el valor del porcentaje de completación de tareas. Primero busca el objeto en el array "lists", luego cuenta el total de tareas y cuantas están completadas, si hay tareas calcula el porcentaje a la que equivale cada una, modifica el valor de "progress" y anima el procentaje, si las tareas están toas marcardas es decir equivalen al 100% detona el modal de celebración.

- animatePercentaje(element, from, to, duration): primero captura el inicio con performance.now() Calcula el progreso de la animación mediante Math.min() para así actualizar el valor (redondeado) mediante Math.round(), y continua con la animación hasta completar la función.

## 10. MENSAJE MOTIACIONAL

- fetchMotivationalQuote: es una función asíncrona que intercambia la frase default de .header__quote, por la frase proveniente de una API de terceros. Se útiliza Try... Catch, para manejar la petición en caso de que sea positiva o negativa. Utilizando Fetch, se hace la petición a la API, y se espera por la respuesta en formato.json. En caso de no funcionar, el mensaje queda como default y Catch maneja el error.

## 11. EVENTOS

### 11.1 Evento crear lista
Evento encargado de crear listas; cuando se pincha el botón "deleteListBtn" cambia el estado de "deleteMode" a true, pues por default está en false. Cambia el html del botón al nuevo mensaje de cancelar accion. Si se desactiva, regresa a su estado original delete mode false.

### 11.2 Modo de eliminación. (deleteMode)
Cuando deleteMode está activo (true) y se pincha una lista, primero verifica que no sea en alguno de los botones internos, guarda el data-list-id en selectedListId y detona el modal de confirmación.

### 11.3 Confirmar eliminación.
Al confirmar eliminación se elimina el elemento del DOM mediante "remove()" y luego se elimina el objeto del array "lists" mediante "splice()" (mejor y más seguro que delete, ya que no deja espacios de array undefined.) finalmente cierra el modal y desactiva deleteMode.

### 11.4 Abrir modal para agregar tareas
Cuando se hace clic en el botón "agregar tarea", guarda la referencia a lista en el currentTaskLit(), limpia el input del modal y detona el modal addTaskModal, 

### 11.5 Confirmar agregar tarea
Si se confirma el agregar una tarea a lista, se extrae y limpia el texto del input, si no está vacío llama a addTaskToList() con la lista y el texto, finalmente el modal de cierra.

### 11.6 Eliminar tarea
Al hacer clic en el botón de eliminar tarea (trashcan), guarda las referencias a la tarea y a la lista en TaskToDelete y listOfTaskToDelte, para luego detonar el modal.

### 11.7 Confirmar borrar tarea
Al confirmar el borrar tarea, se extrae los id de la lista y la tarea mediante find(). Filtra el array de tareas para eliminarla del array mediante filter(), elimina el elemento del DOM mediante remove(), actualiza la lista de progresos y cierra el modal.

### 11.9 Marcar tareas como completadas
Cuando se marca una casilla (checked) localiza la lista y tarea (mediante find()) actualiza la propiedad completed del objeto y luego se llama a updateProgress() para recalcular el porcentaje.

### 11.10 Cambiar nombre del elemento lista.
Se agrego una función flecha que se encarga de registrar cada vez que se ingresa un nuevo nombre a una lista, con el fin de almacenarlo más tarde en indexedDB. 

### 11.11 Cambiar nombre del elemento tarea.
Este evento de clic está atento a si se apreta el botón de cambiar nombre y hace deploy del modal, para cambiar nombre, él la función captura la frase que se escriba en el input.

### 11.12 Cambiar nombre del elemento tarea.
Cuando el nombre de una nueva tare ase escribe en el modal, se asegura de que el input no esté vacío, al presionar el botón confirmar, mediante find() se busca el objeto dentro del array lists, y en el array de tasks, lo reemplaza por el nuevo mensaje. luego este se almacena en indexedDB.

### 11.13 DOM Content Loaded

DOMContentLoaded, es un evento async que funciona mediante una función flecha, esta se comunica con la API propia del navegador, IndexedDB, epera a que se abra y de respuestas mediante await, luego se asegura de borrar el elemento default en el DOM mediante ForEach (con el revisa que los valores del array default queden vacíos) y a sí posteriormente mediante un nuevo forEach revisa cada elemento de lista almacenada en IndexedDB y se asegura de rescatarlos y añadirlos al DOM mediante appendChild. hace ajuste del contador y recarga la frase motivacional. cabe destacar que luego de cada acción en el DOM se guardan los cambios en IndexedDB mediante SaveDB().

## 12 DATOS
El array list posee:

id, title, color y tasks (array)

y cada task tiene:

id, text y completed.

cada elemento dentro del array se convierte en un objeto que contiene los datos. es un caso de un array[ Object1, Object2... ] que almacena objects.






