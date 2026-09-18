const listView = document.querySelector("#listView");
const detailView = document.querySelector("#detailView");
const createCheckView = document.querySelector("#createCheckView");
const detailCrumbs = document.querySelectorAll(".detail-crumb");
const backToList = document.querySelector("#backToList");
const detailCrumbLabel = document.querySelector("strong.detail-crumb");
const academicMenu = document.querySelector("#academicMenu");
const academicSubMenus = document.querySelectorAll(".academic-sub");
const academicPlaceholder = document.querySelector("#academicPlaceholder");
const academicTitle = document.querySelector("#academicTitle");
const homeLaborMenu = document.querySelector("#homeLaborMenu");
const homeLaborList = document.querySelector("#homeLaborList");
const homeLaborDetail = document.querySelector("#homeLaborDetail");
const viewFirstCourse = document.querySelector("#viewFirstCourse");
const taskCard = document.querySelector("#taskCard");
const editChecklist = document.querySelector("#editChecklist");
const saveChecklist = document.querySelector("#saveChecklist");
const laborViewActions = document.querySelector(".labor-view-actions");
const laborManageActions = document.querySelector(".labor-manage-actions");
const deleteSchoolCourse = document.querySelector("#deleteSchoolCourse");
const schoolCourseCard = document.querySelector("#schoolCourseCard");
const courseTotal = document.querySelector("#courseTotal");
const inspectionRootMenu = document.querySelector("#inspectionRootMenu");
const inspectionSubMenus = document.querySelectorAll(".inspection-sub");
const selfCheckMenu = document.querySelector("#selfCheckMenu");
const createSelfCheck = document.querySelector("#createSelfCheck");
const createUploadAttachment = document.querySelector("#createUploadAttachment");
const createUploadInput = document.querySelector("#createUploadInput");
const createAttachmentPanel = document.querySelector("#createAttachmentPanel");
const createAttachmentList = document.querySelector("#createAttachmentList");
const createAttachmentCount = document.querySelector("#createAttachmentCount");
const selfNoteToggle = document.querySelector("#selfNoteToggle");
const selfNoteEditor = document.querySelector("#selfNoteEditor");
const deleteSelfNote = document.querySelector("#deleteSelfNote");
const cancelCreate = document.querySelector("#cancelCreate");
const submitCreate = document.querySelector("#submitCreate");
const reportTableBody = document.querySelector("#reportTableBody");
const reportTotal = document.querySelector("#reportTotal");
const viewReport = document.querySelector("#viewReport");
const demoPendingRow = document.querySelector("#demoPendingRow");
const attachmentList = document.querySelector("#attachmentList");
const attachmentCount = document.querySelector("#attachmentCount");
const detailAttachmentPanel = document.querySelector("#detailAttachmentPanel");
const createMonth = document.querySelector("#createMonth");
const createDescription = document.querySelector("#createDescription");
const createBureauType = document.querySelector("#createBureauType");
const createTemplate = document.querySelector("#createTemplate");
const createCheckResult = document.querySelector("#createCheckResult");
const createRectification = document.querySelector("#createRectification");
const createSelfNoteText = document.querySelector("#createSelfNoteText");
const detailMonth = document.querySelector("#detailMonth");
const detailDescription = document.querySelector("#detailDescription");
const detailBureauType = document.querySelector("#detailBureauType");
const detailTemplate = document.querySelector("#detailTemplate");
const detailTitle = document.querySelector("#detailTitle");
const detailCheckResult = document.querySelector("#detailCheckResult");
const detailRectification = document.querySelector("#detailRectification");
const detailSelfNote = document.querySelector("#detailSelfNote");
const detailReviewRow = document.querySelector("#detailReviewRow");
const deleteModal = document.querySelector("#deleteModal");
const deleteTitle = document.querySelector("#deleteTitle");
const deleteMessage = document.querySelector("#deleteMessage");
const cancelDelete = document.querySelector("#cancelDelete");
const confirmDelete = document.querySelector("#confirmDelete");
const previewModal = document.querySelector("#previewModal");
const previewBody = document.querySelector("#previewBody");
const closePreview = document.querySelector("#closePreview");

let pendingDeleteNode = null;
let pendingDeleteKind = "attachment";
let detailContext = "inspection";
let createdReportAdded = false;
let createUploadedFiles = [];
let submittedAttachments = [];

function createDemoImageFile() {
  const jpegBase64 = "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAVEAEBAAAAAAAAAAAAAAAAAAAAAf/aAAwDAQACEAMQAAABlA//xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAEFAqf/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAEDAQE/ASP/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAECAQE/ASP/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAY/Amf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAE/IX//2gAMAwEAAgADAAAAEP/EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQMBAT8QH//EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQIBAT8QH//EABQQAQAAAAAAAAAAAAAAAAAAABD/2gAIAQEAAT8QH//Z";
  const bytes = Uint8Array.from(atob(jpegBase64), (char) => char.charCodeAt(0));
  return new File([bytes], "自查现场照片.jpg", { type: "image/jpeg" });
}

function createDemoPdfFile() {
  const pdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 180] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 78 >>
stream
BT /F1 18 Tf 38 116 Td (Self Check Demo PDF) Tj 0 -28 Td (Attachment for preview.) Tj ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000240 00000 n 
0000000368 00000 n 
trailer
<< /Root 1 0 R /Size 6 >>
startxref
438
%%EOF`;
  return new File([pdf], "校自查考核说明.pdf", { type: "application/pdf" });
}

function hideAllPages() {
  listView.classList.add("hidden");
  detailView.classList.add("hidden");
  academicPlaceholder.classList.add("hidden");
  homeLaborList.classList.add("hidden");
  homeLaborDetail.classList.add("hidden");
  createCheckView.classList.add("hidden");
}

function showDetail(showReview = true) {
  detailContext = "inspection";
  syncSubmittedAttachmentsToDetail();
  hideAllPages();
  detailView.classList.remove("hidden");
  detailReviewRow.classList.toggle("hidden", !showReview);
  backToList.textContent = "考察管理";
  detailCrumbLabel.textContent = "校自查考核详情";
  detailCrumbs.forEach((node) => node.classList.remove("hidden"));
}

function showList() {
  hideAllPages();
  listView.classList.remove("hidden");
  backToList.textContent = "考察管理";
  detailCrumbs.forEach((node) => node.classList.add("hidden"));
  setChecklistEditing(false);
  setMenuGroup("inspection");
}

function showCreateCheck() {
  detailContext = "createCheck";
  setChecklistEditing(false);
  setMenuGroup("inspection");
  hideAllPages();
  createCheckView.classList.remove("hidden");
  backToList.textContent = "考察管理";
  detailCrumbLabel.textContent = "创建自查";
  detailCrumbs.forEach((node) => node.classList.remove("hidden"));
}

function resetCreateForm() {
  createMonth.value = "2026-01";
  createDescription.value = "";
  createBureauType.childNodes[0].textContent = "市级";
  createTemplate.childNodes[0].textContent = "张伟的自查表教育创建";
  createCheckResult.value = "我是标题";
  createRectification.value = "";
  createSelfNoteText.value = "";
  selfNoteEditor.classList.add("hidden");
  renderCreateAttachments([]);
}

function showCreateBlank() {
  resetCreateForm();
  showCreateCheck();
}

function renderCreateAttachments(files) {
  createUploadedFiles = [...files];
  createAttachmentList.innerHTML = "";
  createUploadedFiles.forEach((file) => {
    createAttachmentList.appendChild(createCreateAttachmentItem(file));
  });
  updateCreateAttachmentCount();
}

function editReportFromRow(row) {
  const cells = row.querySelectorAll("td");
  createMonth.value = cells[0].textContent.trim();
  createDescription.value = cells[1].textContent.trim();
  createBureauType.childNodes[0].textContent = cells[2].textContent.trim();
  createTemplate.childNodes[0].textContent = cells[3].textContent.trim();
  createCheckResult.value = "我是标题";
  createRectification.value = cells[1].textContent.trim() || "111";
  createSelfNoteText.value = "1212121";
  selfNoteEditor.classList.remove("hidden");
  renderCreateAttachments(submittedAttachments);
  showCreateCheck();
}

function setMenuGroup(group) {
  const isAcademic = group === "academic";

  academicMenu.classList.toggle("blue", isAcademic);
  academicMenu.classList.toggle("open", isAcademic);
  academicMenu.querySelector("b").textContent = isAcademic ? "⌃" : "⌄";
  academicSubMenus.forEach((node, index) => {
    node.classList.toggle("hidden", !isAcademic);
    node.classList.toggle("active", isAcademic && index === 0);
  });

  inspectionRootMenu.classList.toggle("blue", !isAcademic);
  inspectionRootMenu.classList.toggle("open", !isAcademic);
  inspectionRootMenu.querySelector("b").textContent = isAcademic ? "⌄" : "⌃";
  inspectionSubMenus.forEach((node, index) => {
    node.classList.toggle("hidden", isAcademic);
    node.classList.toggle("active", !isAcademic && index === 0);
  });
}

function showAcademicPlaceholder(title) {
  setChecklistEditing(false);
  setMenuGroup("academic");
  hideAllPages();
  academicPlaceholder.classList.remove("hidden");
  backToList.textContent = "教务管理";
  detailCrumbs.forEach((node) => node.classList.add("hidden"));
  academicTitle.textContent = title;
}

function showHomeLaborList() {
  setChecklistEditing(false);
  setMenuGroup("academic");
  hideAllPages();
  homeLaborList.classList.remove("hidden");
  backToList.textContent = "教务管理";
  detailCrumbs.forEach((node) => node.classList.add("hidden"));
  academicSubMenus.forEach((item) => item.classList.remove("active"));
  homeLaborMenu.classList.add("active");
}

function showHomeLaborDetail() {
  detailContext = "homeLabor";
  hideAllPages();
  homeLaborDetail.classList.remove("hidden");
  backToList.textContent = "家庭劳动";
  detailCrumbLabel.textContent = "家庭劳动详情";
  detailCrumbs.forEach((node) => node.classList.remove("hidden"));
}

function setChecklistEditing(isEditing) {
  taskCard.classList.toggle("editing", isEditing);
  laborViewActions.classList.toggle("hidden", isEditing);
  laborManageActions.classList.toggle("hidden", !isEditing);
}

function formatSize(size) {
  if (size >= 1024 * 1024) {
    return `${(size / 1024 / 1024).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(size / 1024))} KB`;
}

function getFileType(fileName) {
  const extension = fileName.split(".").pop().toUpperCase();

  if (["JPG", "JPEG", "PNG", "GIF", "WEBP", "SVG"].includes(extension)) {
    return "IMG";
  }

  if (["DOC", "DOCX"].includes(extension)) {
    return "DOC";
  }

  return extension || "FILE";
}

function updateAttachmentCount() {
  const count = attachmentList.querySelectorAll(".attachment-item").length;
  attachmentCount.textContent = `共 ${count} 个`;
  detailAttachmentPanel.classList.toggle("hidden", count === 0);
}

function updateCreateAttachmentCount() {
  const count = createAttachmentList.querySelectorAll(".attachment-item").length;
  createAttachmentCount.textContent = `共 ${count} 个`;
  createAttachmentPanel.classList.toggle("hidden", count === 0);
}

function isAllowedAttachment(file) {
  const type = file.type || "";
  const name = file.name.toLowerCase();
  return type.startsWith("image/") || type === "application/pdf" || /\.(jpg|jpeg|png|gif|webp|pdf)$/.test(name);
}

function createAttachmentItem(file) {
  const type = getFileType(file.name);
  const isImage = type === "IMG";
  const fileUrl = URL.createObjectURL(file);
  const preview = isImage
    ? `<img class="attachment-thumb detail-thumb" src="${fileUrl}" alt="${file.name}" />`
    : `<div class="file-mark ${type === "PDF" ? "pdf" : "doc"}">${type}</div>`;
  const item = document.createElement("article");
  item.className = "attachment-item detail-attachment-item";
  item.innerHTML = `
    ${preview}
    <div class="attachment-copy">
      <h3>${file.name}</h3>
    </div>
    <div class="detail-attachment-actions">
      <button class="detail-preview">预览</button>
      <button class="detail-download">下载</button>
    </div>
  `;
  item.querySelector(".detail-preview").addEventListener("click", () => {
    openPreview(fileUrl, isImage, file.name);
  });
  item.querySelector(".detail-download").addEventListener("click", () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = file.name;
    link.click();
  });
  return item;
}

function openPreview(fileUrl, isImage, fileName) {
  previewBody.innerHTML = isImage
    ? `<img class="preview-image" src="${fileUrl}" alt="${fileName}" />`
    : `<iframe class="preview-frame" src="${fileUrl}" title="${fileName}"></iframe>`;
  previewModal.classList.toggle("pdf-preview", !isImage);
  closePreview.textContent = isImage ? "×" : "关闭预览";
  previewModal.classList.remove("hidden");
}

function syncSubmittedAttachmentsToDetail() {
  attachmentList.innerHTML = "";
  if (submittedAttachments.length === 0) {
    updateAttachmentCount();
    return;
  }

  submittedAttachments.forEach((file) => {
    attachmentList.appendChild(createAttachmentItem(file));
  });
  updateAttachmentCount();
}

submittedAttachments = [createDemoImageFile(), createDemoPdfFile()];
syncSubmittedAttachmentsToDetail();

function getSelectText(button) {
  return button.childNodes[0].textContent.trim();
}

function syncCreatedDataToDetail() {
  const month = createMonth.value.trim() || "--";
  const description = createDescription.value.trim() || "--";
  const bureauType = getSelectText(createBureauType) || "--";
  const template = getSelectText(createTemplate) || "--";
  const checkResult = createCheckResult.value.trim() || "--";
  const rectification = createRectification.value.trim() || "--";
  const selfNote = selfNoteEditor.classList.contains("hidden") ? "--" : (createSelfNoteText.value.trim() || "--");

  detailMonth.textContent = month;
  detailDescription.textContent = description;
  detailBureauType.textContent = bureauType;
  detailTemplate.textContent = template;
  detailTitle.textContent = template;
  detailCheckResult.textContent = checkResult;
  detailRectification.textContent = rectification;
  detailSelfNote.textContent = selfNote;
}

function createCreateAttachmentItem(file) {
  const type = getFileType(file.name);
  const isImage = type === "IMG";
  const preview = isImage
    ? `<img class="attachment-thumb" src="${URL.createObjectURL(file)}" alt="${file.name}" />`
    : `<div class="file-mark pdf">PDF</div>`;
  const item = document.createElement("article");
  item.className = "attachment-item";
  item.innerHTML = `
    ${preview}
    <div class="attachment-copy">
      <h3>${file.name}</h3>
    </div>
    <button class="row-delete visible create-attachment-delete">删除</button>
  `;
  item.querySelector(".create-attachment-delete").addEventListener("click", () => {
    createUploadedFiles = createUploadedFiles.filter((uploadedFile) => uploadedFile !== file);
    item.remove();
    updateCreateAttachmentCount();
  });
  return item;
}

function bindReportView(button) {
  button.addEventListener("click", () => showDetail(true));
}

function bindCreatedReportActions(row) {
  let isSubmitted = false;
  row.querySelector(".created-report-view").addEventListener("click", () => showDetail(isSubmitted));
  row.querySelector(".created-report-edit").addEventListener("click", () => editReportFromRow(row));
  row.querySelector(".created-report-submit").addEventListener("click", () => {
    isSubmitted = true;
    row.querySelector(".status-pending").textContent = "已提交";
    row.querySelector(".created-report-edit").remove();
    row.querySelector(".created-report-submit").remove();
  });
}

function addCreatedReportToList() {
  submittedAttachments = [...createUploadedFiles];
  syncCreatedDataToDetail();
  syncSubmittedAttachmentsToDetail();

  if (createdReportAdded) {
    showList();
    return;
  }

  const row = document.createElement("tr");
  const month = createMonth.value.trim() || "2026-01";
  const description = createDescription.value.trim();
  const bureauType = getSelectText(createBureauType) || "市级";
  const template = getSelectText(createTemplate) || "张伟的自查表教育创建";
  row.innerHTML = `
    <td>${month}</td>
    <td>${description}</td>
    <td>${bureauType}</td>
    <td>${template}</td>
    <td><span class="status-pending">未提审</span></td>
    <td>2026-09-18 00:00:00</td>
    <td>
      <div class="table-actions">
        <button class="link-btn created-report-view">查看</button>
        <button class="link-btn created-report-edit">编辑</button>
        <button class="link-btn created-report-submit">提交审核</button>
      </div>
    </td>
  `;
  reportTableBody.appendChild(row);
  bindCreatedReportActions(row);
  createdReportAdded = true;
  reportTotal.textContent = "共 3 条数据";
  showList();
}

function openDeleteModal(node, kind = "attachment") {
  pendingDeleteNode = node;
  pendingDeleteKind = kind;
  deleteTitle.textContent = kind === "laborCourse" ? "确认删除？" : "确认删除附件？";
  deleteMessage.textContent = kind === "laborCourse" ? "删除后 2 项家庭劳动任务将一起删除。" : "删除后该附件将从校自查考核表单中移除。";
  deleteModal.classList.remove("hidden");
}

function bindAttachmentDelete(button) {
  button.addEventListener("click", () => {
    openDeleteModal(button.closest(".attachment-item"), "attachment");
  });
}

bindReportView(viewReport);
bindCreatedReportActions(demoPendingRow);
createSelfCheck.addEventListener("click", showCreateBlank);
backToList.addEventListener("click", () => {
  if (detailContext === "homeLabor") {
    showHomeLaborList();
  } else if (detailContext === "createCheck") {
    showList();
  } else {
    showList();
  }
});
selfCheckMenu.addEventListener("click", showList);
inspectionRootMenu.addEventListener("click", showList);
academicMenu.addEventListener("click", () => showAcademicPlaceholder("转校管理"));
academicSubMenus.forEach((node) => {
  node.addEventListener("click", () => {
    academicSubMenus.forEach((item) => item.classList.remove("active"));
    node.classList.add("active");
    if (node === homeLaborMenu) {
      showHomeLaborList();
    } else {
      homeLaborList.classList.add("hidden");
      homeLaborDetail.classList.add("hidden");
      academicPlaceholder.classList.remove("hidden");
      academicTitle.textContent = node.textContent.trim();
    }
  });
});
viewFirstCourse.addEventListener("click", showHomeLaborDetail);
homeLaborMenu.addEventListener("click", showHomeLaborList);
editChecklist.addEventListener("click", () => setChecklistEditing(true));
saveChecklist.addEventListener("click", () => setChecklistEditing(false));
deleteSchoolCourse.addEventListener("click", (event) => {
  event.stopPropagation();
  openDeleteModal(schoolCourseCard, "laborCourse");
});
createUploadAttachment.addEventListener("click", () => {
  createUploadInput.click();
});

selfNoteToggle.addEventListener("click", () => {
  selfNoteEditor.classList.remove("hidden");
});

deleteSelfNote.addEventListener("click", () => {
  selfNoteEditor.classList.add("hidden");
  selfNoteEditor.querySelector("textarea").value = "";
});

createUploadInput.addEventListener("change", () => {
  Array.from(createUploadInput.files).forEach((file) => {
    if (isAllowedAttachment(file)) {
      createUploadedFiles.push(file);
      createAttachmentList.appendChild(createCreateAttachmentItem(file));
    }
  });
  updateCreateAttachmentCount();
  createUploadInput.value = "";
});

cancelCreate.addEventListener("click", showList);
submitCreate.addEventListener("click", addCreatedReportToList);

attachmentList.querySelectorAll(".attachment-delete").forEach(bindAttachmentDelete);

cancelDelete.addEventListener("click", () => {
  deleteModal.classList.add("hidden");
});

closePreview.addEventListener("click", () => {
  previewModal.classList.add("hidden");
  previewModal.classList.remove("pdf-preview");
  previewBody.innerHTML = "";
});

previewModal.addEventListener("click", (event) => {
  if (event.target === previewModal) {
    previewModal.classList.add("hidden");
    previewModal.classList.remove("pdf-preview");
    previewBody.innerHTML = "";
  }
});

deleteModal.addEventListener("click", (event) => {
  if (event.target === deleteModal) {
    deleteModal.classList.add("hidden");
  }
});

confirmDelete.addEventListener("click", () => {
  if (pendingDeleteNode) {
    pendingDeleteNode.remove();
    if (pendingDeleteKind === "attachment") {
      updateAttachmentCount();
    }
    if (pendingDeleteKind === "laborCourse") {
      courseTotal.textContent = "共计 1 门";
    }
  }
  pendingDeleteNode = null;
  pendingDeleteKind = "attachment";
  deleteModal.classList.add("hidden");
});

document.querySelectorAll("a, button:not(#viewReport):not(#createSelfCheck):not(#backToList):not(#viewFirstCourse):not(#editChecklist):not(#saveChecklist):not(#createUploadAttachment):not(#selfNoteToggle):not(#deleteSelfNote):not(#cancelCreate):not(#submitCreate):not(#deleteSchoolCourse):not(#cancelDelete):not(#confirmDelete):not(#closePreview):not(.attachment-delete):not(.create-attachment-delete)").forEach((node) => {
  node.addEventListener("click", (event) => event.preventDefault());
});
