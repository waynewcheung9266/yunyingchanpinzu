const schoolMenu = [
  ['▣','精品研学课程库',true],['⊞','教学管理',true],['▦','教学课表'],['▤','教务管理',true],
  ['▣','选课管理'],['▤','选课总览'],['▱','服务考勤',true],['▤','课堂记录',true],
  ['▣','巡课记录'],['▣','校本课管理',true],['▧','报表管理',true],['▣','结算管理'],['▤','转账账单'],['⚙','系统设置',true]
];
for (const [icon,name,arrow] of schoolMenu) {
  const button = document.createElement('button');
  button.className = 'org-menu-item' + (name === '选课管理' ? ' active' : '');
  button.title = name;
  for (const [className,text] of [['menu-icon',icon],['menu-label',name],...(arrow ? [['menu-arrow','⌄']] : [])]) {
    const span = document.createElement('span'); span.className = className; span.textContent = text; button.append(span);
  }
  document.querySelector('#school-menu').append(button);
}
const schoolPlans = [
  ['选课方案1015导入学生','2026/10/15 14:01 - 2026/10/15 15:00','2026/10/15 - 2026/10/15','已结束'],
  ['选课方案1015','2026/10/15 13:52 - 2026/10/15 14:52','2026/10/15 - 2026/10/15','已结束'],
  ['ZW的选课方案1015','2026/10/15 15:40 - 2026/10/15 18:00','2026/10/15 - 2026/10/16','已启用'],
  ['ZW的选课方案0811','2026/08/12 08:22 - 2026/08/13 08:00','2026/08/11 - 2026/08/14','已停用'],
  ['ZW的选课方案4','2026/08/06 16:30 - 2026/08/06 16:35','2026/08/06 - 2026/08/07','已结束'],
  ['ZW的选课方案3','2026/08/06 15:55 - 2026/08/06 16:00','2026/08/06 - 2026/08/06','已结束'],
  ['ZW的选课方案2','2026/08/06 15:00 - 2026/08/06 15:52','2026/08/06 - 2026/08/06','已结束'],
  ['ZW的选课方案','2026/08/06 10:00 - 2026/08/06 15:45','2026/08/06 - 2026/08/06','已结束']
];
function showSchoolPlan(plan) {
  document.querySelector('#school-plan-title').textContent = plan[0];
  const info = document.querySelector('#school-plan-info'); info.replaceChildren();
  for (const [label,value] of [['选课时间',plan[1]],['开课周期',plan[2]],['状态',plan[3]],['适用年级','一年级,二年级,三年级'],['课程名称','ZW课后服务课程2']]) {
    const p = document.createElement('p'); p.textContent = label + '：' + value; info.append(p);
  }
  document.querySelector('#school-plan-dialog').showModal();
}
function renderSchoolPlans() {
  const form = new FormData(document.querySelector('#school-filters'));
  const plans = schoolPlans.map((plan,index) => ({plan,index})).filter(({plan}) =>
    form.get('year') === '2026~2027' && form.get('term') === '上学期' &&
    (!form.get('status') || plan[3] === form.get('status')) && plan[0].includes(form.get('name').trim()));
  const tbody = document.querySelector('#school-rows'); tbody.replaceChildren();
  for (const {plan,index} of plans) {
    const row = document.createElement('tr');
    const grades = index === 0 ? '一年级,二年级,三年级' : '一年级,二年级,三年级,四年级';
    for (const [column,value] of [index+1,plan[0],'-',plan[1],plan[2],plan[3],grades].entries()) {
      const cell = document.createElement('td'); cell.title = String(value);
      if (column === 5) { const tag = document.createElement('span'); tag.className = 'school-status' + (value === '已启用' ? ' enabled' : ''); tag.textContent = value; cell.append(tag); }
      else cell.textContent = value;
      row.append(cell);
    }
    const actions = document.createElement('td');
    const addAction = (text,action) => { const button = document.createElement('button'); button.textContent = text; button.onclick = action; actions.append(button); };
    addAction('查看',() => openSchoolResults(plan));
    if (plan[3] !== '已结束') {
      addAction(plan[3] === '已启用' ? '停用方案' : '启动方案',() => { plan[3] = plan[3] === '已启用' ? '已停用' : '已启用'; renderSchoolPlans(); });
      addAction('更多',() => showSchoolPlan(plan));
    }
    row.append(actions); tbody.append(row);
  }
  if (!plans.length) { const row = tbody.insertRow(); const cell = row.insertCell(); cell.colSpan = 8; cell.className = 'empty-state'; cell.textContent = '暂无方案'; }
  document.querySelector('#school-count').textContent = `共 ${plans.length} 个方案`;
  document.querySelector('#school-total').textContent = `共 ${plans.length} 条数据`;
}
document.querySelector('#school-filters').onsubmit = event => { event.preventDefault(); renderSchoolPlans(); };
document.querySelector('#school-filters').onreset = () => setTimeout(renderSchoolPlans,0);
document.querySelector('.school-collapse').onclick = () => document.querySelector('#school').classList.toggle('compact');
document.querySelector('.school-fullscreen').onclick = () => {
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  else document.documentElement.requestFullscreen?.().catch(() => {});
};
document.querySelector('#school-create').onclick = () => document.querySelector('#school-create-dialog').showModal();
document.querySelector('#school-create-cancel').onclick = () => document.querySelector('#school-create-dialog').close();
document.querySelector('#school-create-form').onsubmit = event => {
  event.preventDefault(); const name = event.currentTarget.elements.name.value.trim();
  if (!name) { event.currentTarget.elements.name.focus(); return; }
  schoolPlans.push([name,'-','-','已停用']);
  document.querySelector('#school-filters').reset();
  document.querySelector('#school-create-dialog').close(); event.currentTarget.reset(); renderSchoolPlans();
};
renderSchoolPlans();
