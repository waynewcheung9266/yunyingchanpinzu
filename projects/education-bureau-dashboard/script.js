const schoolFilter = document.querySelector("#schoolFilter");
const rulesDrawer = document.querySelector("#rulesDrawer");
document.querySelector("#openRules").addEventListener("click", () => {
  rulesDrawer.showModal();
  document.querySelector(".rules-content").scrollTop = 0;
});
document.querySelector("#closeRules").addEventListener("click", () => rulesDrawer.close());
rulesDrawer.addEventListener("click", (event) => {
  const bounds = rulesDrawer.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) rulesDrawer.close();
});
const dataScreen = document.querySelector("#dataScreen");
const screenCharts = document.querySelector("#screenCharts");
const screenTooltip = document.querySelector("#screenTooltip");
const chartNS = "http://www.w3.org/2000/svg";
function chartNode(tag, attrs, parent = screenCharts) {
  const node = document.createElementNS(chartNS, tag);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
  parent.append(node);
  return node;
}
function chartHover(node, content) {
  node.addEventListener("pointermove", (event) => {
    screenTooltip.textContent = typeof content === "function" ? content(event) : content;
    screenTooltip.hidden = false;
    screenTooltip.style.left = Math.max(8, Math.min(event.clientX + 16, window.innerWidth - 265)) + "px";
    screenTooltip.style.top = Math.max(8, Math.min(event.clientY + 16, window.innerHeight - 140)) + "px";
  });
  node.addEventListener("pointerleave", () => { screenTooltip.hidden = true; });
}
function chartRegion(x, y, width, height, content) {
  chartHover(chartNode("rect", { x, y, width, height, class: "hover-region" }), content);
}
// Rebuild the dim evaluation plot with readable axes and individual data-point targets.
chartNode("rect", { x: 38, y: 919, width: 506, height: 275, fill: "#142140" });
const evaluationNames = ["优秀", "良好", "合格", "不合格"];
const evaluationSeries = [
  { name: "教师评价", color: "#30d8f4", values: [35, 85, 20, 80] },
  { name: "家长评价", color: "#527dff", values: [18, 82, 2, 18] },
  { name: "社会评价", color: "#e044ed", values: [17, 28, 50, 72] }
];
for (let value = 0; value <= 100; value += 20) {
  const y = 1094 - value * 1.6;
  chartNode("line", { x1: 80, x2: 504, y1: y, y2: y, stroke: "#354564", "stroke-dasharray": "4 4" });
  chartNode("text", { x: 69, y: y + 5, fill: "#b0c4de", "font-size": 14, "text-anchor": "end" }).textContent = value;
}
evaluationNames.forEach((name, index) => {
  chartNode("text", { x: 80 + index * 141, y: 1117, fill: "#d0e4fa", "font-size": 15, "text-anchor": "middle" }).textContent = name;
});
evaluationSeries.forEach((series, index) => {
  const points = series.values.map((value, i) => [80 + i * 141, 1094 - value * 1.6]);
  const group = chartNode("g", {});
  chartNode("polyline", { points: points.map((p) => p.join(",")).join(" "), fill: "none", stroke: series.color, "stroke-width": 3 }, group);
  points.forEach(([cx, cy], i) => {
    chartNode("circle", { cx, cy, r: 4, fill: series.color }, group);
    const target = chartNode("circle", { cx, cy, r: 14, fill: "transparent", "pointer-events": "all" }, group);
    chartHover(target, evaluationNames[i] + "\n" + series.name + "：" + series.values[i] + " 份");
  });
  const legend = chartNode("g", { tabindex: 0, role: "button", "aria-label": series.name, style: "cursor:pointer" });
  chartNode("circle", { cx: 133 + index * 112, cy: 1174, r: 7, fill: series.color }, legend);
  chartNode("text", { x: 147 + index * 112, y: 1179, fill: "#c5dcf5", "font-size": 14 }, legend).textContent = series.name;
  const toggle = () => { const hide = group.getAttribute("visibility") !== "hidden"; group.setAttribute("visibility", hide ? "hidden" : "visible"); legend.setAttribute("opacity", hide ? ".4" : "1"); };
  legend.addEventListener("click", toggle);
  legend.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
});
chartRegion(280, 170, 260, 100, "学生绑定情况\n已绑定：1 人\n占比：20%");
chartRegion(280, 280, 260, 100, "学生绑定情况\n未绑定：4 人\n占比：80%");
[["必修课",65],["家庭课",12],["特色校本课",7]].forEach(([name,count], i) => {
  const total = 84, starts = [0,65,77];
  const start = starts[i] / total * Math.PI * 2 - Math.PI / 2;
  const end = (starts[i] + count) / total * Math.PI * 2 - Math.PI / 2;
  const r = 88, cx = 292, cy = 660;
  const d = `M${cx},${cy} L${cx + Math.cos(start)*r},${cy + Math.sin(start)*r} A${r},${r} 0 ${end-start>Math.PI?1:0} 1 ${cx + Math.cos(end)*r},${cy + Math.sin(end)*r} Z`;
  chartHover(chartNode("path", { d, class: "hover-region" }), name + "\n课程资源：" + count + " 门\n占比：" + (count/total*100).toFixed(1) + "%");
});
["必修课", "家庭课", "研学活动"].forEach((name, i) => chartRegion(1545+i*166,145,90,280,name+"\n已开课学校占比：0%"));
["新疆乌鲁木齐二中","新疆乌鲁木齐中学","新疆乌鲁木齐五中","燕子小学学校（测试升学）","升学学校"].forEach((name,i)=>chartRegion(1490,570+i*41,530,41,"第 "+(i+1)+" 名\n"+name+"\n开课率：0%"));
["小学","初中","高中","其它"].forEach((name,i)=>chartRegion(1720,945+i*49,265,46,name+"\n作业提交：0 件\n占比：0%"));
chartRegion(1525,958,168,168,"各学段作业提交情况\n小学：0 件　初中：0 件\n高中：0 件　其它：0 件");
chartRegion(990,160,75,95,"作品数：0");
[[690,"学校",13],[985,"教师",11],[1285,"学生",5]].forEach(([x,name,value])=>chartRegion(x,280,100,90,name+"："+value));
dataScreen.addEventListener("close", () => { screenTooltip.hidden = true; });
function screenText(x, y, text, size = 18, color = "#d6e8ff", anchor = "start") {
  const node = chartNode("text", { x, y, fill: color, "font-size": size, "text-anchor": anchor });
  node.textContent = text;
  return node;
}
// Keep the four overview counters in one evenly spaced row.
chartNode("rect", { x: 620, y: 270, width: 815, height: 115, fill: "#141f37" });
[["学校数",13],["已开课学校数",0],["教师数",11],["学生数",5]].forEach(([name,value],i)=>{
  const x = 705 + i * 205;
  screenText(x,318,value,40,"#2acbe2","middle");
  screenText(x,357,name,21,"#c1cce0","middle");
  chartRegion(x-85,278,170,95,name+"："+value);
});
const screenSchoolNames = ["新疆乌鲁木齐二中","新疆乌鲁木齐中学","新疆乌鲁木齐五中","燕子小学学校","升学学校","实验小学","第一小学","第二小学","育才学校","第三小学"];
function screenRanking(x, title, values, unit, progress = false) {
  chartNode("rect", { x, y: 758, width: 432, height: 444, fill: "#142140", stroke: "#1c3154" });
  screenText(x+18,794,title,22,"#45b8f5");
  screenText(x+18,824,"排名",14,"#76a9c7");
  screenText(x+68,824,"学校名称",14,"#76a9c7");
  screenText(x+414,824,progress?"上课进度（%）":"优秀学生数（人）",14,"#76a9c7","end");
  values.forEach((value,i)=>{
    const y = 836 + i*35;
    chartNode("rect", { x:x+8,y,width:416,height:33,fill:i%2?"#182947":"#152440" });
    screenText(x+30,y+22,i+1,16,i<3?"#34d4ee":"#c2d4e9","middle");
    screenText(x+68,y+22,screenSchoolNames[i],15);
    screenText(x+410,y+22,value+unit,17,"#38d7ed","end");
    chartRegion(x+8,y,416,33,"第 "+(i+1)+" 名\n"+screenSchoolNames[i]+"\n"+(progress?"上课进度：":"优秀学生数：")+value+unit);
  });
}
screenRanking(580,"上课进度前10学校排名",Array(10).fill(0),"%",true);
screenRanking(1030,"各校优秀学生数排名",[18,16,14,12,10,8,6,5,3,1]," 人");
// School-level submission summary includes the requested submission-rate column.
chartNode("rect", { x: 1488,y:842,width:534,height:360,fill:"#142140",stroke:"#1c3154" });
screenText(1506,889,"各学校作业提交情况",25,"#45b8f5");
screenText(1510,930,"学校名称",16,"#76a9c7");
screenText(1840,930,"提交数（件）",16,"#76a9c7","end");
screenText(2002,930,"作业提交率",16,"#76a9c7","end");
screenSchoolNames.slice(0,5).forEach((name,i)=>{
  const y=946+i*46;
  chartNode("rect",{x:1500,y,width:510,height:44,fill:i%2?"#182947":"#152440"});
  screenText(1510,y+28,name,17);
  screenText(1830,y+28,"0",19,"#e6f3ff","end");
  screenText(2002,y+28,"0%",19,"#2acbe2","end");
  chartRegion(1500,y,510,44,name+"\n作业提交数：0 件\n作业提交率：0%");
});
document.querySelector("#openDataScreen").addEventListener("click", async (event) => {
  event.preventDefault();
  dataScreen.showModal();
  try { await dataScreen.requestFullscreen(); } catch {}
});
document.querySelector("#closeDataScreen").addEventListener("click", async () => {
  if (document.fullscreenElement === dataScreen) {
    try { await document.exitFullscreen(); } catch {}
  }
  dataScreen.close();
});
dataScreen.addEventListener("cancel", () => {
  if (document.fullscreenElement === dataScreen) document.exitFullscreen().catch(() => {});
});
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
