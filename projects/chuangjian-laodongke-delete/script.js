const listView = document.querySelector("#listView");
const detailView = document.querySelector("#detailView");
const detailCrumbs = document.querySelectorAll(".detail-crumb");
const backToList = document.querySelector("#backToList");
const viewFirstCourse = document.querySelector("#viewFirstCourse");
const homeLaborMenu = document.querySelector("#homeLaborMenu");
const taskCard = document.querySelector("#taskCard");
const editChecklist = document.querySelector("#editChecklist");
const saveChecklist = document.querySelector("#saveChecklist");
const viewActions = document.querySelector(".view-actions");
const manageActions = document.querySelector(".manage-actions");
const deleteSchoolCourse = document.querySelector("#deleteSchoolCourse");
const deleteModal = document.querySelector("#deleteModal");
const cancelDelete = document.querySelector("#cancelDelete");
const confirmDelete = document.querySelector("#confirmDelete");
const schoolCourseCard = document.querySelector("#schoolCourseCard");
const courseTotal = document.querySelector("#courseTotal");

function showDetail() {
  listView.classList.add("hidden");
  detailView.classList.remove("hidden");
  detailCrumbs.forEach((node) => node.classList.remove("hidden"));
}

function showList() {
  detailView.classList.add("hidden");
  listView.classList.remove("hidden");
  detailCrumbs.forEach((node) => node.classList.add("hidden"));
  setChecklistEditing(false);
}

function setChecklistEditing(isEditing) {
  taskCard.classList.toggle("editing", isEditing);
  viewActions.classList.toggle("hidden", isEditing);
  manageActions.classList.toggle("hidden", !isEditing);
}

function setDeleteModalVisible(isVisible) {
  deleteModal.classList.toggle("hidden", !isVisible);
}

viewFirstCourse.addEventListener("click", showDetail);
backToList.addEventListener("click", showList);
homeLaborMenu.addEventListener("click", showList);
editChecklist.addEventListener("click", () => setChecklistEditing(true));
saveChecklist.addEventListener("click", () => setChecklistEditing(false));
deleteSchoolCourse.addEventListener("click", (event) => {
  event.stopPropagation();
  setDeleteModalVisible(true);
});
cancelDelete.addEventListener("click", () => setDeleteModalVisible(false));
deleteModal.addEventListener("click", (event) => {
  if (event.target === deleteModal) {
    setDeleteModalVisible(false);
  }
});
confirmDelete.addEventListener("click", () => {
  schoolCourseCard.remove();
  courseTotal.textContent = "共计 1 门";
  setDeleteModalVisible(false);
});

document.querySelectorAll("a, button:not(#viewFirstCourse):not(#backToList):not(#editChecklist):not(#saveChecklist):not(#deleteSchoolCourse):not(#cancelDelete):not(#confirmDelete)").forEach((node) => {
  node.addEventListener("click", (event) => event.preventDefault());
});
