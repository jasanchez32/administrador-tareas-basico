const input = document.querySelector('input');
const button = document.querySelector('button');
const list = document.getElementById('tasks');
const boxList = document.querySelector('fieldset');
let tasks = [];
const savedTasks = localStorage.getItem('tasks');

if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    renderTasks();
} else {
    boxList.style.display = 'none';
}

button.addEventListener('click', () => {
    addTask();
});


/** * Adds a new task to the task list.
 * This function retrieves the text from the input field, checks if it's not empty, and then adds it to the tasks array.
 * After adding the task, it calls the renderTasks function to update the displayed list of tasks and clears the input field.   
 * * @function
 * @returns {void}
 */
function addTask() {
    const text = input.value;
    if(text.trim() === '') return;

    tasks.push(text);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    input.value = '';
}

/** * Renders the list of tasks on the webpage.
 * This function clears the current list of tasks displayed on the page and then iterates through the tasks array, creating a new list item for each task and appending it to the list. Finally, it makes sure the task list is visible by setting the display style of the boxList to 'block'.
 * @function
 * @returns {void}
 */
function renderTasks() {
    list.innerHTML = '';
    tasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.textContent = task;
        list.appendChild(listItem);
    });
    boxList.style.display = 'block';
}

/** * Deletes the last task from the task list.
 * This function removes the last task from the tasks array using the pop method and then calls the renderTasks function to update the displayed list of tasks.
 * @function
 * @returns {void}
 */
function deleteTask() {
    tasks.pop();
    renderTasks();
}

