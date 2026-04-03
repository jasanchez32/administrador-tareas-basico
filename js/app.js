const input = document.querySelector('input');
const button = document.querySelector('button');
const tasksList = document.getElementById('tasks');

button.addEventListener('click', () => {
    const taskText = input.value;
    if (taskText.trim() !== '') {
        const li = document.createElement('li');
        li.textContent = taskText;
        tasksList.appendChild(li);
        input.value = '';
    }
});

function addTask() {
    const text = input.value;
    if(text.trim() === '') return;

    const li = document.createElement('li');
    li.textContent = text;
    tasksList.appendChild(li);
    input.value = '';
}