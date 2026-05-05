const state = {
  screen: 'interests',
  selectedInterest: null,
  selectedProgram: null,
  data: null
};

const ui = {
  title: document.getElementById('screenTitle'),
  hint: document.getElementById('screenHint'),
  backBtn: document.getElementById('backBtn'),
  homeBtn: document.getElementById('homeBtn'),
  listView: document.getElementById('listView'),
  detailsView: document.getElementById('detailsView'),
  stageInterests: document.getElementById('stageInterests'),
  stagePrograms: document.getElementById('stagePrograms'),
  stageDetails: document.getElementById('stageDetails'),
  programName: document.getElementById('programName'),
  learnList: document.getElementById('learnList'),
  jobsList: document.getElementById('jobsList'),
  workplacesList: document.getElementById('workplacesList')
};

function setStage(screen) {
  const mapping = {
    interests: ui.stageInterests,
    programs: ui.stagePrograms,
    details: ui.stageDetails
  };

  [ui.stageInterests, ui.stagePrograms, ui.stageDetails].forEach((el) => {
    el.classList.remove('is-active');
  });

  mapping[screen].classList.add('is-active');
}

function asArray(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }
  if (typeof value === 'string' && value.trim()) {
    return [value.trim()];
  }
  return [];
}

function createTile(text, onClick) {
  const btn = document.createElement('button');
  btn.className = 'tile';
  btn.type = 'button';
  btn.textContent = text;
  btn.addEventListener('click', onClick);
  return btn;
}

function clearList() {
  ui.listView.innerHTML = '';
}

function renderInterests() {
  state.screen = 'interests';
  state.selectedInterest = null;
  state.selectedProgram = null;

  ui.title.textContent = 'الاهتمامات';
  ui.hint.textContent = 'اختر اهتمامك للبدء.';
  ui.backBtn.hidden = true;
  ui.detailsView.hidden = true;
  ui.listView.hidden = false;
  setStage('interests');

  clearList();

  const interests = Object.keys(state.data || {}).sort((a, b) => a.localeCompare(b, 'ar'));
  interests.forEach((interest) => {
    const tile = createTile(interest, () => renderPrograms(interest));
    ui.listView.appendChild(tile);
  });
}

function renderPrograms(interest) {
  state.screen = 'programs';
  state.selectedInterest = interest;
  state.selectedProgram = null;

  ui.title.textContent = 'برامج: ' + interest;
  ui.hint.textContent = 'اضغط على البرنامج لمشاهدة التفاصيل.';
  ui.backBtn.hidden = false;
  ui.detailsView.hidden = true;
  ui.listView.hidden = false;
  setStage('programs');

  clearList();

  const programs = state.data[interest] || [];
  programs.forEach((program) => {
    const name = program['اسم البرنامج'] || 'برنامج بدون اسم';
    const tile = createTile(name, () => renderDetails(program));
    ui.listView.appendChild(tile);
  });
}

function fillList(el, items) {
  el.innerHTML = '';
  const normalized = asArray(items);

  if (normalized.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'لا توجد بيانات';
    el.appendChild(li);
    return;
  }

  normalized.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    el.appendChild(li);
  });
}

function renderDetails(program) {
  state.screen = 'details';
  state.selectedProgram = program;

  ui.title.textContent = 'تفاصيل البرنامج';
  ui.hint.textContent = 'يمكنك الرجوع لاختيار برنامج آخر أو العودة للرئيسية.';
  ui.backBtn.hidden = false;
  ui.listView.hidden = true;
  ui.detailsView.hidden = false;
  setStage('details');

  ui.programName.textContent = program['اسم البرنامج'] || 'برنامج بدون اسم';
  fillList(ui.learnList, program['ماذا ستتعلم']);
  fillList(ui.jobsList, program['الفرص الوظيفية']);
  fillList(ui.workplacesList, program['اماكن العمل المستقبلية']);
}

function handleBack() {
  if (state.screen === 'details' && state.selectedInterest) {
    renderPrograms(state.selectedInterest);
    return;
  }
  renderInterests();
}

async function init() {
  try {
    if (window.PROGRAMS_DATA && window.PROGRAMS_DATA['الاهتمامات']) {
      state.data = window.PROGRAMS_DATA['الاهتمامات'] || {};
      renderInterests();
      return;
    }

    const response = await fetch('programs_by_interest.json');
    if (!response.ok) {
      throw new Error('Failed to load JSON: ' + response.status);
    }

    const json = await response.json();
    state.data = json['الاهتمامات'] || {};
    renderInterests();
  } catch (error) {
    ui.title.textContent = 'تعذر تحميل البيانات';
    ui.hint.textContent = 'تأكد من وجود ملف البيانات بجانب الشاشة.';
    ui.backBtn.hidden = true;
    ui.detailsView.hidden = true;
    ui.listView.hidden = false;
    setStage('interests');
    clearList();

    const box = document.createElement('div');
    box.className = 'details-card';
    box.textContent = 'تعذر قراءة ملف البيانات. تأكد أن ملف programs_by_interest.json موجود بجانب الصفحة، ويفضل تشغيلها عبر Live Server داخل VS Code.';
    ui.listView.appendChild(box);
  }
}

ui.backBtn.addEventListener('click', handleBack);
ui.homeBtn.addEventListener('click', renderInterests);
init();
