const schoolFilter = document.querySelector("#schoolFilter");
const schoolSearchSelect = document.querySelector("#schoolSearchSelect");
const clearSchoolFilter = document.querySelector("#clearSchoolFilter");
const schoolOptions = document.querySelector("#schoolOptions");
const schoolYear = document.querySelector("#schoolYear");
const semester = document.querySelector("#semester");
const resetFilters = document.querySelector("#resetFilters");
const queryData = document.querySelector("#queryData");
const toast = document.querySelector("#toast");
const cards = document.querySelectorAll(".metric-card, .summary-card, .rating-card, .rank-card");
const schoolList = ["全部", "张伟的学校", "张伟的学校2", "张伟的学校3", "张伟的学校4", "市南区教育和体育局"];

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 1600);
}

function renderSchoolOptions(keyword = "") {
  const normalized = keyword.trim().toLowerCase();
  const options = schoolList.filter((school) => !normalized || school.toLowerCase().includes(normalized));

  schoolOptions.innerHTML = "";

  if (!options.length) {
    const empty = document.createElement("div");
    empty.className = "search-option empty";
    empty.textContent = "暂无匹配学校";
    schoolOptions.append(empty);
    return;
  }

  options.forEach((school, index) => {
    const option = document.createElement("button");
    option.className = `search-option${index === 0 ? " active" : ""}`;
    option.type = "button";
    option.role = "option";
    option.textContent = school;
    option.addEventListener("mousedown", (event) => {
      event.preventDefault();
      schoolFilter.value = school;
      schoolSearchSelect.classList.add("has-value");
      schoolSearchSelect.classList.remove("open", "searching");
      clearSchoolFilter.setAttribute("aria-label", "展开学校选项");
    });
    schoolOptions.append(option);
  });
}

function openSchoolOptions() {
  renderSchoolOptions(schoolFilter.value === "全部" ? "" : schoolFilter.value);
  schoolSearchSelect.classList.add("open");
}

schoolFilter.addEventListener("focus", openSchoolOptions);

schoolFilter.addEventListener("input", () => {
  schoolSearchSelect.classList.add("open");
  schoolSearchSelect.classList.toggle("has-value", Boolean(schoolFilter.value));
  schoolSearchSelect.classList.toggle("searching", Boolean(schoolFilter.value.trim()));
  clearSchoolFilter.setAttribute("aria-label", schoolFilter.value.trim() ? "清空学校筛选" : "展开学校选项");
  renderSchoolOptions(schoolFilter.value);
});

schoolFilter.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    schoolSearchSelect.classList.remove("open");
    schoolFilter.blur();
  }
});

schoolFilter.addEventListener("blur", () => {
  window.setTimeout(() => {
    schoolSearchSelect.classList.remove("open");
    if (!schoolFilter.value.trim()) {
      schoolFilter.value = "全部";
      schoolSearchSelect.classList.add("has-value");
      schoolSearchSelect.classList.remove("searching");
    }
  }, 120);
});

clearSchoolFilter.addEventListener("mousedown", (event) => event.preventDefault());
clearSchoolFilter.addEventListener("click", () => {
  if (!schoolSearchSelect.classList.contains("searching")) {
    schoolFilter.focus();
    openSchoolOptions();
    return;
  }
  schoolFilter.value = "";
  schoolSearchSelect.classList.remove("has-value", "searching");
  clearSchoolFilter.setAttribute("aria-label", "展开学校选项");
  schoolFilter.focus();
  renderSchoolOptions();
});

resetFilters.addEventListener("click", () => {
  schoolFilter.value = "全部";
  schoolSearchSelect.classList.add("has-value");
  schoolSearchSelect.classList.remove("searching", "open");
  clearSchoolFilter.setAttribute("aria-label", "展开学校选项");
  schoolYear.value = "2026~2027";
  semester.value = "上学期";
  showToast("筛选条件已重置");
});

queryData.addEventListener("click", () => {
  const selectedSchool = schoolFilter.value.trim() || "全部";
  showToast(`已查询 ${selectedSchool} ${schoolYear.value} ${semester.value} 数据`);
});

cards.forEach((card) => {
  card.addEventListener("click", () => {
    cards.forEach((item) => item.classList.remove("picked"));
    card.classList.add("picked");
  });
});
