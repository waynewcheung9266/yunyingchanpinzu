const storageBase = "https://storage-test.yueyanglearning.com/";

let zones = [
  { id: 201, name: "未配置活动未开启二级菜单", icon: "saas/admin/img/bde0566866a5410a4dc7b4c205f8a6cc3f77f42cdd1ae0ed0f8cf127.png", sort: 1, status: 1, updated_at: "2026-09-01 13:19:25" },
  { id: 202, name: "已配置二级菜单并配置活动", icon: "saas/admin/img/66d75fb14752da39fa857076a98fa7ae3e43e642674ad7a56f655540.png", sort: 2, status: 1, updated_at: "2026-09-01 13:19:49" },
  { id: 203, name: "已开启二级菜单未配置活动", icon: "saas/admin/img/f9b6969d184e1d15cb99d303472a9f9eeab19b236e90cb57c3004643.png", sort: 3, status: 1, updated_at: "2026-09-01 13:20:11" },
  { id: 204, name: "已配置活动未开启二级菜单", icon: "saas/admin/img/e946d6b7e5f17315f5c420ecc6b536cc4c4c76ae5378827a1f9378c7.png", sort: 4, status: 1, updated_at: "2026-09-01 13:20:47" }
];

const activities = [
  { activity_id: 1476, name: "北京天安门到青岛三日游", price: "0.01", type: 2, type_name: "研学活动" },
  { activity_id: 1477, name: "济南趵突泉公园两日游", price: "0.01", type: 2, type_name: "研学活动" },
  { activity_id: 1479, name: "张伟的托管活动3", price: "0.20", type: 7, type_name: "假期活动" },
  { activity_id: 1482, name: "秦皇岛2日游", price: "0.01", type: 2, type_name: "研学活动" },
  { activity_id: 1484, name: "我是校外活动2", price: "0.01", type: 2, type_name: "研学活动" },
  { activity_id: 1485, name: "张伟的活动测试", price: "0.01", type: 2, type_name: "研学活动" },
  { activity_id: 1489, name: "黄山3日游", price: "0.01", type: 2, type_name: "研学活动" }
];

let editingId = null;
let activeZoneId = null;
let activeActivityZoneId = null;
let activeActivityMenuId = "all";

const submenuEnabled = {
  201: false,
  202: true,
  203: true,
  204: false
};

const submenuStore = {
  201: [
    { id: 1, name: "全部", sort: 1, locked: true }
  ],
  202: [
    { id: 4, name: "全部", sort: 1, locked: true },
    { id: 21, name: "研学活动", sort: 2 },
    { id: 22, name: "线路活动", sort: 3 },
    { id: 23, name: "托管活动", sort: 4 }
  ],
  203: [
    { id: 7, name: "全部", sort: 1, locked: true }
  ],
  204: [
    { id: 8, name: "全部", sort: 1, locked: true }
  ]
};

const zoneActivityStore = {
  201: [],
  204: [
    { activity_id: 1476, sort: 1 },
    { activity_id: 1477, sort: 2 }
  ]
};

const submenuActivityStore = {
  202: {
    21: [
      { activity_id: 1476, sort: 1 },
      { activity_id: 1477, sort: 2 }
    ],
    22: [
      { activity_id: 1482, sort: 1 },
      { activity_id: 1489, sort: 2 }
    ],
    23: [
      { activity_id: 1479, sort: 1 }
    ]
  },
  203: {}
};

function renderZones() {
  const status = document.querySelector("#statusFilter").value;
  const keyword = document.querySelector("#nameFilter").value.trim();
  const rows = zones
    .filter((zone) => status === "" || String(zone.status) === status)
    .filter((zone) => !keyword || zone.name.includes(keyword))
    .sort((a, b) => a.sort - b.sort);

  document.querySelector("#zoneRows").innerHTML = rows.map((zone) => `
    <tr>
      <td><img class="icon-img" src="${storageBase}${zone.icon}" alt=""></td>
      <td>${zone.name}</td>
      <td>${zone.sort}</td>
      <td><span class="activity-count" data-activity="${zone.id}">${getZoneActivityCount(zone.id)}</span></td>
      <td><label class="switch"><input type="checkbox" data-toggle="${zone.id}" ${zone.status ? "checked" : ""}><span></span></label></td>
      <td>${zone.updated_at}</td>
      <td class="zone-actions">
        <button class="action" data-submenu="${zone.id}">配置二级菜单</button>
        <button class="action" data-config="${zone.id}">配置活动</button>
        <details class="more-actions">
          <summary>更多</summary>
          <div class="more-menu">
            <button class="more-item" data-edit="${zone.id}">编辑</button>
            <button class="more-item danger" data-delete="${zone.id}">删除</button>
          </div>
        </details>
      </td>
    </tr>
  `).join("");

  document.querySelectorAll("[data-toggle]").forEach((input) => {
    input.addEventListener("change", () => {
      const item = zones.find((zone) => zone.id === Number(input.dataset.toggle));
      item.status = input.checked ? 1 : 0;
      item.updated_at = "2026-09-01 13:21:00";
    });
  });
  document.querySelectorAll("[data-edit]").forEach((btn) => btn.addEventListener("click", () => openZoneModal(Number(btn.dataset.edit))));
  document.querySelectorAll("[data-delete]").forEach((btn) => btn.addEventListener("click", () => {
    if (confirm("是否删除？")) {
      const zoneId = Number(btn.dataset.delete);
      zones = zones.filter((zone) => zone.id !== zoneId);
      delete zoneActivityStore[zoneId];
      delete submenuEnabled[zoneId];
      delete submenuStore[zoneId];
      delete submenuActivityStore[zoneId];
      renderZones();
    }
  }));
  document.querySelectorAll("[data-config], [data-activity]").forEach((el) => el.addEventListener("click", () => {
    const zoneId = Number(el.dataset.config || el.dataset.activity);
    openActivityModal(zoneId);
  }));
  document.querySelectorAll("[data-submenu]").forEach((btn) => btn.addEventListener("click", () => openSubmenuModal(Number(btn.dataset.submenu))));
}

function openZoneModal(id) {
  editingId = id || null;
  const zone = zones.find((item) => item.id === id);
  document.querySelector("#zoneModalTitle").textContent = zone ? "编辑金刚区" : "添加金刚区";
  document.querySelector("#zoneName").value = zone ? zone.name : "";
  document.querySelector("#zoneSort").value = zone ? zone.sort : "";
  document.querySelector("#zoneModal").classList.remove("hidden");
}

function saveZone() {
  const name = document.querySelector("#zoneName").value.trim();
  const sort = Number(document.querySelector("#zoneSort").value || 0);
  if (!name || !sort) return;
  if (editingId) {
    const zone = zones.find((item) => item.id === editingId);
    zone.name = name;
    zone.sort = sort;
    zone.updated_at = "2026-09-01 13:21:00";
  } else {
    const id = Date.now();
    zones.push({ id, name, sort, status: 1, updated_at: "2026-09-01 13:21:00", icon: zones[0].icon });
    zoneActivityStore[id] = [];
    submenuEnabled[id] = false;
    submenuStore[id] = [{ id: id + 1, name: "全部", sort: 1, locked: true }];
  }
  closeModal("zoneModal");
  renderZones();
}

function openActivityModal(zoneId) {
  activeActivityZoneId = zoneId;
  ensureDefaultAllMenuForZone(zoneId);
  activeActivityMenuId = "all";
  resetSelectedActivityFilters(false);
  renderActivityTabs();
  renderActivityTables();
  document.querySelector("#activityModal").classList.remove("hidden");
}

function getConfigurableMenus(zoneId) {
  if (!submenuEnabled[zoneId]) return [];
  if (!submenuStore[zoneId]) submenuStore[zoneId] = [];
  return submenuStore[zoneId].filter((item) => !item.locked).sort((a, b) => a.sort - b.sort);
}

function ensureDefaultAllMenuForZone(zoneId) {
  if (!submenuEnabled[zoneId]) return;
  const previousZoneId = activeZoneId;
  activeZoneId = zoneId;
  ensureDefaultAllMenu();
  activeZoneId = previousZoneId;
}

function getMenuSelections(menuId = activeActivityMenuId) {
  if (!submenuActivityStore[activeActivityZoneId]) submenuActivityStore[activeActivityZoneId] = {};
  if (!submenuActivityStore[activeActivityZoneId][menuId]) submenuActivityStore[activeActivityZoneId][menuId] = [];
  return submenuActivityStore[activeActivityZoneId][menuId].sort((a, b) => a.sort - b.sort);
}

function getZoneMenuSelections(zoneId, menuId) {
  if (!submenuActivityStore[zoneId] || !submenuActivityStore[zoneId][menuId]) return [];
  return submenuActivityStore[zoneId][menuId].sort((a, b) => a.sort - b.sort);
}

function getLegacySelections(zoneId = activeActivityZoneId) {
  if (!zoneActivityStore[zoneId]) zoneActivityStore[zoneId] = [];
  return zoneActivityStore[zoneId].sort((a, b) => a.sort - b.sort);
}

function getAllSelections() {
  const menus = getConfigurableMenus(activeActivityZoneId);
  const assigned = menus.flatMap((menu) => getMenuSelections(menu.id).map((item) => ({ ...item, menuName: menu.name, sourceMenuId: menu.id })));
  const assignedIds = new Set(assigned.map((item) => item.activity_id));
  const legacy = getLegacySelections()
    .filter((item) => !assignedIds.has(item.activity_id))
    .map((item) => ({ ...item, menuName: "未分配", sourceMenuId: "legacy" }));
  return [...legacy, ...assigned];
}

function getZoneActivityCount(zoneId) {
  if (!submenuEnabled[zoneId]) return getLegacySelections(zoneId).length;
  const menus = submenuStore[zoneId] ? submenuStore[zoneId].filter((item) => !item.locked) : [];
  const assigned = menus.flatMap((menu) => getZoneMenuSelections(zoneId, menu.id));
  const assignedIds = new Set(assigned.map((item) => item.activity_id));
  const legacy = getLegacySelections(zoneId).filter((item) => !assignedIds.has(item.activity_id));
  return new Set([...assigned.map((item) => item.activity_id), ...legacy.map((item) => item.activity_id)]).size;
}

function renderActivityTabs() {
  const menus = getConfigurableMenus(activeActivityZoneId);
  const head = document.querySelector(".activity-config-head");
  if (!submenuEnabled[activeActivityZoneId]) {
    head.classList.add("hidden");
    document.querySelector("#activityMenuTabs").innerHTML = "";
    document.querySelector("#activityMenuHint").textContent = "";
    return;
  }
  head.classList.remove("hidden");
  const tabs = [
    `<button class="activity-menu-tab ${activeActivityMenuId === "all" ? "active" : ""}" data-activity-menu="all">全部</button>`,
    ...menus.map((menu) => `<button class="activity-menu-tab ${activeActivityMenuId === menu.id ? "active" : ""}" data-activity-menu="${menu.id}">${menu.name}</button>`)
  ];
  document.querySelector("#activityMenuTabs").innerHTML = tabs.join("");
  document.querySelector("#activityMenuHint").textContent = "";
  document.querySelectorAll("[data-activity-menu]").forEach((btn) => btn.addEventListener("click", () => {
    activeActivityMenuId = btn.dataset.activityMenu === "all" ? "all" : Number(btn.dataset.activityMenu);
    resetSelectedActivityFilters(false);
    renderActivityTabs();
    renderActivityTables();
  }));
}

function getActivityMenuHint(menus) {
  if (!menus.length) return "当前仅有“全部”汇总菜单，请先新增二级菜单后再配置活动";
  return "“全部”默认汇总展示所有二级菜单已配置活动，不需要单独配置";
}

function renderActivityTables() {
  const configurable = getConfigurableMenus(activeActivityZoneId);
  const hasSubmenuEnabled = Boolean(submenuEnabled[activeActivityZoneId]);
  const selectedIds = !hasSubmenuEnabled
    ? new Set(getLegacySelections().map((item) => item.activity_id))
    : activeActivityMenuId === "all"
    ? new Set(getAllSelections().map((item) => item.activity_id))
    : new Set(getMenuSelections().map((item) => item.activity_id));
  const canSelect = !hasSubmenuEnabled || (configurable.length > 0 && activeActivityMenuId !== "all");

  document.querySelector("#activityRows").innerHTML = activities.map((item) => `
    <tr>
      <td>${item.name}</td>
      <td>${item.price}</td>
      <td>${item.type_name}</td>
      <td><button class="action ${!canSelect ? "disabled" : ""}" data-pick-activity="${item.activity_id}" ${!canSelect ? "disabled" : ""}>${selectedIds.has(item.activity_id) ? "取消选择" : "选择"}</button></td>
    </tr>
  `).join("");

  const selected = hasSubmenuEnabled
    ? (activeActivityMenuId === "all" ? getAllSelections() : getMenuSelections().map((item) => ({ ...item, menuName: getActiveMenuName() })))
    : getLegacySelections();
  const selectedName = document.querySelector("#selectedActivityNameFilter").value.trim();
  const selectedType = document.querySelector("#selectedActivityTypeFilter").value;
  const selectedFiltered = selected.filter((selection) => {
    const activity = activities.find((item) => item.activity_id === selection.activity_id);
    if (!activity) return false;
    if (selectedName && !activity.name.includes(selectedName)) return false;
    if (selectedType && String(activity.type) !== selectedType) return false;
    return true;
  });

  const isSummaryTab = hasSubmenuEnabled && activeActivityMenuId === "all";
  renderSelectedActivityHead(isSummaryTab);
  document.querySelector("#selectedRows").innerHTML = selectedFiltered.map((selection, index) => {
    const activity = activities.find((item) => item.activity_id === selection.activity_id);
    const menuCell = getActivityMenuCell(selection, hasSubmenuEnabled);
    const removeCell = getActivityActionCell(activity, selection, isSummaryTab, configurable);
    if (isSummaryTab) return `<tr><td>${activity.name}</td><td>${menuCell}</td><td>${activity.price}</td><td>${activity.type_name}</td><td>${removeCell}</td></tr>`;
    const sortCell = `<input class="sort-input" data-activity-sort="${activity.activity_id}" value="${selection.sort || index + 1}">`;
    return `<tr><td>${activity.name}</td><td>${menuCell}</td><td>${activity.price}</td><td>${activity.type_name}</td><td>${sortCell}</td><td>${removeCell}</td></tr>`;
  }).join("");
  const emptyHint = document.querySelector("#selectedActivityEmpty");
  const emptyHintText = hasSubmenuEnabled && activeActivityMenuId === "all" ? getActivityMenuHint(configurable) : "";
  emptyHint.textContent = selectedFiltered.length ? "" : emptyHintText;
  emptyHint.classList.toggle("hidden", Boolean(selectedFiltered.length || !emptyHintText));

  document.querySelectorAll("[data-pick-activity]").forEach((btn) => btn.addEventListener("click", () => toggleActivitySelection(Number(btn.dataset.pickActivity))));
  document.querySelectorAll("[data-delete-activity]").forEach((btn) => btn.addEventListener("click", () => deleteActivitySelection(Number(btn.dataset.deleteActivity), btn.dataset.sourceMenu)));
  document.querySelectorAll("[data-move-activity]").forEach((select) => select.addEventListener("change", () => moveActivityToMenu(Number(select.dataset.moveActivity), Number(select.value), select.dataset.sourceMenu)));
  document.querySelectorAll("[data-activity-sort]").forEach((input) => input.addEventListener("change", () => updateActivitySort(input)));
}

function renderSelectedActivityHead(isSummaryTab) {
  const head = document.querySelector("#selectedRows").closest("table").querySelector("thead");
  head.innerHTML = isSummaryTab
    ? "<tr><th>活动名称</th><th>菜单名称</th><th>价格(元)</th><th>类型</th><th>操作</th></tr>"
    : "<tr><th>活动名称</th><th>菜单名称</th><th>价格(元)</th><th>类型</th><th>排序</th><th>操作</th></tr>";
}

function getActivityMenuCell(selection, hasSubmenuEnabled) {
  if (!hasSubmenuEnabled) return "";
  if (selection.sourceMenuId === "legacy") return '<span class="unassigned-tag">未分配</span>';
  return selection.menuName || "";
}

function getActiveMenuName() {
  const menu = getConfigurableMenus(activeActivityZoneId).find((item) => item.id === activeActivityMenuId);
  return menu ? menu.name : "";
}

function getActivityActionCell(activity, selection, isSummaryTab, configurable) {
  if (!isSummaryTab) return `<button class="action" data-delete-activity="${activity.activity_id}">删除</button>`;
  const sourceMenuId = selection.sourceMenuId || "";
  if (sourceMenuId !== "legacy") {
    return `<button class="action" data-delete-activity="${activity.activity_id}" data-source-menu="${sourceMenuId}">删除</button>`;
  }
  const options = configurable
    .map((menu) => `<option value="${menu.id}">${menu.name}</option>`)
    .join("");
  const moveSelect = `<select class="move-select" data-move-activity="${activity.activity_id}" data-source-menu="${sourceMenuId}" ${options ? "" : "disabled"}><option value="">移动到</option>${options}</select>`;
  return `${moveSelect}<button class="action" data-delete-activity="${activity.activity_id}" data-source-menu="${sourceMenuId}">删除</button>`;
}

function toggleActivitySelection(activityId) {
  if (!submenuEnabled[activeActivityZoneId]) {
    const selections = getLegacySelections();
    const existingIndex = selections.findIndex((item) => item.activity_id === activityId);
    if (existingIndex >= 0) selections.splice(existingIndex, 1);
    else selections.push({ activity_id: activityId, sort: selections.length + 1 });
    renderActivityTables();
    renderZones();
    return;
  }
  if (activeActivityMenuId === "all") return;
  const selections = getMenuSelections();
  const existingIndex = selections.findIndex((item) => item.activity_id === activityId);
  if (existingIndex >= 0) selections.splice(existingIndex, 1);
  else {
    zoneActivityStore[activeActivityZoneId] = getLegacySelections().filter((item) => item.activity_id !== activityId);
    selections.push({ activity_id: activityId, sort: selections.length + 1 });
  }
  renderActivityTables();
  renderZones();
}

function deleteActivitySelection(activityId, sourceMenuId = activeActivityMenuId) {
  if (!submenuEnabled[activeActivityZoneId]) {
    zoneActivityStore[activeActivityZoneId] = getLegacySelections().filter((item) => item.activity_id !== activityId);
    renderActivityTables();
    renderZones();
    return;
  }
  if (sourceMenuId === "legacy") {
    zoneActivityStore[activeActivityZoneId] = getLegacySelections().filter((item) => item.activity_id !== activityId);
  } else {
    const menuId = Number(sourceMenuId || activeActivityMenuId);
    submenuActivityStore[activeActivityZoneId][menuId] = getMenuSelections(menuId).filter((item) => item.activity_id !== activityId);
  }
  renderActivityTables();
  renderZones();
}

function moveActivityToMenu(activityId, targetMenuId, sourceMenuId) {
  if (!targetMenuId) return;
  if (!submenuActivityStore[activeActivityZoneId]) submenuActivityStore[activeActivityZoneId] = {};
  if (sourceMenuId === "legacy") {
    zoneActivityStore[activeActivityZoneId] = getLegacySelections().filter((item) => item.activity_id !== activityId);
  } else if (sourceMenuId && String(sourceMenuId) !== String(targetMenuId)) {
    submenuActivityStore[activeActivityZoneId][Number(sourceMenuId)] = getMenuSelections(Number(sourceMenuId)).filter((item) => item.activity_id !== activityId);
  }
  const targetSelections = getMenuSelections(targetMenuId);
  if (!targetSelections.some((item) => item.activity_id === activityId)) {
    targetSelections.push({ activity_id: activityId, sort: targetSelections.length + 1 });
  }
  alert("移动成功");
  renderActivityTables();
  renderZones();
}

function updateActivitySort(input) {
  if (!submenuEnabled[activeActivityZoneId]) return;
  const item = getMenuSelections().find((selection) => selection.activity_id === Number(input.dataset.activitySort));
  if (item) item.sort = Math.max(1, Number(input.value || 1));
  renderActivityTables();
}

function openSubmenuModal(zoneId) {
  activeZoneId = zoneId;
  const zone = zones.find((item) => item.id === zoneId);
  document.querySelector("#submenuModalTitle").textContent = `配置二级菜单 - ${zone.name}`;
  document.querySelector("#submenuEnableSwitch").checked = Boolean(submenuEnabled[zoneId]);
  ensureDefaultAllMenu();
  renderSubmenus();
  document.querySelector("#submenuModal").classList.remove("hidden");
}

function getSubmenus() {
  if (!submenuStore[activeZoneId]) submenuStore[activeZoneId] = [];
  return submenuStore[activeZoneId].sort((a, b) => a.sort - b.sort);
}

function ensureDefaultAllMenu() {
  if (!submenuStore[activeZoneId]) submenuStore[activeZoneId] = [];
  let allMenu = submenuStore[activeZoneId].find((item) => item.locked);
  if (!allMenu) {
    allMenu = { id: Date.now(), name: "全部", sort: 1, locked: true };
    submenuStore[activeZoneId].unshift(allMenu);
  }
  allMenu.name = "全部";
  allMenu.sort = 1;
  allMenu.locked = true;
}

function renderSubmenus() {
  const enabled = Boolean(submenuEnabled[activeZoneId]);
  document.querySelector("#addSubmenuBtn").disabled = !enabled;
  if (!enabled) {
    document.querySelector("#submenuRows").innerHTML = `<tr><td colspan="4" class="locked-text">开启二级菜单后可配置菜单项</td></tr>`;
    return;
  }
  ensureDefaultAllMenu();
  const list = getSubmenus();
  document.querySelector("#submenuRows").innerHTML = list.map((item) => `
    <tr>
      <td><input class="submenu-input" data-submenu-name="${item.id}" maxlength="8" value="${item.name}" ${item.locked ? "disabled" : ""}></td>
      <td>${getSubmenuActivityCount(item)}</td>
      <td><input class="submenu-sort-input" data-submenu-sort="${item.id}" type="number" value="${item.sort}" ${item.locked ? "disabled" : ""}></td>
      <td>
        ${item.locked ? '<span class="action disabled">删除</span>' : `<button class="action" data-remove-submenu="${item.id}">删除</button>`}
      </td>
    </tr>
  `).join("");
  document.querySelectorAll("[data-submenu-name]").forEach((input) => input.addEventListener("input", () => updateSubmenuName(input)));
  document.querySelectorAll("[data-submenu-sort]").forEach((input) => input.addEventListener("change", () => updateSubmenuSort(input)));
  document.querySelectorAll("[data-remove-submenu]").forEach((btn) => btn.addEventListener("click", () => deleteSubmenu(Number(btn.dataset.removeSubmenu))));
}

function getSubmenuActivityCount(item) {
  if (item.locked) return getZoneActivityCount(activeZoneId);
  return getZoneMenuSelections(activeZoneId, item.id).length;
}

function updateSubmenuName(input) {
  const item = getSubmenus().find((submenu) => submenu.id === Number(input.dataset.submenuName));
  if (item && !item.locked) item.name = input.value.trim();
  if (activeActivityZoneId === activeZoneId) renderActivityTabs();
}

function updateSubmenuSort(input) {
  const item = getSubmenus().find((submenu) => submenu.id === Number(input.dataset.submenuSort));
  if (item && !item.locked) item.sort = Math.max(2, Number(input.value || 2));
  renderSubmenus();
  if (activeActivityZoneId === activeZoneId) renderActivityTabs();
}

function addSubmenu() {
  if (!submenuEnabled[activeZoneId]) return;
  ensureDefaultAllMenu();
  const list = getSubmenus();
  const nextSort = list.length ? Math.max(...list.map((item) => item.sort)) + 1 : 2;
  const item = {
    id: Date.now(),
    name: "新菜单",
    sort: nextSort
  };
  submenuStore[activeZoneId].push(item);
  if (!submenuActivityStore[activeZoneId]) submenuActivityStore[activeZoneId] = {};
  submenuActivityStore[activeZoneId][item.id] = [];
  renderSubmenus();
  if (activeActivityZoneId === activeZoneId) {
    renderActivityTabs();
    renderActivityTables();
    renderZones();
  }
}

function deleteSubmenu(id) {
  if (!id) return;
  const item = getSubmenus().find((submenu) => submenu.id === id);
  if (item && item.locked) return;
  const activityCount = getZoneMenuSelections(activeZoneId, id).length;
  const confirmText = activityCount > 0
    ? `确定删除“${item.name}”菜单吗？删除后该菜单下已配置的 ${activityCount} 条活动将一并移除。`
    : `确定删除“${item.name}”菜单吗？`;
  if (!confirm(confirmText)) return;
  submenuStore[activeZoneId] = getSubmenus().filter((item) => item.id !== id);
  if (submenuActivityStore[activeZoneId]) delete submenuActivityStore[activeZoneId][id];
  renderSubmenus();
  if (activeActivityZoneId === activeZoneId) {
    activeActivityMenuId = "all";
    renderActivityTabs();
    renderActivityTables();
    renderZones();
  }
}

function toggleSubmenuEnabled() {
  submenuEnabled[activeZoneId] = document.querySelector("#submenuEnableSwitch").checked;
  if (submenuEnabled[activeZoneId]) ensureDefaultAllMenu();
  renderSubmenus();
  renderZones();
  if (activeActivityZoneId === activeZoneId) {
    activeActivityMenuId = "all";
    resetSelectedActivityFilters(false);
    renderActivityTabs();
    renderActivityTables();
  }
}

function resetSelectedActivityFilters(shouldRender = true) {
  document.querySelector("#selectedActivityNameFilter").value = "";
  document.querySelector("#selectedActivityTypeFilter").value = "";
  if (shouldRender) renderActivityTables();
}

function closeModal(id) {
  document.querySelector(`#${id}`).classList.add("hidden");
}

document.querySelector("#searchBtn").addEventListener("click", renderZones);
document.querySelector("#resetBtn").addEventListener("click", () => {
  document.querySelector("#statusFilter").value = "";
  document.querySelector("#nameFilter").value = "";
  renderZones();
});
document.querySelector("#addBtn").addEventListener("click", () => openZoneModal());
document.querySelector("#saveZone").addEventListener("click", saveZone);
document.querySelector("#addSubmenuBtn").addEventListener("click", addSubmenu);
document.querySelector("#submenuEnableSwitch").addEventListener("change", toggleSubmenuEnabled);
document.querySelector("#selectedActivitySearchBtn").addEventListener("click", renderActivityTables);
document.querySelector("#selectedActivityResetBtn").addEventListener("click", () => resetSelectedActivityFilters());
document.querySelector("#pageSwitch").addEventListener("change", (event) => {
  document.querySelector("#tablePanel").classList.toggle("hidden", !event.target.checked);
});
document.querySelectorAll("[data-close]").forEach((btn) => btn.addEventListener("click", () => closeModal(btn.dataset.close)));
document.querySelectorAll(".modal-mask").forEach((mask) => mask.addEventListener("click", (event) => {
  if (event.target === mask) closeModal(mask.id);
}));

renderZones();
