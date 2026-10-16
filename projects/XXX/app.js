const details = document.querySelector('#details');
const filter = document.querySelector('#filter');
const course = document.querySelector('.course');
const weekday = document.querySelector('#weekday');
let registeredIdentity = '';
let toastTimer;
const courseName = 'ZW课后服务课程2–10151';
function renderRegistrations() {
  const rows = document.querySelector('#registration-rows');
  rows.replaceChildren();
  document.querySelector('#admin-total').textContent = `共 ${registeredIdentity ? 1 : 0} 条报名记录`;
  const matches = courseName.includes(document.querySelector('#registration-search').value.trim());
  const row = document.createElement('tr');
  if (!registeredIdentity || !matches) {
    const cell = document.createElement('td');
    cell.colSpan = 5;
    cell.className = 'empty-state';
    cell.textContent = registeredIdentity ? '暂无匹配记录' : '暂无报名记录';
    row.append(cell);
  } else {
    for (const value of [courseName, '星期四 15:00 – 16:00', registeredIdentity, '报名成功', '¥0']) {
      const cell = document.createElement('td');
      cell.textContent = value;
      row.append(cell);
    }
  }
  rows.append(row);
}
document.querySelector('#registration-search').addEventListener('input', renderRegistrations);
for (const button of document.querySelectorAll('[data-view]')) {
  button.addEventListener('click', () => {
    const view = button.dataset.view;
    document.querySelector('.phone').hidden = view !== 'parent';
    document.querySelector('#admin').hidden = true;
    document.querySelector('#school').hidden = view !== 'school';
    document.querySelector('#institution').hidden = view !== 'institution';
    document.querySelector('#admin-brand').textContent = view === 'school' ? '学校端' : '机构端';
    document.title = view === 'parent' ? '课后选课' : view === 'institution' ? '机构端 · 学校排课明细' : '学校端 · 选课管理';
    for (const item of document.querySelectorAll('[data-view]')) item.setAttribute('aria-pressed', String(item === button));
    renderRegistrations();
  });
}
const menuItems = [
  ['▣', '课程管理'], ['◇', '物料管理'], ['▤', '会员卡管理'], ['▥', '教学课表'],
  ['◉', '教师管理'], ['♧', '客服管理'], ['☷', '订单中心', true], ['▣', '财务管理（课后）', true],
  ['▧', '报表管理', true], ['☰', '学校排课明细'], ['⚙', '系统设置', true], ['▤', '意见反馈']
];
for (const [icon, label, arrow] of menuItems) {
  const item = document.createElement('button');
  item.type = 'button';
  item.className = 'org-menu-item' + (label === '学校排课明细' ? ' active' : '');
  const symbol = document.createElement('span');
  symbol.className = 'menu-icon';
  symbol.textContent = icon;
  const text = document.createElement('span');
  text.className = 'menu-label';
  text.textContent = label;
  item.append(symbol, text);
  item.title = label;
  if (arrow) {
    const chevron = document.createElement('span');
    chevron.className = 'menu-arrow';
    chevron.textContent = '⌄';
    item.append(chevron);
  }
  document.querySelector('#org-menu').append(item);
}
const orgGrades = [
  '一年级,二年级,三年级', '三年级,四年级,五年级,六年级,一年级',
  '二年级,三年级,四年级,一年级', '六年级,一年级,二年级,三年级,四年级',
  '一年级,二年级,三年级,四年级,五年级', '三年级,四年级,五年级,六年级,一年级',
  '一年级,二年级,三年级,四年级,五年级', '五年级,六年级,一年级,二年级,三年级',
  '五年级,六年级,一年级,二年级,三年级'
];
let visibleOrgRows = orgGrades.map((grade, index) => ({grade, index}));
function openOrgStudents(index) {
  const tbody = document.querySelector('#org-student-rows');
  tbody.replaceChildren();
  const row = document.createElement('tr');
  const fullIdentity = registeredIdentity && index === 0 ? registeredIdentity : '410000201501010000';
  const values = [1, '张伟三', fullIdentity, '一年级', '2', '18510239330', '2026-10-15 14:02:24'];
  for (const value of values) {
    const cell = document.createElement('td');
    cell.textContent = value;
    row.append(cell);
  }
  tbody.append(row);
  document.querySelector('#org-students').showModal();
}
document.querySelector('#student-close').onclick = () => document.querySelector('#org-students').close();
document.querySelector('#student-maximize').onclick = (event) => {
  const expanded = document.querySelector('#org-students').classList.toggle('expanded');
  event.currentTarget.title = expanded ? '还原' : '放大';
  event.currentTarget.setAttribute('aria-label', expanded ? '还原弹窗' : '放大弹窗');
};
document.querySelector('#org-students').addEventListener('close', () => {
  document.querySelector('#org-students').classList.remove('expanded');
  document.querySelector('#student-maximize').title = '放大';
  document.querySelector('#student-maximize').setAttribute('aria-label', '放大弹窗');
});
document.querySelector('#student-export').onclick = () => {
  const rows = [...document.querySelectorAll('.student-table tr')].map(row =>
    [...row.children].map(cell => '"' + cell.textContent.replaceAll('"', '""') + '"').join(','));
  const url = URL.createObjectURL(new Blob(['\uFEFF' + rows.join('\r\n')], {type:'text/csv;charset=utf-8'}));
  const link = document.createElement('a');
  link.href = url;
  link.download = '学生明细.csv';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
function renderOrgRows() {
  const tbody = document.querySelector('#org-rows');
  tbody.replaceChildren();
  for (const {grade, index} of visibleOrgRows) {
    const row = document.createElement('tr');
    for (const value of [index + 1, 'ZW课后服务课程2', grade, 1, '0.00', '无物料', '--']) {
      const cell = document.createElement('td');
      cell.textContent = value;
      cell.title = String(value);
      row.append(cell);
    }
    const action = document.createElement('td');
    const button = document.createElement('button');
    button.textContent = '学生明细';
    button.onclick = () => openOrgStudents(index);
    action.append(button);
    row.append(action);
    tbody.append(row);
  }
  if (!visibleOrgRows.length) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 8;
    cell.className = 'empty-state';
    cell.textContent = '暂无数据';
    row.append(cell);
    tbody.append(row);
  }
  document.querySelector('#org-total').textContent = `共 ${visibleOrgRows.length} 条数据`;
}
document.querySelector('#org-filters').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  visibleOrgRows = orgGrades.map((grade, index) => ({grade, index})).filter(({grade}) =>
    data.get('year') === '2026~2027学年' && data.get('term') === '上学期' && (!data.get('class') || grade.includes(data.get('class'))));
  renderOrgRows();
});
document.querySelector('#org-expand').onclick = (event) => {
  const extra = document.querySelector('.org-extra');
  extra.hidden = !extra.hidden;
  event.currentTarget.textContent = extra.hidden ? '展开⌄' : '收起⌃';
};
document.querySelector('.org-collapse').onclick = () => document.querySelector('#institution').classList.toggle('compact');
document.querySelector('#org-fullscreen').onclick = () => {
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  else document.documentElement.requestFullscreen?.().catch(() => {});
};
document.querySelector('#org-export').onclick = () => {
  const lines = [['序号','课程名称','适用年级','课时数','总价(元)','物料类型','物料'],
    ...visibleOrgRows.map(({grade,index}) => [index + 1,'ZW课后服务课程2',grade,1,'0.00','无物料','--'])];
  const csv = '\uFEFF' + lines.map(row => row.map(value => '"' + String(value).replaceAll('"','""') + '"').join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], {type:'text/csv;charset=utf-8'}));
  const link = document.createElement('a');
  link.href = url;
  link.download = '学校排课明细.csv';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
renderOrgRows();
document.querySelector('.details').onclick = () => details.showModal();
document.querySelector('.filter').onclick = () => filter.showModal();
document.querySelector('#reset').onclick = () => { weekday.value = 'all'; };
filter.addEventListener('close', () => { course.hidden = weekday.value === 'other'; });
const reset = () => { weekday.value = 'all'; course.hidden = false; };
document.querySelector('.all').onclick = reset;
document.querySelector('.category').onclick = reset;
document.querySelector('.home').onclick = reset;
document.querySelector('.back').onclick = reset;
const enrollment = document.querySelector('#enrollment');
const identity = document.querySelector('#identity-number');
const identityError = document.querySelector('#identity-error');
const clearIdentityError = () => {
  identityError.textContent = '';
  identity.removeAttribute('aria-invalid');
};
document.querySelector('.select').onclick = (event) => {
  const selected = document.querySelector('#count').textContent === '1';
  if (selected) {
    registeredIdentity = '';
    renderRegistrations();
    document.querySelector('#count').textContent = '0';
    event.currentTarget.textContent = '立即选课';
    return;
  }
  document.querySelector('#enrollment-form').reset();
  clearIdentityError();
  enrollment.showModal();
};
document.querySelector('.modal-close').onclick = () => enrollment.close();
document.querySelector('.enrollment-cancel').onclick = () => enrollment.close();
identity.addEventListener('input', clearIdentityError);
document.querySelector('#enrollment-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const number = identity.value.trim().toUpperCase();
  let error = '';
  if (!number) error = '请输入身份证号码';
  else if (!/^[1-9]\d{16}[\dX]$/.test(number)) error = '请输入18位身份证号码，末位可为X';
  if (error) {
    identityError.textContent = error;
    identity.setAttribute('aria-invalid', 'true');
    identity.focus();
    return;
  }
  document.querySelector('#count').textContent = '1';
  document.querySelector('.select').textContent = '取消选课';
  registeredIdentity = number;
  renderRegistrations();
  enrollment.close();
  const toast = document.querySelector('#success-toast');
  clearTimeout(toastTimer);
  toast.hidden = false;
  toastTimer = setTimeout(() => { toast.hidden = true; }, 2200);
});
enrollment.addEventListener('close', () => {
  document.querySelector('#enrollment-form').reset();
  clearIdentityError();
});
for (const dialog of [details, filter, enrollment]) {
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
}
