const overviewPage = document.createElement('section');
overviewPage.className = 'school-overview'; overviewPage.hidden = true;
overviewPage.innerHTML = `<div class="org-breadcrumb"><span>⌂</span><span>/</span>选课总览<span>/</span>选课总览详情</div>
<section class="overview-summary"><h1>选课方案1015导入学生</h1><div class="overview-summary-grid"><div><span>课程提供方名称</span><p>张伟的机构</p></div><div><span>课程名称</span><p>ZW课后服务课程2</p></div><div><span>教学班</span><p>1015</p></div><div><span>归属学年</span><p>2026~2027</p></div><div><span>归属学期</span><p>上学期</p></div></div></section>
<section class="overview-statistics"><div class="overview-stat enrolled"><span class="overview-stat-icon">♙</span><div><strong>1</strong><span>选课人数(人)</span></div></div><div class="overview-stat refunded"><span class="overview-stat-icon">♙</span><div><strong>0</strong><span>退款人数(人)</span></div></div><div class="overview-stat actual"><span class="overview-stat-icon">♙</span><div><strong>1</strong><span>实际人数(人)</span></div></div></section>
<section class="overview-list"><form id="overview-filters"><label>状态<select name="status"><option>全部</option><option>已选课</option><option>已退款</option></select></label><input name="search" placeholder="请输入学生姓名/家长手机号进行查找"><div class="overview-filter-actions"><button class="school-reset" type="reset">⟳&nbsp; 重置</button><button class="org-primary" type="submit">⌕&nbsp; 查询</button></div></form><div class="overview-export"><button id="overview-export" class="org-primary">导 出</button></div><div class="overview-table-scroll"><table id="overview-table"><thead><tr><th>序号</th><th>学生姓名</th><th>身份证号码</th><th>年级</th><th>班级</th><th>家长手机</th><th>状态</th><th>已点名课时</th><th>剩余课时数</th><th>操作</th></tr></thead><tbody></tbody></table></div><footer class="org-pagination"><span id="overview-total">共 1 条数据</span><button aria-current="page">1</button><select aria-label="总览每页条数"><option>10 条/页</option><option>20 条/页</option></select></footer></section>`;
schoolMain.append(overviewPage);
const overviewMenu = [...document.querySelectorAll('#school-menu .org-menu-item')].find(item => item.title === '选课总览');
const managementMenu = [...document.querySelectorAll('#school-menu .org-menu-item')].find(item => item.title === '选课管理');
overviewMenu.onclick = () => {
  schoolList.hidden = true; resultPage.hidden = true; courseStudentsPage.hidden = true; overviewPage.hidden = false;
  document.querySelectorAll('#school-menu .org-menu-item').forEach(item => item.classList.toggle('active', item === overviewMenu));
  renderOverview();
};
managementMenu.onclick = () => {
  overviewPage.hidden = true; resultPage.hidden = true; courseStudentsPage.hidden = true; schoolList.hidden = false;
  document.querySelectorAll('#school-menu .org-menu-item').forEach(item => item.classList.toggle('active', item === managementMenu));
};
function renderOverview() {
  const data = new FormData(document.querySelector('#overview-filters'));
  const query = data.get('search').trim();
  const matches = data.get('status') !== '已退款' && (resultStudent.name.includes(query) || resultStudent.phone.includes(query));
  const tbody = document.querySelector('#overview-table tbody'); tbody.replaceChildren();
  const row = document.createElement('tr');
  if (matches) {
    for (const value of ['1',resultStudent.name,resultStudent.identity,'一年级','2',resultStudent.phone,'已选课','--','--']) {
      const cell = document.createElement('td'); cell.textContent = value; row.append(cell);
    }
    const action = document.createElement('td'); const button = document.createElement('button'); button.textContent = '课时明细';
    button.onclick = () => {
      document.querySelector('#school-plan-title').textContent = '课时明细';
      const info = document.querySelector('#school-plan-info'); info.replaceChildren();
      for (const text of ['学生姓名：' + resultStudent.name, '身份证号码：' + resultStudent.identity, '课程名称：ZW课后服务课程2', '教学班：1015', '总课时：1', '已点名课时：--', '剩余课时数：--']) { const p = document.createElement('p'); p.textContent = text; info.append(p); }
      document.querySelector('#school-plan-dialog').showModal();
    };
    action.append(button); row.append(action);
  } else { const cell = document.createElement('td'); cell.colSpan = 10; cell.className = 'empty-state'; cell.textContent = '暂无数据'; row.append(cell); }
  tbody.append(row); document.querySelector('#overview-total').textContent = `共 ${matches ? 1 : 0} 条数据`;
}
document.querySelector('#overview-filters').onsubmit = event => { event.preventDefault(); renderOverview(); };
document.querySelector('#overview-filters').onreset = () => setTimeout(renderOverview,0);
document.querySelector('#overview-export').onclick = () => {
  const lines = [...document.querySelectorAll('#overview-table tr')].map(row => [...row.children].slice(0,-1).map(cell => '"' + cell.textContent.replaceAll('"','""') + '"').join(','));
  const url = URL.createObjectURL(new Blob(['\uFEFF' + lines.join('\r\n')],{type:'text/csv;charset=utf-8'}));
  const link = document.createElement('a'); link.href = url; link.download = '选课总览.csv'; link.click(); setTimeout(() => URL.revokeObjectURL(url),1000);
};
renderOverview();
