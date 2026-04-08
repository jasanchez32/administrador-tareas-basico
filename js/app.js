// Supabase configuration
const supabaseUrl = '';
const supabaseKey = '';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// DOM elements
const input = document.querySelector('input');
const button = document.querySelector('button');
const list = document.getElementById('tasks');
const boxList = document.querySelector('fieldset');

const registroBtn = document.getElementById('register-btn');
const loginBtn = document.getElementById('login-btn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

let tasks = [];


// Event listeners
button.addEventListener('click', () => {
    addTask();
});

registroBtn.addEventListener("click", () => {
    register();
});

loginBtn.addEventListener("click", () => {
    login();
});

/**
 * Adds a new task to the task list.
 * This function retrieves the text from the input field, checks if it's not empty, and then adds it to the tasks array.
 * After adding the task, it calls the renderTasks function to update the displayed list of tasks and clears the input field.
 * @function
 * @returns {void}
 */
async function addTask() {
    const user = await getUser();
    const text = input.value;

    if(!user) {
        alert("Debes iniciar sesión para agregar tareas.");
        return;
    }

    if(text.trim() === '') return;

    await supabaseClient
        .from('tasks')
        .insert({ task: text, user_id: user.id });

    getTasks();
    input.value = '';
}

/**
 * Retrieves tasks from the database for the current user.
 * @async
 * @function
 * @returns {Promise<void>}
 */
async function getTasks() {
    const user = await getUser();

    if(!user) {
        alert("Debes iniciar sesión para agregar tareas.");
        return;
    }

    const { data, error } = await supabaseClient
        .from('tasks')
        .select('*')
        .eq("user_id", user.id);

    if (error) {
        console.error('Error al obtener las tareas:', error);
        return;
    }

    tasks = data;
    
    if (tasks.length === 0) {
        boxList.style.display = 'none';
        return;
    }

    renderTasks();
}

/**
 * Renders the list of tasks on the webpage.
 * This function clears the current list of tasks displayed on the page and then iterates through the tasks array, creating a new list item for each task and appending it to the list. Finally, it makes sure the task list is visible by setting the display style of the boxList to 'block' if there are tasks, otherwise hides it.
 * @function
 * @returns {void}
 */
function renderTasks() {
    list.innerHTML = '';

    tasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.textContent = task.task;
        list.appendChild(listItem);
    });

    boxList.style.display = 'block';
}

/**
 * Deletes the last task from the task list.
 * This function removes the last task from the tasks array using the pop method and then calls the renderTasks function to update the displayed list of tasks.
 * @function
 * @returns {void}
 */
function deleteTask() {
    tasks.pop();
    renderTasks();
}

/**
 * Registers a new user with email and password.
 * @async
 * @function
 * @returns {Promise<void>}
 */
async function register() {
    const email = emailInput.value;
    const password = passwordInput.value;

    const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
    });

    if(error) {
        console.error("Error al registrarse:", error);
        return;
    }

    console.log("Usuario registrado:", data);
}

/**
 * Logs in a user with email and password.
 * @async
 * @function
 * @returns {Promise<void>}
 */
async function login() {
    const email = emailInput.value;
    const password = passwordInput.value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
    });

    if(error) {
        console.error("Error al iniciar sesión:", error);
        return;
    }

    console.log("Usuario logueado:", data);
    getTasks();
}

/**
 * Gets the current authenticated user.
 * @async
 * @function
 * @returns {Promise<Object|null>} The user object or null if not authenticated.
 */
async function getUser() {
    const { data: { user }, error } = await supabaseClient.auth.getUser();

    if(error) {
        if(error.name !== "AuthSessionMissingError") {
            console.error("Error al obtener el usuario:", error);
        }
        return null;
    }

    return user;
}

getTasks();