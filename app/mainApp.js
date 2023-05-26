let createdTasks;
const taskList = document.querySelector(".todo-list");
const deleteTaskBtn = document.querySelectorAll(".deleteTask");
let editclicked = false;
const API = "https://todoapp-api-9mvn.onrender.com";
const loadData = async () => {
  const response = await fetch(`${API}/api/task/getAll`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const result = await response.json();
  return result;
};
const addTaskBackend = async (task_title, task_description) => {
  const response = await fetch(`${API}/api/task/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      task_title: task_title.trim(),
      task_description: task_description.trim(),
    }),
  });
  const result = await response.json();

  displayTasks();
  // return result;
};
const deleteTask = async (task_id) => {
  const response = await fetch(`${API}/api/task/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ task_id }),
  });
  const result = await response.json();
  displayTasks();
};
const updateTask = async (task_id, task_title, task_description) => {
  const response = await fetch(`${API}/api/task/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      task_id,
      task_title: task_title.trim(),
      task_description: task_description.trim(),
    }),
  });
  const result = await response.json();

  displayTasks();
};
const taskComplete = async (task_id, task_status) => {
  const response = await fetch(`${API}/api/task/taskComplete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ task_id, task_status }),
  });
  const result = await response.json();
  displayTasks();
};
function checkCookie(cookieName) {
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();
    if (cookie.indexOf(cookieName + "=") === 0) {
      return console.log("The cookie exists");
    }
  }
  window.location.assign("../login_page/login.html");
}
function addAllEventListeners(todoli) {
  todoli.querySelector(".deleteTask").addEventListener("click", () => {
    deleteTask(todoli.dataset.taskID);
  });
  //
  todoli.querySelector(".editTask").addEventListener("click", (e) => {
    if (editclicked) return;
    if (Number(todoli.dataset.task_status)) return;
    editclicked = true;
    todoli.querySelector(".updateTask").classList.toggle("hidden");
    todoli.querySelector(".editTask").classList.toggle("hidden");
    todoli
      .querySelector("textarea.task-description")
      .classList.toggle("hidden");
    todoli.querySelector("h2.task-description").classList.toggle("hidden");
    todoli.querySelector("h2.task-heading").classList.toggle("hidden");
    todoli.querySelector("textarea.task-heading").classList.toggle("hidden");
  });
  todoli.querySelector(".updateTask").addEventListener("click", (e) => {
    todoli.querySelector(".updateTask").classList.toggle("hidden");
    todoli.querySelector(".editTask").classList.toggle("hidden");
    todoli
      .querySelector("textarea.task-description")
      .classList.toggle("hidden");
    todoli.querySelector("h2.task-description").classList.toggle("hidden");
    todoli.querySelector("h2.task-heading").classList.toggle("hidden");
    todoli.querySelector("textarea.task-heading").classList.toggle("hidden");
    // updateTask()
    if (
      todoli.querySelector("textarea.task-heading").value.trim().length !== 0
    ) {
      if (todoli.dataset.task_l_or_n == "loaded") {
        updateTask(
          todoli.dataset.taskID,
          todoli.querySelector("textarea.task-heading").value,
          todoli.querySelector("textarea.task-description").value
        );
      } else if (todoli.dataset.task_l_or_n == "new") {
        todoli.dataset.task_l_or_n == "loaded";
        addTaskBackend(
          todoli.querySelector("textarea.task-heading").value,
          todoli.querySelector("textarea.task-description").value
        );
      }
      editclicked = false;
    } else {
      displayTasks();
      return console.log("cannot save empty heading");
    }
  });
  //
  //
  //
  //
  todoli
    .querySelector(".checkbox-container input[type=checkbox]")
    .addEventListener("change", (e) => {
      if (e.target.checked) {
        todoli.dataset.task_status = 1;
      } else {
        todoli.dataset.task_status = 0;
      }
      taskComplete(todoli.dataset.taskID, todoli.dataset.task_status);
    });
  //
  todoli.querySelectorAll("textarea.task-heading").forEach((textarea) => {
    textarea.addEventListener("input", (e) => {
      e.target.maxLength = 40;
    });
  });
  //
  todoli.querySelectorAll("textarea.task-description").forEach((textarea) => {
    textarea.addEventListener("input", (e) => {
      e.target.maxLength = 150;
    });
  });
}
function createBanner(
  li,
  tskloaded,
  task = { task_title: "", task_description: "", completed: 0 }
) {
  li.classList.add("todo-item");
  li.dataset.taskID = task.task_id;
  li.dataset.task_l_or_n = tskloaded;
  li.dataset.task_status = task.completed;
  const taskFormat = ` <button class="deleteTask"><i class="fa-solid fa-circle-minus" style="color: #f22121"></i></button>
          <div class="textDisplay"><textarea placeholder="Enter Heading" class="task-heading hidden">${
            task.task_title
          }</textarea><h2 class="task-heading">${
    task.task_title || "Enter Heading"
  }</h2></div>
          <div class=btnDisplay><button class="editTask">EDIT</button><button class="updateTask hidden">SAVE</button></div>
          <label class="checkbox-container"><input type="checkbox" id="taskCheck" /><span class="checkmark"></span></label>
          <div class="textDisplay"><textarea placeholder="Enter Description" class="task-description hidden" row="1" col="50">${
            task.task_description
          }</textarea><h2 class="task-description">${
    task.task_description || "Enter Description"
  }</h2></div>`;
  li.insertAdjacentHTML("afterbegin", taskFormat);
}
function addTask() {
  const todoli = document.createElement("li");
  createBanner(todoli, "new");
  addAllEventListeners(todoli);
  //
  //
  //
  taskList.insertAdjacentElement("afterbegin", todoli);
}
function displayTasks() {
  loadData()
    .then((result) => {
      if (result.success) {
        console.log(result);
        createdTasks = result.result;
        console.log(createdTasks);
        taskList.innerHTML = "";
        createdTasks.forEach((task) => {
          const todoli = document.createElement("li");
          createBanner(todoli, "loaded", task);
          //   = document.createElement("li");
          // todoli.classList.add("todo-item");
          // todoli.dataset.taskID = task.task_id;
          // todoli.dataset.task_status = task.completed;
          // const taskFormat = ` <button class="deleteTask"><i class="fa-solid fa-circle-minus" style="color: #f22121"></i></button>
          // <div class="textDisplay"><textarea class="task-heading hidden">${task.task_title}</textarea><h2 class="task-heading">${task.task_title}</h2></div>
          // <div class=btnDisplay><button class="editTask">EDIT</button><button class="updateTask hidden">SAVE</button></div>
          // <label class="checkbox-container"><input type="checkbox" id="taskCheck" /><span class="checkmark"></span></label>
          // <div class="textDisplay"><textarea class="task-description hidden" row="1" col="50">${task.task_description}</textarea><h2 class="task-description">${task.task_description}</h2></div>`;

          // todoli.insertAdjacentHTML("afterbegin", taskFormat);
          if (Number(todoli.dataset.task_status)) {
            todoli.style.background =
              "linear-gradient(135deg, #94bef1, #eaecfc)";
            todoli.querySelector(
              ".checkbox-container input[type=checkbox]"
            ).checked = true;
          } else {
            todoli.style.background =
              "linear-gradient(135deg, #dff9df, #ebf9ec)";
          }

          //
          //
          // EVENT LISTENERS
          addAllEventListeners(todoli);
          //
          //
          //
          taskList.appendChild(todoli);
        });
      } else {
        return console.error(result);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
window.onload = checkCookie("logInAuth");
displayTasks();
