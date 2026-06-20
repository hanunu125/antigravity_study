/* app.js */

// --------------------------------------------------------------------------
// 1. DATABASE SERVICE (LocalStorage Mock DB)
// --------------------------------------------------------------------------
const DB_PREFIX = "mentohub_";

const MOCK_USERS = {
  mentor: { id: "mentor", name: "김민수", role: "mentor", details: "서울대학교 수학교육과 (멘토)", targetMentee: "이영희" },
  mentee: { id: "mentee", name: "이영희", role: "mentee", details: "한국고등학교 1학년 (멘티)", targetMentor: "김민수" },
  admin: { id: "admin", name: "사무국 담당자", role: "admin", details: "운영본부 관리자", scope: "전체 멘토링 커플" }
};

const INITIAL_SCHEDULES = [
  { id: "sch_1", date: "2026-06-03", startTime: "16:00", endTime: "18:00", subject: "수학", topic: "다항식의 연산 및 인수분해", mentorName: "김민수", menteeName: "이영희", status: "completed" },
  { id: "sch_2", date: "2026-06-10", startTime: "16:00", endTime: "18:00", subject: "수학", topic: "이차방정식과 이차함수의 관계", mentorName: "김민수", menteeName: "이영희", status: "completed" },
  { id: "sch_3", date: "2026-06-17", startTime: "16:00", endTime: "18:00", subject: "과학", topic: "물리학 I - 힘과 운동 (속도와 가속도)", mentorName: "김민수", menteeName: "이영희", status: "completed" },
  { id: "sch_4", date: "2026-06-24", startTime: "16:00", endTime: "18:00", subject: "수학", topic: "삼각함수의 정의와 성질", mentorName: "김민수", menteeName: "이영희", status: "scheduled" },
  { id: "sch_5", date: "2026-07-01", startTime: "16:00", endTime: "18:00", subject: "과학", topic: "물리학 I - 뉴턴의 운동 법칙 적용", mentorName: "김민수", menteeName: "이영희", status: "scheduled" }
];

const INITIAL_LOGS = [
  { id: "log_1", date: "2026-06-03", subject: "수학", hours: 2, topic: "다항식의 연산 및 인수분해", content: "고등 수학(상)의 다항식 기초 개념을 확인하고 인수분해 공식을 복습함. 기본 유형의 문제 풀이를 통해 멘티가 공식을 적용하는 과정을 집중적으로 조사하고 오답 노트를 작성하도록 지도함. 이해도가 높은 편임.", progress: 85, mentorName: "김민수", menteeName: "이영희" },
  { id: "log_2", date: "2026-06-10", subject: "수학", hours: 2, topic: "이차방정식과 이차함수의 관계", content: "이차방정식의 근의 판별 및 이차함수 그래프의 교점 개수 사이의 연관성을 증명하고 적용 문제를 해결함. 특히 함수 그래프를 활용한 시각적 이해를 중점적으로 훈련함. 판별식 활용 부분에서 멘티가 기호 계산 실수를 줄일 수 있도록 연습문제를 과제로 제시함.", progress: 80, mentorName: "김민수", menteeName: "이영희" },
  { id: "log_3", date: "2026-06-17", subject: "과학", hours: 2, topic: "물리학 I - 힘과 운동 (속도와 가속도)", content: "가속도의 정의를 이해하고 등가속도 직선 운동의 세 가지 핵심 공식을 함께 분석함. 그래프(v-t) 분석을 통해 이동거리와 변위의 물리적 차이를 시각화하여 확인해 줌. 멘티가 개념 부분에서 헷갈려하던 부분을 상당 부분 해소함.", progress: 90, mentorName: "김민수", menteeName: "이영희" }
];

const INITIAL_FEED = [
  {
    id: "feed_1",
    authorName: "이영희",
    authorRole: "mentee",
    content: "수학 삼각함수 공식이 너무 많아서 외우기가 힘들어요. 멘토님만의 암기 비법이나 단원 공부 팁이 있을까요? ㅠㅠ",
    date: "2026-06-18 19:42",
    comments: [
      { id: "c_1", authorName: "김민수", authorRole: "mentor", content: "영희 학생 반가워요! 삼각함수는 억지로 식만 외우기보다는 1) 반지름이 1인 단위원을 그리면서 정의(사인=y, 코사인=x, 탄젠트=기울기)를 시각화하여 이해하는 것을 최우선으로 해야 헷갈리지 않아요. 다음 6/24 과외 세션 때 핵심 패턴 몇 개를 같이 정리해 볼게요!", date: "2026-06-18 21:10" }
    ]
  },
  {
    id: "feed_2",
    authorName: "김민수",
    authorRole: "mentor",
    content: "이번 주 6/24(수) 멘토링은 예정대로 오후 4시에 진행하도록 하겠습니다. 미리 예습 문제집의 삼각함수 정의 파트 개념만 가볍게 읽고 오면 수업 효율이 훨씬 높아집니다!",
    date: "2026-06-20 10:15",
    comments: [
      { id: "c_2", authorName: "이영희", authorRole: "mentee", content: "네 멘토님! 알려주신 대로 앞부분 예습해 가겠습니다. 수요일에 뵙겠습니다~", date: "2026-06-20 12:30" }
    ]
  },
  {
    id: "feed_3",
    authorName: "이영희",
    authorRole: "mentee",
    content: "오늘 물리 복습하다가 이동거리와 변위의 차이점에 대해 궁금한 점이 생겼는데, 만약 육상 트랙을 한 바퀴 다 돌았을 때의 이동거리와 변위는 각각 어떻게 계산되나요?",
    date: "2026-06-17 21:05",
    comments: [
      { id: "c_3", authorName: "김민수", authorRole: "mentor", content: "좋은 질문입니다! 한 바퀴를 완전히 도는 경우, 1) 이동거리는 실제로 트랙을 한 바퀴 달린 '곡선의 길이 전체(예: 400m)'가 되지만, 2) 변위는 처음 위치와 나중 위치의 직선거리이므로 제자리로 돌아왔기 때문에 '0'이 됩니다. 즉 방향과 위치 변화만을 따지는 변위의 특성 때문입니다.", date: "2026-06-17 21:50" }
    ]
  }
];

class MentoDatabase {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(DB_PREFIX + "initialized")) {
      localStorage.setItem(DB_PREFIX + "schedules", JSON.stringify(INITIAL_SCHEDULES));
      localStorage.setItem(DB_PREFIX + "logs", JSON.stringify(INITIAL_LOGS));
      localStorage.setItem(DB_PREFIX + "feed", JSON.stringify(INITIAL_FEED));
      localStorage.setItem(DB_PREFIX + "initialized", "true");
    }
  }

  getCurrentUser() {
    const user = localStorage.getItem(DB_PREFIX + "current_user");
    return user ? JSON.parse(user) : null;
  }

  setCurrentUser(role) {
    if (MOCK_USERS[role]) {
      localStorage.setItem(DB_PREFIX + "current_user", JSON.stringify(MOCK_USERS[role]));
      return MOCK_USERS[role];
    }
    return null;
  }

  logout() {
    localStorage.removeItem(DB_PREFIX + "current_user");
  }

  getSchedules() {
    return JSON.parse(localStorage.getItem(DB_PREFIX + "schedules") || "[]");
  }

  saveSchedule(schedule) {
    const schedules = this.getSchedules();
    if (schedule.id) {
      const idx = schedules.findIndex(s => s.id === schedule.id);
      if (idx !== -1) schedules[idx] = schedule;
    } else {
      schedule.id = "sch_" + Date.now();
      schedules.push(schedule);
    }
    localStorage.setItem(DB_PREFIX + "schedules", JSON.stringify(schedules));
    return schedule;
  }

  deleteSchedule(id) {
    let schedules = this.getSchedules();
    schedules = schedules.filter(s => s.id !== id);
    localStorage.setItem(DB_PREFIX + "schedules", JSON.stringify(schedules));
  }

  getLogs() {
    return JSON.parse(localStorage.getItem(DB_PREFIX + "logs") || "[]");
  }

  saveLog(log) {
    const logs = this.getLogs();
    if (log.id) {
      const idx = logs.findIndex(l => l.id === log.id);
      if (idx !== -1) logs[idx] = log;
    } else {
      log.id = "log_" + Date.now();
      logs.push(log);
    }
    localStorage.setItem(DB_PREFIX + "logs", JSON.stringify(logs));
    return log;
  }

  deleteLog(id) {
    let logs = this.getLogs();
    logs = logs.filter(l => l.id !== id);
    localStorage.setItem(DB_PREFIX + "logs", JSON.stringify(logs));
  }

  getFeeds() {
    return JSON.parse(localStorage.getItem(DB_PREFIX + "feed") || "[]");
  }

  addFeedPost(content, authorName, authorRole) {
    const feeds = this.getFeeds();
    const newPost = {
      id: "feed_" + Date.now(),
      authorName,
      authorRole,
      content,
      date: this.formatCurrentTime(),
      comments: []
    };
    feeds.unshift(newPost);
    localStorage.setItem(DB_PREFIX + "feed", JSON.stringify(feeds));
    return newPost;
  }

  addFeedComment(feedId, content, authorName, authorRole) {
    const feeds = this.getFeeds();
    const idx = feeds.findIndex(f => f.id === feedId);
    if (idx !== -1) {
      const newComment = {
        id: "c_" + Date.now(),
        authorName,
        authorRole,
        content,
        date: this.formatCurrentTime()
      };
      feeds[idx].comments.push(newComment);
      localStorage.setItem(DB_PREFIX + "feed", JSON.stringify(feeds));
      return newComment;
    }
    return null;
  }

  formatCurrentTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${date} ${hours}:${minutes}`;
  }
}

window.db = new MentoDatabase();

// --------------------------------------------------------------------------
// 2. DASHBOARD LOGIC
// --------------------------------------------------------------------------
class DashboardComponent {
  init() {
    this.render();
  }

  render() {
    const currentUser = window.db.getCurrentUser();
    if (!currentUser) return;

    const schedules = window.db.getSchedules();
    const logs = window.db.getLogs();
    const feeds = window.db.getFeeds();

    const totalHours = logs.reduce((sum, log) => sum + Number(log.hours), 0);
    const completedSessions = schedules.filter(s => s.status === 'completed').length;
    const logCount = logs.length;

    document.getElementById('dash-hours').innerText = `${totalHours}시간`;
    document.getElementById('dash-sessions').innerText = `${completedSessions}회`;
    document.getElementById('dash-logs').innerText = `${logCount}건`;

    this.populateNextSession(schedules);
    this.populatePairInfo(currentUser);
    this.populateTimeline(schedules, logs, feeds);
  }

  populateNextSession(schedules) {
    const nextSessionContainer = document.getElementById('next-session-container');
    const upcoming = schedules
      .filter(s => s.status === 'scheduled')
      .sort((a, b) => new Date(a.date + 'T' + a.startTime) - new Date(b.date + 'T' + b.startTime));

    if (upcoming.length === 0) {
      nextSessionContainer.innerHTML = `
        <div class="empty-list-text">
          <i class="fa-regular fa-calendar-plus" style="font-size: 2rem; display: block; margin-bottom: 8px;"></i>
          예정된 다음 일정이 없습니다.<br>새 일정을 등록해 보세요!
        </div>
      `;
      return;
    }

    const next = upcoming[0];
    const todayStr = this.formatDateString(new Date());
    const nextDate = new Date(next.date + 'T00:00:00');
    const todayDate = new Date(todayStr + 'T00:00:00');
    const diffTime = nextDate - todayDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let dDayText = "";
    let dDayClass = "dday-badge";
    if (diffDays === 0) {
      dDayText = "D-DAY";
      dDayClass += " today";
    } else if (diffDays > 0) {
      dDayText = `D-${diffDays}`;
    } else {
      dDayText = `D+${Math.abs(diffDays)}`;
    }

    const week = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = week[new Date(next.date).getDay()];

    nextSessionContainer.innerHTML = `
      <div class="session-info-box">
        <div class="session-top">
          <span class="session-subject">[${next.subject}] 멘토링 세션</span>
          <span class="${dDayClass}">${dDayText}</span>
        </div>
        <div class="session-time">
          <i class="fa-regular fa-clock"></i>
          <span>${next.date} (${dayOfWeek}) ${next.startTime} ~ ${next.endTime}</span>
        </div>
        <div class="session-topic">
          <i class="fa-solid fa-graduation-cap"></i>
          <span>학습 주제: ${next.topic}</span>
        </div>
      </div>
    `;
  }

  populatePairInfo(currentUser) {
    let mentorText = "김민수 (서울대 수학교육과)";
    let menteeText = "이영희 (한국고등학교 1학년)";
    
    if (currentUser.role === 'mentor') {
      mentorText = `<strong>${currentUser.name} (나)</strong>`;
      menteeText = `${currentUser.targetMentee} (한국고교)`;
    } else if (currentUser.role === 'mentee') {
      mentorText = `${currentUser.targetMentor} (서울대)`;
      menteeText = `<strong>${currentUser.name} (나)</strong>`;
    }

    const pairDetails = document.querySelector('.pair-details');
    if (pairDetails) {
      pairDetails.innerHTML = `
        <div class="pair-member">
          <span class="p-label">지도 멘토</span>
          <span class="p-value">${mentorText}</span>
        </div>
        <div class="pair-arrow"><i class="fa-solid fa-arrows-left-right"></i></div>
        <div class="pair-member">
          <span class="p-label">대상 멘티</span>
          <span class="p-value">${menteeText}</span>
        </div>
      `;
    }
  }

  populateTimeline(schedules, logs, feeds) {
    const timelineContainer = document.getElementById('dash-timeline');
    const events = [];

    schedules.forEach(s => {
      let title = "";
      let desc = `주제: ${s.topic}`;
      let timeKey = s.date + 'T' + s.startTime;
      let displayTime = `${s.date} ${s.startTime}`;

      if (s.status === 'completed') {
        title = `[일정 완료] ${s.subject} 멘토링 세션`;
      } else {
        title = `[일정 예정] ${s.subject} 멘토링 세션`;
      }
      events.push({ title, desc, time: displayTime, sortTime: new Date(timeKey), type: s.status });
    });

    logs.forEach(l => {
      events.push({
        title: `[학습 기록 작성] ${l.subject} - ${l.topic}`,
        desc: l.content,
        time: l.date,
        sortTime: new Date(l.date + 'T18:00:00'),
        type: 'log'
      });
    });

    feeds.forEach(f => {
      events.push({
        title: `[소통 피드] ${f.authorName}님이 새 글을 등록했습니다.`,
        desc: f.content,
        time: f.date,
        sortTime: new Date(f.date.replace(' ', 'T')),
        type: 'feed'
      });
    });

    events.sort((a, b) => b.sortTime - a.sortTime);

    if (events.length === 0) {
      timelineContainer.innerHTML = `<div class="empty-list-text">활동 내역이 없습니다.</div>`;
      return;
    }

    const recentEvents = events.slice(0, 5);

    timelineContainer.innerHTML = recentEvents.map(ev => {
      let timelineClass = "timeline-item";
      if (ev.type === 'completed' || ev.type === 'log') {
        timelineClass += " completed";
      } else if (ev.type === 'scheduled') {
        timelineClass += " active";
      }

      return `
        <div class="${timelineClass}">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <div class="timeline-header">
              <span class="timeline-title">${ev.title}</span>
              <span class="timeline-time">${ev.time}</span>
            </div>
            <div class="timeline-desc">${this.truncateText(ev.desc, 100)}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  formatDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  truncateText(text, max) {
    if (!text) return "";
    if (text.length <= max) return text;
    return text.substring(0, max) + "...";
  }
}

window.dashboardComponent = new DashboardComponent();

// --------------------------------------------------------------------------
// 3. CALENDAR LOGIC
// --------------------------------------------------------------------------
class CalendarComponent {
  constructor() {
    this.currentDate = new Date();
    this.currentDate.setFullYear(2026);
    this.currentDate.setMonth(5);
  }

  init() {
    this.render();
  }

  render() {
    const currentUser = window.db.getCurrentUser();
    if (!currentUser) return;

    const btnAddSchedule = document.getElementById('btn-add-schedule');
    if (currentUser.role === 'mentor') {
      btnAddSchedule.style.display = 'inline-flex';
    } else {
      btnAddSchedule.style.display = 'none';
    }

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    document.getElementById('calendar-month-year').innerText = `${year}년 ${month + 1}월`;

    this.renderDaysGrid(year, month);
    this.renderMiniScheduleList(year, month);
  }

  prevMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.render();
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.render();
  }

  renderDaysGrid(year, month) {
    const gridContainer = document.getElementById('calendar-days');
    gridContainer.innerHTML = '';

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthTotalDays = new Date(year, month, 0).getDate();

    const schedules = window.db.getSchedules();
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    for (let i = firstDayIndex; i > 0; i--) {
      const dayNum = prevMonthTotalDays - i + 1;
      const dateStr = this.formatDateString(year, month - 1, dayNum);
      const cell = this.createDayCell(dayNum, dateStr, 'outside', schedules, todayStr);
      gridContainer.appendChild(cell);
    }

    for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
      const dateStr = this.formatDateString(year, month, dayNum);
      const isSunday = new Date(year, month, dayNum).getDay() === 0;
      const isSaturday = new Date(year, month, dayNum).getDay() === 6;
      let dayClass = '';
      if (isSunday) dayClass = 'sunday';
      else if (isSaturday) dayClass = 'saturday';

      const cell = this.createDayCell(dayNum, dateStr, dayClass, schedules, todayStr);
      gridContainer.appendChild(cell);
    }

    const totalCells = gridContainer.children.length;
    const remainingCells = 42 - totalCells;
    for (let dayNum = 1; dayNum <= remainingCells; dayNum++) {
      const dateStr = this.formatDateString(year, month + 1, dayNum);
      const cell = this.createDayCell(dayNum, dateStr, 'outside', schedules, todayStr);
      gridContainer.appendChild(cell);
    }
  }

  createDayCell(dayNum, dateStr, className, schedules, todayStr) {
    const dayCell = document.createElement('div');
    dayCell.className = `calendar-day ${className}`;
    if (dateStr === todayStr) {
      dayCell.className += ' today-cell';
    }

    const currentUser = window.db.getCurrentUser();
    if (currentUser.role === 'mentor' && !className.includes('outside')) {
      dayCell.addEventListener('dblclick', () => this.openAddModal(dateStr));
      dayCell.title = "더블클릭하여 일정을 추가하세요";
    }

    dayCell.innerHTML = `
      <div class="day-number-wrapper">
        <span class="day-number">${dayNum}</span>
      </div>
      <div class="day-events-container"></div>
    `;

    const eventsContainer = dayCell.querySelector('.day-events-container');
    const daySchedules = schedules.filter(s => s.date === dateStr);
    
    daySchedules.forEach(sch => {
      const pill = document.createElement('div');
      pill.className = `calendar-event-pill ${sch.status}`;
      pill.innerText = `${sch.startTime} [${sch.subject}] ${sch.topic}`;
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openEditModal(sch);
      });
      eventsContainer.appendChild(pill);
    });

    return dayCell;
  }

  renderMiniScheduleList(year, month) {
    const listContainer = document.getElementById('calendar-list-mini');
    listContainer.innerHTML = '';

    const schedules = window.db.getSchedules();
    const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    const monthSchedules = schedules
      .filter(s => s.date.startsWith(monthPrefix))
      .sort((a, b) => new Date(a.date + 'T' + a.startTime) - new Date(b.date + 'T' + b.startTime));

    if (monthSchedules.length === 0) {
      listContainer.innerHTML = `<div class="empty-list-text">이달에 등록된 일정이 없습니다.</div>`;
      return;
    }

    monthSchedules.forEach(sch => {
      const item = document.createElement('div');
      item.className = `mini-schedule-item ${sch.status}`;
      item.innerHTML = `
        <div class="mini-item-header">
          <span class="mini-item-date">${sch.date}</span>
          <span class="mini-item-subject badge badge-primary">${sch.subject}</span>
        </div>
        <div class="mini-item-time"><i class="fa-regular fa-clock"></i> ${sch.startTime} ~ ${sch.endTime}</div>
        <div class="mini-item-topic"><i class="fa-solid fa-graduation-cap"></i> ${sch.topic}</div>
      `;
      item.addEventListener('click', () => this.openEditModal(sch));
      listContainer.appendChild(item);
    });
  }

  openAddModal(dateStr = '') {
    const modal = document.getElementById('calendar-modal');
    document.getElementById('calendar-modal-title').innerText = "멘토링 일정 등록";
    
    const form = document.getElementById('calendar-schedule-form');
    form.reset();
    document.getElementById('sch-id').value = '';
    
    if (dateStr) {
      document.getElementById('sch-date').value = dateStr;
    } else {
      const today = new Date();
      document.getElementById('sch-date').value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    }

    this.setModalEditable(true);
    modal.classList.add('active');
  }

  openEditModal(schedule) {
    const modal = document.getElementById('calendar-modal');
    document.getElementById('calendar-modal-title').innerText = "멘토링 일정 상세 및 편집";
    
    document.getElementById('sch-id').value = schedule.id;
    document.getElementById('sch-date').value = schedule.date;
    document.getElementById('sch-start-time').value = schedule.startTime;
    document.getElementById('sch-end-time').value = schedule.endTime;
    document.getElementById('sch-subject').value = schedule.subject;
    document.getElementById('sch-topic').value = schedule.topic;

    const currentUser = window.db.getCurrentUser();
    const isMentor = currentUser.role === 'mentor';

    this.setModalEditable(isMentor);
    modal.classList.add('active');
  }

  setModalEditable(editable) {
    const form = document.getElementById('calendar-schedule-form');
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.disabled = !editable;
    });

    const btnDelete = document.getElementById('btn-delete-schedule');
    const btnSave = document.getElementById('btn-save-schedule');
    const schId = document.getElementById('sch-id').value;

    if (editable) {
      btnSave.style.display = 'inline-flex';
      btnDelete.style.display = schId ? 'inline-flex' : 'none';
    } else {
      btnSave.style.display = 'none';
      btnDelete.style.display = 'none';
    }
  }

  closeModal() {
    const modal = document.getElementById('calendar-modal');
    modal.classList.remove('active');
  }

  handleSubmit(e) {
    e.preventDefault();
    const currentUser = window.db.getCurrentUser();
    if (currentUser.role !== 'mentor') return;

    const id = document.getElementById('sch-id').value;
    const date = document.getElementById('sch-date').value;
    const startTime = document.getElementById('sch-start-time').value;
    const endTime = document.getElementById('sch-end-time').value;
    const subject = document.getElementById('sch-subject').value;
    const topic = document.getElementById('sch-topic').value;

    const todayStr = this.formatDateString(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    const status = date <= todayStr ? 'completed' : 'scheduled';

    const schedule = {
      id: id || undefined,
      date,
      startTime,
      endTime,
      subject,
      topic,
      mentorName: "김민수",
      menteeName: "이영희",
      status
    };

    window.db.saveSchedule(schedule);
    this.closeModal();
    this.render();
    
    if (typeof window.dashboardComponent !== 'undefined') {
      window.dashboardComponent.render();
    }
  }

  deleteEvent() {
    const id = document.getElementById('sch-id').value;
    if (!id) return;

    if (confirm("정말 이 일정을 삭제하시겠습니까?")) {
      window.db.deleteSchedule(id);
      this.closeModal();
      this.render();

      if (typeof window.dashboardComponent !== 'undefined') {
        window.dashboardComponent.render();
      }
    }
  }

  formatDateString(year, month, day) {
    const tempDate = new Date(year, month, day);
    const y = tempDate.getFullYear();
    const m = String(tempDate.getMonth() + 1).padStart(2, '0');
    const d = String(tempDate.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}

window.calendarComponent = new CalendarComponent();

// --------------------------------------------------------------------------
// 4. STUDY LOGS LOGIC
// --------------------------------------------------------------------------
class LogsComponent {
  init() {
    this.hideForm();
    this.render();
  }

  render() {
    const currentUser = window.db.getCurrentUser();
    if (!currentUser) return;

    const logs = window.db.getLogs();
    const btnOpenForm = document.getElementById('btn-open-log-form');
    
    const isMentor = currentUser.role === 'mentor';
    if (isMentor) {
      btnOpenForm.style.display = 'inline-flex';
    } else {
      btnOpenForm.style.display = 'none';
      this.hideForm();
    }

    const logsTable = document.querySelector('.logs-table');
    const actionsHeader = logsTable.querySelector('thead th.actions-col');
    if (isMentor) {
      actionsHeader.style.display = '';
    } else {
      actionsHeader.style.display = 'none';
    }

    const tbody = document.getElementById('logs-list-tbody');
    tbody.innerHTML = '';

    if (logs.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="${isMentor ? 7 : 6}" class="empty-text" style="text-align: center; padding: 40px; color: var(--text-tertiary);">
            작성된 학습 기록이 없습니다.
          </td>
        </tr>
      `;
      return;
    }

    const sortedLogs = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedLogs.forEach(log => {
      const tr = document.createElement('tr');
      
      let actionsHTML = '';
      if (isMentor) {
        actionsHTML = `
          <td class="actions-col">
            <button class="btn-table-action" onclick="logsComponent.editLog('${log.id}')" title="수정"><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="btn-table-action delete" onclick="logsComponent.deleteLog('${log.id}')" title="삭제"><i class="fa-solid fa-trash-can"></i></button>
          </td>
        `;
      }

      tr.innerHTML = `
        <td><strong>${log.date}</strong></td>
        <td><span class="badge badge-primary">${log.subject}</span></td>
        <td>${log.hours}시간</td>
        <td><strong>${log.topic}</strong></td>
        <td><div class="log-text-detail" title="${log.content}">${log.content}</div></td>
        <td>
          <div class="table-progress-bar">
            <div class="table-progress-fill" style="width: ${log.progress}%"></div>
          </div>
          <span class="table-progress-text">${log.progress}%</span>
        </td>
        ${actionsHTML}
      `;
      tbody.appendChild(tr);
    });
  }

  showForm(editId = '') {
    const container = document.getElementById('log-form-container');
    const form = document.getElementById('study-log-form');
    const title = document.getElementById('log-form-title');
    
    form.reset();
    document.getElementById('log-edit-id').value = '';
    document.getElementById('progress-val').innerText = '80%';
    document.getElementById('log-progress').value = 80;

    if (editId) {
      title.innerText = "학습 기록 수정";
      const logs = window.db.getLogs();
      const log = logs.find(l => l.id === editId);
      if (log) {
        document.getElementById('log-edit-id').value = log.id;
        document.getElementById('log-date').value = log.date;
        document.getElementById('log-subject').value = log.subject;
        document.getElementById('log-hours').value = log.hours;
        document.getElementById('log-topic').value = log.topic;
        document.getElementById('log-content').value = log.content;
        document.getElementById('log-progress').value = log.progress;
        document.getElementById('progress-val').innerText = log.progress + '%';
      }
    } else {
      title.innerText = "학습 기록 등록";
      const today = new Date();
      document.getElementById('log-date').value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    }

    container.style.display = 'block';
    container.scrollIntoView({ behavior: 'smooth' });
  }

  hideForm() {
    document.getElementById('log-form-container').style.display = 'none';
  }

  handleSubmit(e) {
    e.preventDefault();
    const currentUser = window.db.getCurrentUser();
    if (currentUser.role !== 'mentor') return;

    const id = document.getElementById('log-edit-id').value;
    const date = document.getElementById('log-date').value;
    const subject = document.getElementById('log-subject').value;
    const hours = document.getElementById('log-hours').value;
    const topic = document.getElementById('log-topic').value;
    const content = document.getElementById('log-content').value;
    const progress = document.getElementById('log-progress').value;

    const log = {
      id: id || undefined,
      date,
      subject,
      hours: Number(hours),
      topic,
      content,
      progress: Number(progress),
      mentorName: "김민수",
      menteeName: "이영희"
    };

    window.db.saveLog(log);
    this.hideForm();
    this.render();

    if (typeof window.dashboardComponent !== 'undefined') {
      window.dashboardComponent.render();
    }
  }

  editLog(id) {
    this.showForm(id);
  }

  deleteLog(id) {
    if (confirm("정말 이 학습 기록을 삭제하시겠습니까?")) {
      window.db.deleteLog(id);
      this.render();

      if (typeof window.dashboardComponent !== 'undefined') {
        window.dashboardComponent.render();
      }
    }
  }
}

window.logsComponent = new LogsComponent();

// --------------------------------------------------------------------------
// 5. FEED Q&A LOGIC
// --------------------------------------------------------------------------
class FeedComponent {
  init() {
    this.render();
  }

  render() {
    const currentUser = window.db.getCurrentUser();
    if (!currentUser) return;

    const roleLabel = currentUser.role === 'mentor' ? '멘토' : (currentUser.role === 'mentee' ? '멘티' : '운영자');
    document.getElementById('feed-write-user').innerHTML = `
      <i class="fa-solid fa-user-pen"></i> ${currentUser.name} (${roleLabel})
    `;

    const feeds = window.db.getFeeds();
    const listContainer = document.getElementById('feed-posts-list');
    listContainer.innerHTML = '';

    if (feeds.length === 0) {
      listContainer.innerHTML = `
        <div class="glass-card text-center" style="text-align: center; padding: 40px; color: var(--text-tertiary);">
          <i class="fa-regular fa-comments" style="font-size: 2.5rem; display: block; margin-bottom: 12px; color: var(--text-tertiary);"></i>
          소통 피드에 등록된 글이 없습니다. 첫 글을 등록해 보세요!
        </div>
      `;
      return;
    }

    feeds.forEach(post => {
      const card = document.createElement('div');
      card.className = 'feed-post-card';

      let commentsHTML = '';
      if (post.comments && post.comments.length > 0) {
        commentsHTML = post.comments.map(c => {
          const cAvatarLetter = c.authorName.charAt(0);
          const cRoleBadge = c.authorRole === 'mentor' ? '멘토' : (c.authorRole === 'mentee' ? '멘티' : '운영자');
          const cBadgeClass = c.authorRole === 'mentor' ? 'badge-primary' : (c.authorRole === 'mentee' ? 'badge-success' : 'badge-warning');

          return `
            <div class="feed-comment-item">
              <div class="comment-avatar">${cAvatarLetter}</div>
              <div class="comment-content-box">
                <div class="comment-author-row">
                  <span class="comment-author-name">${c.authorName}</span>
                  <span class="badge ${cBadgeClass}">${cRoleBadge}</span>
                </div>
                <div class="comment-text">${c.content}</div>
                <span class="comment-date">${c.date}</span>
              </div>
            </div>
          `;
        }).join('');
      } else {
        commentsHTML = `<div class="empty-list-text" style="padding: 10px; font-size: 0.8rem;">작성된 답변이나 댓글이 없습니다.</div>`;
      }

      const avatarLetter = post.authorName.charAt(0);
      const postRoleBadge = post.authorRole === 'mentor' ? '멘토' : (post.authorRole === 'mentee' ? '멘티' : '운영자');
      const postBadgeClass = post.authorRole === 'mentor' ? 'badge-primary' : (post.authorRole === 'mentee' ? 'badge-success' : 'badge-warning');
      const commentsCount = post.comments ? post.comments.length : 0;

      card.innerHTML = `
        <div class="feed-post-header">
          <div class="avatar">${avatarLetter}</div>
          <div class="feed-post-header-info">
            <div class="feed-author-name-row">
              <span class="feed-author-name">${post.authorName}</span>
              <span class="badge ${postBadgeClass}">${postRoleBadge}</span>
            </div>
            <span class="feed-post-date">${post.date}</span>
          </div>
        </div>
        <div class="feed-post-body">${post.content}</div>
        <div class="feed-post-actions">
          <button class="feed-action-btn" onclick="feedComponent.toggleComments('${post.id}')">
            <i class="fa-regular fa-comment-dots"></i> 댓글 (${commentsCount})
          </button>
        </div>
        
        <div class="feed-comments-section" id="comments-section-${post.id}" style="display: none;">
          <div class="comments-list" id="comments-list-${post.id}">
            ${commentsHTML}
          </div>
          <div class="write-comment-box">
            <input type="text" class="write-comment-input" id="comment-input-${post.id}" placeholder="댓글 또는 답변을 입력하세요..." onkeydown="feedComponent.handleCommentKey(event, '${post.id}')">
            <button class="btn btn-primary btn-comment-submit" onclick="feedComponent.submitComment('${post.id}')">등록</button>
          </div>
        </div>
      `;

      listContainer.appendChild(card);
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const currentUser = window.db.getCurrentUser();
    if (!currentUser) return;

    const input = document.getElementById('feed-input');
    const content = input.value.trim();
    if (!content) return;

    window.db.addFeedPost(content, currentUser.name, currentUser.role);
    input.value = '';
    this.render();

    if (typeof window.dashboardComponent !== 'undefined') {
      window.dashboardComponent.render();
    }
  }

  toggleComments(postId) {
    const section = document.getElementById(`comments-section-${postId}`);
    if (section.style.display === 'none') {
      section.style.display = 'flex';
      const input = document.getElementById(`comment-input-${postId}`);
      if (input) input.focus();
    } else {
      section.style.display = 'none';
    }
  }

  handleCommentKey(e, postId) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.submitComment(postId);
    }
  }

  submitComment(postId) {
    const currentUser = window.db.getCurrentUser();
    if (!currentUser) return;

    const input = document.getElementById(`comment-input-${postId}`);
    const content = input.value.trim();
    if (!content) return;

    window.db.addFeedComment(postId, content, currentUser.name, currentUser.role);
    input.value = '';
    
    this.render();
    document.getElementById(`comments-section-${postId}`).style.display = 'flex';

    if (typeof window.dashboardComponent !== 'undefined') {
      window.dashboardComponent.render();
    }
  }
}

window.feedComponent = new FeedComponent();

// --------------------------------------------------------------------------
// 6. REPORT GENERATOR LOGIC
// --------------------------------------------------------------------------
class ReportComponent {
  init() {
    document.getElementById('rep-start-date').value = '2026-06-01';
    document.getElementById('rep-end-date').value = '2026-06-30';
    this.generateDraft();
  }

  generateDraft() {
    const startDate = document.getElementById('rep-start-date').value;
    const endDate = document.getElementById('rep-end-date').value;

    if (!startDate || !endDate) {
      alert("집계 시작일과 종료일을 올바르게 선택해 주세요.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert("시작일은 종료일보다 이전 날짜여야 합니다.");
      return;
    }

    const schedules = window.db.getSchedules();
    const logs = window.db.getLogs();

    const rangeSchedules = schedules
      .filter(s => s.date >= startDate && s.date <= endDate)
      .sort((a, b) => new Date(a.date + 'T' + a.startTime) - new Date(b.date + 'T' + b.startTime));

    const rangeLogs = logs.filter(l => l.date >= startDate && l.date <= endDate);

    const totalSessions = rangeSchedules.length;
    const totalHours = rangeLogs.reduce((sum, log) => sum + Number(log.hours), 0);

    document.getElementById('rep-meta-period').innerText = `활동 기간: ${startDate.replace(/-/g, '.')} ~ ${endDate.replace(/-/g, '.')}`;
    
    const dateObj = new Date(startDate);
    document.getElementById('rep-submission-month').innerText = `${dateObj.getFullYear()}년 ${String(dateObj.getMonth() + 1).padStart(2, '0')}월`;

    document.getElementById('rep-total-sessions').innerText = `${totalSessions}회`;
    document.getElementById('rep-total-hours').innerText = `${totalHours}시간`;

    const tbody = document.getElementById('rep-detail-tbody');
    tbody.innerHTML = '';

    if (totalSessions === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="empty-text">선택한 기간 동안 수행된 멘토링 일정이 없습니다.</td>
        </tr>
      `;
      document.getElementById('btn-download-pdf').disabled = true;
      document.getElementById('rep-summary-text').value = '';
      return;
    }

    document.getElementById('btn-download-pdf').disabled = false;

    rangeSchedules.forEach((sch, index) => {
      const matchingLog = rangeLogs.find(l => l.date === sch.date);
      const logContent = matchingLog ? matchingLog.content : "상세 학습 기록이 아직 작성되지 않았습니다.";
      
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${index + 1}회기</td>
        <td>${sch.date}<br>${sch.startTime} ~ ${sch.endTime}</td>
        <td>${sch.subject}</td>
        <td><strong>${sch.topic}</strong></td>
        <td style="text-align: left; line-height: 1.4;">${logContent}</td>
      `;
      tbody.appendChild(tr);
    });

    let autoSummary = "";
    if (rangeLogs.length > 0) {
      const subjects = [...new Set(rangeLogs.map(l => l.subject))].join(', ');
      const topics = rangeLogs.map(l => l.topic).join(', ');
      
      autoSummary = `해당 기간 동안 주로 [${subjects}] 과목에 대해 멘토링 활동을 집중적으로 진행하였습니다.\n`;
      autoSummary += `세부적으로는 [${topics}] 주제를 주로 다루었습니다. 멘티인 이영희 학생은 전반적으로 수업에 매우 성실하게 참여하였으며, 복습 과제 수행도가 준수합니다.\n`;
      autoSummary += `특히 개념 설명 후 진행한 실전 문제 풀이에서 이해도가 향상되는 양상을 보여주었습니다. 향후 멘토링 과정에서도 이와 같은 추세가 유지되도록 지도를 이어갈 예정입니다.`;
    } else {
      autoSummary = "해당 기간 동안 일정은 소화되었으나 등록된 세부 학습 기록지가 없어 공란으로 처리되었습니다. 필요시 멘토링 진행 요약을 직접 기재해 주세요.";
    }

    document.getElementById('rep-summary-text').value = autoSummary;

    const today = new Date();
    document.getElementById('rep-today-date').innerText = `${today.getFullYear()}년 ${String(today.getMonth() + 1).padStart(2, '0')}월 ${String(today.getDate()).padStart(2, '0')}일`;

    const currentUser = window.db.getCurrentUser();
    const signaturesRow = document.querySelector('.signatures-row');
    let mentorSig = "김민수 (인)";
    
    if (currentUser && currentUser.role === 'mentor') {
      mentorSig = `${currentUser.name} (인)`;
    }
    
    signaturesRow.innerHTML = `
      <div class="sig-col">멘토 서명: <span class="sig-name">${mentorSig}</span></div>
      <div class="sig-col">운영국 확인: <span class="sig-name">(서명)</span></div>
    `;
  }

  downloadPDF() {
    const element = document.getElementById('report-print-area');
    const textarea = document.getElementById('rep-summary-text');
    const startDate = document.getElementById('rep-start-date').value;
    const endDate = document.getElementById('rep-end-date').value;

    const textVal = textarea.value;
    const printDiv = document.createElement('div');
    printDiv.id = "temp-print-summary-div";
    printDiv.style.fontSize = "0.85rem";
    printDiv.style.lineHeight = "1.6";
    printDiv.style.whiteSpace = "pre-wrap";
    printDiv.style.color = "#111827";
    printDiv.innerText = textVal;
    
    textarea.parentNode.appendChild(printDiv);
    textarea.style.display = 'none';

    const opt = {
      margin:       15,
      filename:     `mentoring_activity_report_${startDate}_to_${endDate}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      textarea.style.display = 'block';
      const tempDiv = document.getElementById('temp-print-summary-div');
      if (tempDiv) tempDiv.remove();
    }).catch(err => {
      console.error("PDF generation failed: ", err);
      textarea.style.display = 'block';
      const tempDiv = document.getElementById('temp-print-summary-div');
      if (tempDiv) tempDiv.remove();
      alert("PDF 생성 중 오류가 발생하였습니다. 다시 시도해 주세요.");
    });
  }
}

window.reportComponent = new ReportComponent();

// --------------------------------------------------------------------------
// 7. APPLICATION COORDINATOR
// --------------------------------------------------------------------------
class MentoHubApp {
  constructor() {
    this.currentView = 'dashboard';
  }

  init() {
    this.setupTheme();
    this.setupNavigation();
    this.checkSession();
  }

  setupTheme() {
    const savedTheme = localStorage.getItem('mentohub_theme') || 'dark';
    document.documentElement.className = `theme-${savedTheme}`;
    this.updateThemeIcon(savedTheme);
  }

  toggleTheme() {
    const isDark = document.documentElement.classList.contains('theme-dark');
    const newTheme = isDark ? 'light' : 'dark';
    
    document.documentElement.className = `theme-${newTheme}`;
    localStorage.setItem('mentohub_theme', newTheme);
    this.updateThemeIcon(newTheme);
  }

  updateThemeIcon(theme) {
    const icon = document.getElementById('theme-icon');
    if (icon) {
      if (theme === 'dark') {
        icon.className = 'fa-solid fa-sun';
      } else {
        icon.className = 'fa-solid fa-moon';
      }
    }
  }

  setupNavigation() {
    const navItems = document.querySelectorAll('.nav-menu .nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const view = item.getAttribute('data-view');
        this.navigateTo(view);
      });
    });

    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '') || 'dashboard';
      const navItem = document.querySelector(`.nav-menu .nav-item[data-view="${hash}"]`);
      if (navItem) {
        this.navigateTo(hash, false);
      }
    });
  }

  checkSession() {
    const user = window.db.getCurrentUser();
    const loginOverlay = document.getElementById('login-overlay');
    const appContainer = document.getElementById('app-container');

    if (user) {
      loginOverlay.classList.remove('active');
      appContainer.style.display = 'grid';
      
      this.updateSidebarUser(user);
      document.getElementById('quick-role-select').value = user.role;

      const hash = window.location.hash.replace('#', '') || 'dashboard';
      this.navigateTo(hash);
    } else {
      loginOverlay.classList.add('active');
      appContainer.style.display = 'none';
      window.location.hash = '';
    }
  }

  login(role) {
    const user = window.db.setCurrentUser(role);
    if (user) {
      this.checkSession();
    }
  }

  logout() {
    window.db.logout();
    this.checkSession();
  }

  switchRole(role) {
    const user = window.db.setCurrentUser(role);
    if (user) {
      this.updateSidebarUser(user);
      this.renderCurrentView();
      
      if (typeof window.dashboardComponent !== 'undefined') {
        window.dashboardComponent.render();
      }

      this.showToast(`${user.name}(${role === 'mentor' ? '멘토' : (role === 'mentee' ? '멘티' : '운영자')}) 역할로 전환되었습니다.`);
    }
  }

  updateSidebarUser(user) {
    const avatar = document.getElementById('sidebar-user-avatar');
    const name = document.getElementById('sidebar-user-name');
    const role = document.getElementById('sidebar-user-role');

    if (avatar) avatar.innerText = user.name.charAt(0);
    if (name) name.innerText = user.name;
    
    if (role) {
      const roleLabel = user.role === 'mentor' ? '멘토' : (user.role === 'mentee' ? '멘티' : '운영 관리자');
      role.innerText = roleLabel;
      
      role.style.backgroundColor = user.role === 'mentor' ? 'rgba(99, 102, 241, 0.2)' : (user.role === 'mentee' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)');
      role.style.color = user.role === 'mentor' ? 'var(--color-info)' : (user.role === 'mentee' ? 'var(--color-success)' : 'var(--color-warning)');
    }
  }

  navigateTo(view, updateHash = true) {
    const navItems = document.querySelectorAll('.nav-menu .nav-item');
    navItems.forEach(item => {
      if (item.getAttribute('data-view') === view) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    const panels = document.querySelectorAll('.view-panel');
    panels.forEach(panel => {
      if (panel.id === `view-${view}`) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    this.updateHeaderTitles(view);

    if (updateHash) {
      window.location.hash = view;
    }

    this.currentView = view;
    this.renderCurrentView();
  }

  updateHeaderTitles(view) {
    const title = document.getElementById('view-title');
    const subtitle = document.getElementById('view-subtitle');

    const headers = {
      dashboard: { t: "대시보드", s: "멘토링 진행 통계 및 다음 세션을 한눈에 파악합니다." },
      calendar: { t: "일정 관리", s: "멘토링 약속 일정을 등록하고 캘린더에서 조회합니다." },
      logs: { t: "학습 기록", s: "멘토링 과목별 학습 진행과 상세 내용을 기록하고 관리합니다." },
      feed: { t: "소통 피드", s: "멘토와 멘티가 실시간으로 질문을 남기고 자유롭게 소통하는 공간입니다." },
      report: { t: "활동 보고서", s: "지정 기간 동안의 일정을 기반으로 보고서를 자동 생성하고 PDF로 다운로드합니다." }
    };

    if (headers[view]) {
      title.innerText = headers[view].t;
      subtitle.innerText = headers[view].s;
    }
  }

  renderCurrentView() {
    switch (this.currentView) {
      case 'dashboard':
        if (window.dashboardComponent) window.dashboardComponent.init();
        break;
      case 'calendar':
        if (window.calendarComponent) window.calendarComponent.init();
        break;
      case 'logs':
        if (window.logsComponent) window.logsComponent.init();
        break;
      case 'feed':
        if (window.feedComponent) window.feedComponent.init();
        break;
      case 'report':
        if (window.reportComponent) window.reportComponent.init();
        break;
    }
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'glass-card toast-msg';
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.padding = '12px 20px';
    toast.style.zIndex = '1000';
    toast.style.backgroundColor = 'var(--bg-secondary)';
    toast.style.border = '1px solid var(--border-color-glow)';
    toast.style.boxShadow = 'var(--box-shadow-md)';
    toast.style.borderRadius = 'var(--border-radius-sm)';
    toast.style.fontSize = '0.9rem';
    toast.style.fontWeight = '600';
    toast.style.color = 'var(--text-primary)';
    toast.style.animation = 'slideUp 0.3s ease';
    toast.innerText = message;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.5s ease';
      setTimeout(() => toast.remove(), 500);
    }, 2500);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.app = new MentoHubApp();
  window.app.init();
});
