document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task");
  const addTaskBtn = document.getElementById("add");
  const taskList = document.getElementById("task-list");
  const empty = document.querySelector(".empty");
  const todoContainer = document.querySelector(".todo-container");
  const progressBar = document.getElementById("progress");
  const number = document.getElementById("number");

  const toggleEmpty = () => {
    empty.style.display = taskList.children.length === 0 ? "block" : "none";
    todoContainer.style.width = taskList.children.length > 0 ? "100%" : "50%";
  };

  const updateProgress = (checkCompleteion = true) => {
    const totalTask = taskList.children.length;
    const completedTasks =
      taskList.querySelectorAll(".checkbox:checked").length;

    progressBar.style.width = totalTask
      ? `${(completedTasks / totalTask) * 100}%`
      : "0%";
    number.textContent = `${completedTasks} / ${totalTask}`;

    if (checkCompleteion && totalTask > 0 && completedTasks === totalTask) {
      Confetti();
    }
  };

  const saveTask = () => {
    const tasks = Array.from(taskList.querySelectorAll("li")).map((li) => ({
      text: li.querySelector("span").textContent,
      completed: li.querySelector(".checkbox").checked,
    }));
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const loadTaskfls = () => {
    const savedTask = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTask.forEach(({ text, completed }) => addTask(text, completed, false));
    toggleEmpty();
    updateProgress();
  };

  const addTask = (text, completed = false, checkCompleteion = true) => {
    const taskText = text || taskInput.value.trim();
    if (!taskText) return;

    const li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" class="checkbox" ${completed ? "checked" : ""}/>
      <span>${taskText}</span>
      <div class="task-btn">
        <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
        <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;

    const checkBox = li.querySelector(".checkbox");
    const editBtn = li.querySelector(".edit-btn");

    if (completed) {
      li.classList.add("completed");
      editBtn.disabled = true;
      editBtn.style.opacity = "0.5";
      editBtn.style.pointerEvents = "none";
    }

    checkBox.addEventListener("change", () => {
      const isChecked = checkBox.checked;
      li.classList.toggle("completed", isChecked);
      editBtn.disabled = isChecked;
      editBtn.style.opacity = isChecked ? "0.5" : "1";
      editBtn.style.pointerEvents = isChecked ? "none" : "auto";
      updateProgress();
      saveTask();
    });

    editBtn.addEventListener("click", () => {
      if (!checkBox.checked) {
        taskInput.value = li.querySelector("span").textContent;
        li.remove();
        toggleEmpty();
        updateProgress(false);
        saveTask();
      }
    });

    li.querySelector(".delete-btn").addEventListener("click", () => {
      li.remove();
      toggleEmpty();
      updateProgress();
      saveTask();
    });

    taskList.appendChild(li);
    taskInput.value = "";
    toggleEmpty();
    updateProgress(checkCompleteion);
    saveTask();
  };

  addTaskBtn.addEventListener("click", (e) => {
    e.preventDefault();
    addTask();
  });

  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTask();
    }
  });
  loadTaskfls();
});

const Confetti = () => {
  const end = Date.now() + 15 * 1000;

  // go Buckeyes!
  const colors = ["#bb0000", "#ffffff"];

  (function frame() {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
    });

    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
};
