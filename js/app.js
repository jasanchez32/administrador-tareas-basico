// Supabase configuration
const supabaseUrl = "URL Database - Supabase";
const supabaseKey = "Key Database  - Supabase";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// DOM elements
const taskInput = document.getElementById("task-input");
const taskButton = document.getElementById("add-task-btn");
const list = document.getElementById("tasks");
const boxList = document.querySelector("fieldset");

const logoutBtn = document.getElementById("logout-btn");

let tasks = [];

// Event listeners
if (taskButton) {
  taskButton.addEventListener("click", () => {
    addTask();
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    if (!confirm("¿Cerrar sesión?")) return;

    await supabaseClient.auth.signOut();
    window.location.href = "login.html";
  });
}

/**
 * Adds a new task to the task list.
 * This function retrieves the text from the input field, checks if it's not empty, and then adds it to the tasks array.
 * After adding the task, it calls the renderTasks function to update the displayed list of tasks and clears the input field.
 * @function
 * @returns {void}
 */
async function addTask() {
  const user = await getUser();
  const text = taskInput.value;

  if (!user) {
    alert("Debes iniciar sesión para agregar tareas.");
    return;
  }

  if (text.trim() === "") {
    alert("Por favor ingresa una tarea antes de continuar.");
    return;
  }

  await supabaseClient.from("tasks").insert({ task: text, user_id: user.id });

  getTasks();
  taskInput.value = "";
}

/**
 * Retrieves tasks from the database for the current user.
 * @async
 * @function
 * @returns {Promise<void>}
 */
async function getTasks() {
  const user = await getUser();

  if (!user) {
    alert("Debes iniciar sesión para agregar tareas.");
    return;
  }

  const { data, error } = await supabaseClient
    .from("tasks")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    alert("Error al obtener las tareas: " + error.message);
    return;
  }

  tasks = data;

  if (tasks.length === 0) {
    boxList.style.display = "none";
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
  list.innerHTML = "";

  tasks.forEach((task) => {
    const listItem = document.createElement("li");
    listItem.textContent = task.task;
    list.appendChild(listItem); // append button to list item

    const deleteBtn = document.createElement("button"); // Create button
    deleteBtn.id = "delete-button";
    deleteBtn.textContent = "X"; // Text of button
    deleteBtn.addEventListener("click", () => {
      deleteTask(task.id);
    });
    listItem.appendChild(deleteBtn);
  });

  boxList.style.display = "block";
}

/**
 * Deletes the last task from the task list.
 * This function removes the last task from the tasks array using the pop method and then calls the renderTasks function to update the displayed list of tasks.
 * @function
 * @returns {void}
 */
async function deleteTask(id) {
  if (!confirm("¿Eliminar tarea?")) return;

  const { error } = await supabaseClient.from("tasks").delete().eq("id", id);

  if (error) {
    alert("Error al eliminar la tarea: " + error.message);
    return;
  }

  getTasks();
}

/**
 * Gets the current authenticated user.
 * @async
 * @function
 * @returns {Promise<Object|null>} The user object or null if not authenticated.
 */
async function getUser() {
  const {
    data: { user },
    error,
  } = await supabaseClient.auth.getUser();

  if (error) {
    if (error.name !== "AuthSessionMissingError") {
      console.error("Error al obtener el usuario:", error.message);
    }
    return null;
  }

  return user;
}

getTasks();
