let resultMode = 'students';
let resultPlan;
const resultStudent = {name:'张伟三', identity:'410000201501010000', phone:'18510239330'};
const schoolMain = document.querySelector('#school .org-main');
const schoolList = document.createElement('div');
schoolList.id = 'school-list';
while (schoolMain.firstChild) schoolList.append(schoolMain.firstChild);
schoolMain.append(schoolList);
const resultPage = document.createElement('section');
resultPage.className = 'school-results';
resultPage.hidden = true;
resultPage.innerHTML = `
  <div class="org-breadcrumb"><span>⌂</span><span>/</span><button id="results-back">选课管理</button><span>/</span>选课结果</div>
  <section class="results-summary"><h1 id="results-title"></h1><div class="results-stamp">已结束</div><div class="results-summary-grid"><div><span>预览时间</span><p>-</p></div><div><span>选课时间</span><p id="results-time"></p></div><div><span>开课周期</span><p id="results-period"></p></div><div><span>适用年级</span><p>一年级,二年级,三年级</p></div></div></section>
  <div class="results-controls"><div class="results-modes"><label><input type="radio" name="result-mode" value="preview">排课预览</label><label><input type="radio" name="result-mode" value="students" checked>按学生查看</label><label><input type="radio" name="result-mode" value="courses">按课程查看</label><label><input type="radio" name="result-mode" value="required">查看必选学生</label></div><div class="results-search"><label id="results-status-label" hidden>选课状态<select id="results-status"><option>全部</option><option>已选</option><option>未选</option></select></label><input id="results-search" type="search" placeholder="请输入学生姓名、课程、班级"><button id="results-search-button" title="查询" aria-label="查询">⌕</button></div></div>
  <section class="results-table-section"><div class="results-table-toolbar"><div id="results-counts"><span>计划总数:5</span><button data-selection="selected">已选1人</button><button data-selection="unselected">未选4人</button></div><button id="results-export" class="org-primary">导 出</button></div><div class="results-table-scroll"><table id="results-table"><thead></thead><tbody></tbody></table></div><footer class="org-pagination"><span id="results-total">共 1 条数据</span><button aria-current="page">1</button><select aria-label="结果每页条数"><option>10 条/页</option><option>20 条/页</option></select></footer></section>`;
schoolMain.append(resultPage);
let resultSelection = 'selected';
function openSchoolResults(plan) {
  document.querySelector('#course-students-page')?.setAttribute('hidden','');
  resultPlan = plan;
  schoolList.hidden = true;
  resultPage.hidden = false;
  resultMode = 'students';
  resultSelection = 'selected';
  document.querySelector('[name="result-mode"][value="students"]').checked = true;
  document.querySelector('#results-search').value = '';
  document.querySelector('#results-status').value = '全部';
  document.querySelector('#results-title').textContent = plan[0];
  document.querySelector('#results-time').textContent = plan[1].replaceAll('/','-');
  document.querySelector('#results-period').textContent = plan[2].replaceAll('/','-');
  document.querySelector('.results-stamp').textContent = plan[3];
  renderSchoolResults();
}
document.querySelector('#results-back').onclick = () => { resultPage.hidden = true; schoolList.hidden = false; };
function renderSchoolResults() {
  const courses = resultMode === 'courses';
  document.querySelector('.results-table-section').hidden = courses;
  document.querySelector('#results-course-card').hidden = !courses;
  document.querySelector('#results-search').placeholder = courses ? '请输入课程名称' : '请输入学生姓名、课程、班级';
  if (courses) {
    const matches = 'ZW课后服务课程2-1015'.includes(document.querySelector('#results-search').value.trim());
    document.querySelector('.result-course-item').hidden = !matches;
    document.querySelector('#course-no-results').hidden = matches;
  }
  const required = resultMode === 'required';
  document.querySelector('#results-status-label').hidden = !required;
  document.querySelector('#results-counts').hidden = required || resultMode !== 'students';
  let headers, values;
  if (required) {
    headers = ['姓名','身份证号码','所在行政班','手机号','目标必选课程','目标必选教学班','选课状态'];
    values = [resultStudent.name,resultStudent.identity,'一年级2',resultStudent.phone,'ZW课后服务课程2','1015','已选'];
  } else if (resultMode === 'students') {
    headers = ['姓名','身份证号码','手机号','年级','班级','所选课程'];
    values = [resultStudent.name,resultStudent.identity,resultStudent.phone,'一年级','2','ZW课后服务课程2-1015'];
  } else {
    headers = ['课程名称','教学班','适用年级','上课时间','已选人数'];
    values = ['ZW课后服务课程2','1015','一年级,二年级,三年级','星期四 15:00–16:00','1'];
  }
  const head = document.querySelector('#results-table thead'); head.replaceChildren();
  const headerRow = document.createElement('tr');
  for (const text of headers) { const cell = document.createElement('th'); cell.textContent = text; headerRow.append(cell); }
  head.append(headerRow);
  const body = document.querySelector('#results-table tbody'); body.replaceChildren();
  const search = document.querySelector('#results-search').value.trim();
  const matches = values.some(value => value.includes(search)) && !(required && document.querySelector('#results-status').value === '未选') && !(resultMode === 'students' && resultSelection === 'unselected');
  const row = document.createElement('tr');
  if (matches) {
    for (const value of values) { const cell = document.createElement('td'); cell.textContent = value; row.append(cell); }
  } else { const cell = document.createElement('td'); cell.colSpan = headers.length; cell.className = 'empty-state'; cell.textContent = '暂无数据'; row.append(cell); }
  body.append(row);
  document.querySelector('#results-total').textContent = `共 ${matches ? 1 : 0} 条数据`;
  for (const button of document.querySelectorAll('[data-selection]')) button.classList.toggle('active', button.dataset.selection === resultSelection);
}
for (const input of document.querySelectorAll('[name="result-mode"]')) input.onchange = () => { resultMode = input.value; resultSelection = 'selected'; renderSchoolResults(); };
for (const button of document.querySelectorAll('[data-selection]')) button.onclick = () => { resultSelection = button.dataset.selection; renderSchoolResults(); };
document.querySelector('#results-search').oninput = renderSchoolResults;
document.querySelector('#results-search-button').onclick = renderSchoolResults;
document.querySelector('#results-status').onchange = renderSchoolResults;
document.querySelector('#results-export').onclick = () => {
  const lines = [...document.querySelectorAll('#results-table tr')].map(row => [...row.children].map(cell => '"' + cell.textContent.replaceAll('"','""') + '"').join(','));
  const url = URL.createObjectURL(new Blob(['\uFEFF' + lines.join('\r\n')],{type:'text/csv;charset=utf-8'}));
  const link = document.createElement('a'); link.href = url; link.download = (resultMode === 'required' ? '必选学生' : '选课结果') + '.csv'; link.click();
  setTimeout(() => URL.revokeObjectURL(url),1000);
};
const courseCard = document.createElement('section');
courseCard.id = 'results-course-card';
courseCard.hidden = true;
courseCard.innerHTML = `<article class="result-course-item"><div class="result-course-description"><h2><span class="course-book">▣</span>ZW课后服务课程2-1015</h2><div class="course-stats"><span>已选:1人</span><span>剩余班额:0人</span><span>必选人数:1人</span><span>最小开班:1人</span></div></div><div class="result-course-actions"><button id="course-refund"><span>▤</span>批量退款</button><button id="course-view-students"><span>♧</span>查看学生</button><button id="course-view-details"><span>▤</span>查看详情</button><button id="course-cancel-class"><span>▧</span>取消开班</button></div></article><div id="course-no-results" class="empty-state" hidden>暂无课程</div>`;
resultPage.append(courseCard);
const courseStudentsPage = document.createElement('section');
courseStudentsPage.id = 'course-students-page';
courseStudentsPage.hidden = true;
courseStudentsPage.innerHTML = `<div class="org-breadcrumb"><span>⌂</span><span>/</span><button id="course-students-back">选课管理</button><span>/</span>选课结果查看学生</div><section class="course-student-filters"><p>课程名称：ZW课后服务课程2</p><form id="course-student-filter-form"><label>年级<select name="grade"><option value="">请选择</option><option>一年级</option><option>二年级</option><option>三年级</option></select></label><label>班级<select name="class"><option value="">请选择</option><option>1</option><option>2</option><option>3</option></select></label><input name="search" placeholder="输入学生姓名，手机号查询"><div class="course-student-filter-actions"><button type="reset" class="school-reset">⟳&nbsp; 重置</button><button class="org-primary" type="submit">⌕&nbsp; 查询</button></div></form></section><section class="course-student-list"><header><span>计划总数：1　 已选：1人　 未选：0人</span><button id="course-students-export" class="org-primary">导 出</button></header><div class="course-student-table-wrap"><table id="course-students-table"><thead><tr><th>序号</th><th>学生姓名</th><th>身份证号码</th><th>手机号</th><th>年级</th><th>班级</th><th>报名时间</th></tr></thead><tbody></tbody></table></div><footer class="org-pagination"><span id="course-student-total">共 1 条数据</span><button aria-current="page">1</button><select aria-label="学生每页条数"><option>10 条/页</option><option>20 条/页</option></select></footer></section>`;
schoolMain.append(courseStudentsPage);
function renderCourseStudents() {
  const filters = new FormData(document.querySelector('#course-student-filter-form'));
  const query = filters.get('search').trim();
  const matches = (!filters.get('grade') || filters.get('grade') === '一年级') && (!filters.get('class') || filters.get('class') === '2') && (resultStudent.name.includes(query) || resultStudent.phone.includes(query));
  const tbody = document.querySelector('#course-students-table tbody');
  tbody.replaceChildren();
  const row = document.createElement('tr');
  if (matches) {
    for (const value of ['1',resultStudent.name,resultStudent.identity,resultStudent.phone,'一年级','2','2026-10-15']) {
      const cell = document.createElement('td'); cell.textContent = value; row.append(cell);
    }
  } else {
    const cell = document.createElement('td'); cell.colSpan = 7; cell.className = 'empty-state'; cell.textContent = '暂无数据'; row.append(cell);
  }
  tbody.append(row);
  document.querySelector('#course-student-total').textContent = `共 ${matches ? 1 : 0} 条数据`;
}
document.querySelector('#course-view-students').onclick = () => {
  resultPage.hidden = true; courseStudentsPage.hidden = false;
  document.querySelector('#course-student-filter-form').reset(); renderCourseStudents();
};
document.querySelector('#course-students-back').onclick = () => { courseStudentsPage.hidden = true; resultPage.hidden = false; };
document.querySelector('#course-student-filter-form').onsubmit = event => { event.preventDefault(); renderCourseStudents(); };
document.querySelector('#course-student-filter-form').onreset = () => setTimeout(renderCourseStudents,0);
document.querySelector('#course-students-export').onclick = () => {
  const lines = [...document.querySelectorAll('#course-students-table tr')].map(row => [...row.children].map(cell => '"' + cell.textContent.replaceAll('"','""') + '"').join(','));
  const url = URL.createObjectURL(new Blob(['\uFEFF' + lines.join('\r\n')],{type:'text/csv;charset=utf-8'}));
  const link = document.createElement('a'); link.href = url; link.download = '课程学生明细.csv'; link.click();
  setTimeout(() => URL.revokeObjectURL(url),1000);
};
document.querySelector('#course-view-details').onclick = () => document.querySelector('#details').showModal();
document.querySelector('#course-refund').onclick = () => {
  document.querySelector('#school-plan-title').textContent = '批量退款';
  document.querySelector('#school-plan-info').textContent = '当前课程费用为0元，无可退款金额。';
  document.querySelector('#school-plan-dialog').showModal();
};
document.querySelector('#course-cancel-class').onclick = () => {
  document.querySelector('#school-plan-title').textContent = '取消开班';
  document.querySelector('#school-plan-info').textContent = '当前课程已有学生报名，请先处理报名记录。';
  document.querySelector('#school-plan-dialog').showModal();
};
