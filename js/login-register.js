// Supabase configuration
const supabaseUrl = "https://bevoewgoffuwjmycsfea.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJldm9ld2dvZmZ1d2pteWNzZmVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MTQzODEsImV4cCI6MjA5MTA5MDM4MX0.N3lIv3nTZwe4Fl-_SXbYi3d-jcsORhFnucNYifJN2n8";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

const registroBtn = document.getElementById("register-btn");
const loginBtn = document.getElementById("login-btn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// Event listeners
if (registroBtn) {
  registroBtn.addEventListener("click", () => {
    register();
  });
}

if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    login();
  });
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

  const validationError = validateCredentials(email.trim(), password.trim());

  if (validationError) {
    alert(validationError);
    return;
  }

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
  });

  if (error) {
    alert("Error al registrarse: " + error.message);
    return;
  }

  console.log("Usuario registrado:", data);
  window.location.href = "index.html";
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

  const validationError = validateCredentials(email.trim(), password.trim());

  if (validationError) {
    alert(validationError);
    return;
  }

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert("Error al iniciar sesión: " + error.message);
    return;
  }

  console.log("Usuario logueado:", data);
  window.location.href = "index.html";
}

/**
 * Validates form credentials for email and password.
 * @param {string} email
 * @param {string} password
 * @returns {string|null} Validation error message or null if valid.
 */
function validateCredentials(email, password) {
  if (!email && !password) {
    return "Debes ingresar tu correo y tu contraseña.";
  }

  if (!email) {
    return "Debes ingresar tu correo.";
  }

  if (!password) {
    return "Debes ingresar tu contraseña.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Ingresa un correo válido.";
  }

  if (password.length < 6) {
    return "La contraseña debe tener al menos 6 caracteres.";
  }

  return null;
}