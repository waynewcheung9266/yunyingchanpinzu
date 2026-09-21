const courseEvaluations = [
  {
    id: 1,
    title: "李明轩的劳动课程名称",
    status: "pending",
    submittedAt: "2026-09-20 15:21:41",
    student: "李明轩",
    className: "二年级1班",
    cover: "labor-cover.svg"
  },
  {
    id: 2,
    title: "王子涵的劳动课程名称",
    status: "done",
    submittedAt: "2026-09-20 15:13:35",
    student: "王子涵",
    className: "二年级1班",
    cover: "labor-cover.svg"
  },
  {
    id: 3,
    title: "陈思远的特色校本课",
    status: "pending",
    submittedAt: "2026-09-20 17:36:59",
    student: "陈思远",
    className: "二年级1班",
    cover: "space-cover.svg"
  }
];

const homeEvaluations = [
  { id: 101, student: "赵一诺", status: "pending", className: "二年级", progress: 0 },
  { id: 102, student: "刘嘉琪", status: "pending", className: "二年级", progress: 0 },
  { id: 103, student: "孙浩然", status: "pending", className: "二年级", progress: 0 },
  { id: 104, student: "周雨桐", status: "done", className: "二年级", progress: 0 },
  { id: 105, student: "吴泽宇", status: "done", className: "二年级", progress: 0 },
  { id: 106, student: "郑可欣", status: "done", className: "二年级", progress: 100 }
];

let activeTab = "course";
let activeFilter = "all";
let editingId = null;
let homeSmartRows = [];
let processingTimers = [];
let processingPaused = false;

const grid = document.querySelector("#courseGrid");
const visibleCount = document.querySelector("#visibleCount");
const dialog = document.querySelector("#ratingDialog");
const saveRating = document.querySelector("#saveRating");
const dialogTitle = document.querySelector(".dialog-head h2");
const smartDialog = document.querySelector("#smartDialog");
const smartResultRows = document.querySelector("#smartResultRows");
const smartProgressText = document.querySelector("#smartProgressText");
const excellentCount = document.querySelector("#excellentCount");
const confirmSmartResult = document.querySelector("#confirmSmartResult");
const startSmartDialog = document.querySelector("#startSmartDialog");
const startSmartButton = document.querySelector("#startSmartButton");
const pendingTaskCount = document.querySelector("#pendingTaskCount");
const pendingTaskIcon = document.querySelector("#pendingTaskIcon");
const homeProcessingDialog = document.querySelector("#homeProcessingDialog");
const processingStage = document.querySelector("#processingStage");
const indicatorGrid = document.querySelector("#indicatorGrid");
const processingStudentName = document.querySelector("#processingStudentName");
const processingClassName = document.querySelector("#processingClassName");
const processingProgressBar = document.querySelector("#processingProgressBar");
const processingProgressText = document.querySelector("#processingProgressText");
const processingExcellent = document.querySelector("#processingExcellent");
const pauseProcessingButton = document.querySelector("#pauseProcessingButton");

function activeList() {
  return activeTab === "home" ? homeEvaluations : courseEvaluations;
}

function statusLabel(status) {
  return status === "done" ? "◎ 已评价" : "未评价";
}

function courseCardTemplate(course) {
  const isDone = course.status === "done";
  return `
    <article class="course-card" data-status="${course.status}">
      <div class="course-cover">
        <img src="./assets/${course.cover}" alt="课程封面" />
      </div>
      <div class="course-info">
        <div class="course-title">
          <span>${course.title}</span>
          <span class="status-tag ${course.status}">${statusLabel(course.status)}</span>
        </div>
        <p class="submit-time">提交时间： ${course.submittedAt}</p>
        <div class="student-row">
          <div class="student-avatar" aria-hidden="true">🌼</div>
          <div class="student-meta">
            <strong>${course.student}</strong>
            <span>${course.className}</span>
          </div>
          <button class="card-action ${isDone ? "outline" : "primary"}" data-id="${course.id}" type="button">
            ${isDone ? "查 看" : "去评价"}
          </button>
        </div>
      </div>
    </article>
  `;
}

function homeCardTemplate(item) {
  const isDone = item.status === "done";
  return `
    <article class="home-card" data-status="${item.status}">
      <div class="home-student-row">
        <div class="student-avatar" aria-hidden="true">🌼</div>
        <div class="home-student-name">
          <strong>${item.student}</strong>
          <span>${item.className}</span>
        </div>
        <span class="status-tag ${item.status}">${statusLabel(item.status)}</span>
      </div>
      <div class="home-progress-row">
        <span>完成进度:</span>
        <div class="progress-track" aria-label="完成进度 ${item.progress}%">
          <span style="width: ${item.progress}%"></span>
        </div>
        <strong>${item.progress}%</strong>
        <button class="card-action ${isDone ? "outline" : "primary"}" data-id="${item.id}" type="button">
          ${isDone ? "查 看" : "去评价"}
        </button>
      </div>
    </article>
  `;
}

function renderEvaluations() {
  const visible = activeList().filter((item) => activeFilter === "all" || item.status === activeFilter);
  grid.classList.toggle("home-grid", activeTab === "home");
  grid.innerHTML = visible.map(activeTab === "home" ? homeCardTemplate : courseCardTemplate).join("");
  visibleCount.textContent = visible.length;
}

function formatClassName(className) {
  return className.includes("班") ? className.replace("年级", "年级(").replace("班", "班)") : `${className}(1班)`;
}

function renderSmartDialog() {
  const pendingCourses = courseEvaluations.filter((item) => item.status === "pending");
  const rows =
    activeTab === "home"
      ? homeSmartRows
      : pendingCourses.length
        ? pendingCourses
        : courseEvaluations.slice(0, 1);

  smartProgressText.textContent = `${rows.length}/${rows.length}`;
  excellentCount.textContent = rows.length;
  smartResultRows.innerHTML = rows
    .map((item) => {
      return `
        <tr>
          <td>${item.student}</td>
          <td>${formatClassName(item.className)}</td>
          <td>优秀</td>
          <td>优秀</td>
          <td><button class="table-link" data-id="${item.id}" type="button">修改成绩</button></td>
        </tr>
      `;
    })
    .join("");
}

function pendingCourseCount() {
  const pendingCourses = courseEvaluations.filter((item) => item.status === "pending");
  return pendingCourses.length || 1;
}

function pendingHomeCount() {
  const pendingHomeItems = homeEvaluations.filter((item) => item.status === "pending");
  return pendingHomeItems.length || 1;
}

function openStartSmartDialog() {
  pendingTaskCount.textContent = activeTab === "home" ? pendingHomeCount() : pendingCourseCount();
  pendingTaskIcon.classList.toggle("orange", activeTab === "home");
  startSmartDialog.showModal();
}

function clearProcessingTimers() {
  processingTimers.forEach((timer) => clearTimeout(timer));
  processingTimers = [];
}

function resetProcessingDialog() {
  clearProcessingTimers();
  processingPaused = false;
  processingStage.classList.remove("entering", "leaving");
  indicatorGrid.querySelectorAll(".indicator-item").forEach((item) => {
    item.classList.remove("done", "leaving");
    item.querySelector("span").textContent = "正在分析...";
  });
  processingProgressBar.style.width = "0%";
  processingProgressText.textContent = `0/${homeSmartRows.length}`;
  processingExcellent.textContent = "0";
  pauseProcessingButton.textContent = "暂停";
}

function resetIndicatorsForStudent(student, shouldEnter = false) {
  processingStudentName.textContent = student.student;
  processingClassName.textContent = `${student.className} 1班`;
  indicatorGrid.querySelectorAll(".indicator-item").forEach((item) => {
    item.classList.remove("done", "leaving");
    item.querySelector("span").textContent = "正在分析...";
  });
  processingStage.classList.remove("leaving", "entering");
  if (shouldEnter) {
    processingStage.classList.add("entering");
    processingTimers.push(
      setTimeout(() => {
        processingStage.classList.remove("entering");
      }, 420)
    );
  }
}

function updateProcessingProgress(completedStudents) {
  const total = homeSmartRows.length;
  processingProgressText.textContent = `${completedStudents}/${total}`;
  processingProgressBar.style.width = `${(completedStudents / total) * 100}%`;
  processingExcellent.textContent = String(completedStudents);
}

function finishHomeProcessing() {
  homeSmartRows.forEach((item) => {
    item.status = "done";
    item.progress = 100;
    item.result = "优秀";
    item.score = "优秀";
  });
  resetStatusFilter();
  renderEvaluations();
  homeProcessingDialog.close();
  renderSmartDialog();
  smartDialog.showModal();
}

function startHomeProcessing() {
  homeSmartRows = homeEvaluations.filter((item) => item.status === "pending");
  if (!homeSmartRows.length) homeSmartRows = homeEvaluations.slice(0, 1);
  resetProcessingDialog();
  resetIndicatorsForStudent(homeSmartRows[0]);
  homeProcessingDialog.showModal();
  runStudentProcessing(0);
}

function runStudentProcessing(studentIndex) {
  if (processingPaused) return;
  if (studentIndex >= homeSmartRows.length) {
    finishHomeProcessing();
    return;
  }

  resetIndicatorsForStudent(homeSmartRows[studentIndex], studentIndex > 0);

  const items = [...indicatorGrid.querySelectorAll(".indicator-item")];
  items.forEach((item, index) => {
    processingTimers.push(
      setTimeout(() => {
        if (processingPaused) return;
        item.classList.add("done");
        item.querySelector("span").textContent = "已完成";
      }, 520 + index * 430)
    );

    processingTimers.push(
      setTimeout(() => {
        if (processingPaused) return;
        item.classList.add("leaving");
      }, 900 + index * 430)
    );
  });

  processingTimers.push(
    setTimeout(() => {
      if (processingPaused) return;
      updateProcessingProgress(studentIndex + 1);
      processingStage.classList.add("leaving");
    }, 2850)
  );

  processingTimers.push(
    setTimeout(() => {
      if (processingPaused) return;
      runStudentProcessing(studentIndex + 1);
    }, 3350)
  );
}

function setPage(page) {
  document.querySelectorAll("[data-panel]").forEach((panel) => {
    panel.classList.toggle("hidden", panel.dataset.panel !== (page === "labor" ? "labor" : "placeholder"));
  });

  document.querySelectorAll("[data-page]").forEach((item) => {
    item.classList.toggle("selected", item.dataset.page === page);
  });
}

function resetStatusFilter() {
  activeFilter = "all";
  document.querySelectorAll("[data-filter]").forEach((item) => {
    item.classList.toggle("active", item.dataset.filter === "all");
  });
}

document.querySelectorAll(".group-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const group = button.closest(".nav-group");
    group.classList.toggle("expanded");
    const chevron = button.querySelector(".chevron");
    if (chevron) chevron.textContent = group.classList.contains("expanded") ? "⌃" : "⌄";
  });
});

document.querySelectorAll("[data-page]").forEach((button) => {
  button.addEventListener("click", () => setPage(button.dataset.page));
});

document.querySelectorAll("[data-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    activeTab = button.dataset.tab;
    document.querySelectorAll("[data-tab]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    resetStatusFilter();
    renderEvaluations();
  });
});

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderEvaluations();
  });
});

grid.addEventListener("click", (event) => {
  const button = event.target.closest(".card-action");
  if (!button) return;
  editingId = Number(button.dataset.id);
  dialogTitle.textContent = activeTab === "home" ? "家庭劳动评价" : "劳动课程评价";
  document.querySelector("#ratingLevel").value = "优秀";
  dialog.showModal();
});

saveRating.addEventListener("click", () => {
  if (!editingId) return;
  const item = activeList().find((entry) => entry.id === editingId);
  item.status = "done";
  if ("progress" in item && item.progress === 0) item.progress = 100;
  renderEvaluations();
});

document.querySelector("#smartEvaluate").addEventListener("click", () => {
  openStartSmartDialog();
});

startSmartButton.addEventListener("click", () => {
  startSmartDialog.close();
  if (activeTab === "home") {
    startHomeProcessing();
    return;
  }

  renderSmartDialog();
  smartDialog.showModal();
});

smartResultRows.addEventListener("click", (event) => {
  const button = event.target.closest(".table-link");
  if (!button) return;
  editingId = Number(button.dataset.id);
  smartDialog.close();
  dialogTitle.textContent = activeTab === "home" ? "家庭劳动评价" : "劳动课程评价";
  document.querySelector("#ratingLevel").value = "优秀";
  dialog.showModal();
});

confirmSmartResult.addEventListener("click", () => {
  activeList().forEach((item) => {
    item.status = "done";
    if ("progress" in item && item.progress === 0) item.progress = 100;
    item.result = "优秀";
    item.score = "优秀";
  });
  resetStatusFilter();
  renderEvaluations();
});

pauseProcessingButton.addEventListener("click", () => {
  processingPaused = true;
  clearProcessingTimers();
  pauseProcessingButton.textContent = "已暂停";
});

homeProcessingDialog.addEventListener("close", clearProcessingTimers);

renderEvaluations();
