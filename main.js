let inputTask = document.querySelector(".add-task input"),
  AddBtn = document.querySelector(".add-task .plus"),
  tasksBlock = document.querySelector(".tasks-content"),
  msg = document.querySelector(".tasks-content .msg"),
  tasksCount = document.querySelector(".stats .tasks-count span"),
  tasksCompleted = document.querySelector(".stats .tasks-completed span");

let clearAllTasks = document.createElement("span");
clearAllTasks.textContent = "Delete All";
clearAllTasks.style.cssText =
  "padding: 10px 20px; background-color: #e71d36; color: white; border-radius: 5px; float: right; margin: 20px 35px; cursor: pointer; display: none";
document.querySelector(".container").append(clearAllTasks);

let completedAllTasks = document.createElement("span");
completedAllTasks.textContent = "Completed All";
completedAllTasks.style.cssText =
  "padding: 10px 20px; background-color: #2ec4b6; color: white; border-radius: 5px; float: left; margin: 20px 35px; cursor: pointer; display: none";
document.querySelector(".container").append(completedAllTasks);

window.onload = function () {
  inputTask.focus();
};

// localStorage.clear();

let tasksArr = [];

if (localStorage.getItem("tasks")) {
  tasksArr = JSON.parse(localStorage.getItem("tasks"));
  addTask();
}

AddBtn.onclick = function () {
  if (inputTask.value != "") {
    addTaskTotasksArr(inputTask.value);
    addTask();
    addToLocalStorage();
    clearAll();
  }

  inputTask.value = "";
  msgCondition();
};

function addTask() {
  tasksBlock.innerHTML = "";
  if (tasksArr.length > 0) {
    tasksCount.innerHTML = tasksArr.length;
    let finishedArr = tasksArr.filter((task) => task.completed);
    tasksCompleted.innerHTML = finishedArr.length;
    tasksArr.forEach((t) => {
      let taskBox = document.createElement("span");

      taskBox.id = t.id;
      if (t.completed) {
        taskBox.className = "task-box finished";
      } else {
        taskBox.className = "task-box";
      }
      taskBox.append(t.name);
      let delBtn = document.createElement("span");
      delBtn.className = "delete";
      delBtn.textContent = "Delete";
      taskBox.append(delBtn);
      tasksBlock.append(taskBox);
    });
    clearAll();
  }

  removeTask();
  completedTasks();
}

function addTaskTotasksArr(task) {
  let objTask = {
    id: new Date().getTime(),
    name: task,
    completed: false,
  };
  if (tasksArr.length > 0) {
    tasksArr.forEach((el) => {
      if (el.name === task) {
        // console.log("repeted task");
        swal("repeted task");
        // mySweetAlert("repeted task");
        objTask = "";
      }
    });
  }

  if (objTask !== "") {
    tasksArr.push(objTask);
  }
}

function removeTask() {
  let dels = document.querySelectorAll(".delete");
  dels.forEach((el) => {
    el.addEventListener("click", function (ev) {
      tasksArr = tasksArr.filter(
        (task) => task.id != ev.target.parentElement.id
      );
      tasksCount.innerHTML--;
      msgCondition();
    });
  });
}

function addToLocalStorage() {
  if (tasksArr.length > 0)
    localStorage.setItem("tasks", JSON.stringify(tasksArr));
}

function completedTasks() {
  let tasksCont = Array.from(tasksBlock.querySelectorAll(".task-box"));
  tasksCont.forEach((task) => {
    task.addEventListener("click", function (ev) {
      tasksArr.forEach((el) => {
        if (el.id == ev.target.id) {
          if (el.completed) {
            if (tasksCompleted.innerHTML > 0) {
              el.completed = false;
              tasksCompleted.innerHTML--;
            }
          } else {
            el.completed = true;
            tasksCompleted.innerHTML++;
          }
        }
      });
      addToLocalStorage();
      addTask();
    });
  });
}

function msgCondition() {
  if (tasksArr.length > 0) {
    msg.style.display = "none";
  } else {
    msg.style.display = "block";
    localStorage.clear();
  }
}

function mySweetAlert(text) {
  let background = document.createElement("div");
  let alertBox = document.createElement("div");
  let okBtn = document.createElement("span");
  let alertText = document.createElement("span");
  okBtn.innerHTML = "Ok";
  alertText.innerHTML = text;
  alertBox.append(alertText);
  alertBox.append(okBtn);
  background.append(alertBox);
  background.style.cssText =
    "position: fixed; width: 100%; height: 100%; top: 0; left: 0; background-color: rgba(0, 0, 0, .2); display: flex; justify-content: center; align-items: center; z-index: 100";
  alertBox.style.cssText = `
    width: 500px;
    height: 200px;
    background-color: white;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;`;
  okBtn.style.cssText = `padding: 10px 25px;
    background-color: rgb(46, 196, 182);
    font-weight: bold;
    align-self: end;
    border-radius: 5px;
    margin: 20px;
    align-self: end;
    cursor: pointer;
    color: white;`;
  alertText.style.cssText = "margin: auto";
  document.body.append(background);
  okBtn.onclick = function () {
    background.remove();
  };
}

function clearAll() {
  if (tasksArr.length > 0) {
    clearAllTasks.style.display = "inline-block";
    clearAllTasks.onclick = function () {
      tasksArr = [];
      tasksCount.innerHTML = 0;
      tasksCompleted.innerHTML = 0;
      clearAllTasks.style.display = "none";
      addTask();
      msgCondition();
    };
    completedAllTasks.style.display = "inline-block";
    completedAllTasks.onclick = function () {
      tasksCompleted.innerHTML = tasksArr.length;
      tasksArr.forEach((task) => {
        task.completed = true;
      });
      console.log(tasksArr);
      addToLocalStorage();
      let tasksCont = Array.from(tasksBlock.querySelectorAll(".task-box"));
      tasksCont.forEach((task) => {
        task.classList.add("finished");
      });
    };
  }
}
