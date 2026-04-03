const input = document.querySelector('input');
const button = document.querySelector('button');
const tasksList = document.getElementById('tasks');
const boxList = document.querySelector('fieldset');

boxList.style.display = 'none';

button.addEventListener('click', () => {
    const taskText = input.value;
    if (taskText.trim() !== '') {
        boxList.style.display = 'block';
        const li = document.createElement('li');
        li.textContent = taskText;
        tasksList.appendChild(li);
        input.value = '';
    }
});

function addTask() {
    const text = input.value;
    if(text.trim() === '') return;

    boxList.style.display = 'block';
    const li = document.createElement('li');
    li.textContent = text;
    tasksList.appendChild(li);
    input.value = '';
}