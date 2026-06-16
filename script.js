const projectList = document.getElementById('projectList');
const projectInfo = document.getElementById('projectInfo');
const projectView = document.getElementById('projectView');
const contactLinks = document.getElementById('contactLinks');
let activeProject = 0;
let activeImage = 0;

function init() {
  document.querySelectorAll('.artist-name').forEach(el => el.textContent = siteSettings.artistName || 'Sissy An. Tsal.');
  renderContact();
  renderProjectList();
  const hash = window.location.hash.replace('#', '');
  const found = projects.findIndex(p => p.id === hash);
  openProject(found >= 0 ? found : 0);
}

function renderContact() {
  contactLinks.innerHTML = '';
  if (siteSettings.instagram) {
    const a = document.createElement('a');
    a.href = siteSettings.instagram;
    a.textContent = 'Instagram';
    a.target = '_blank';
    a.rel = 'noopener';
    contactLinks.appendChild(a);
  }
  if (siteSettings.email) {
    const a = document.createElement('a');
    a.href = `mailto:${siteSettings.email}`;
    a.textContent = 'Email';
    contactLinks.appendChild(a);
  }
}

function renderProjectList() {
  projectList.innerHTML = '';
  projects.forEach((project, index) => {
    const btn = document.createElement('button');
    btn.className = 'project-button';
    btn.type = 'button';
    btn.onclick = () => openProject(index);
    btn.innerHTML = `
      <img class="project-thumb" src="${project.thumbnail}" alt="">
      <span class="project-title-small">${escapeHtml(project.title)}</span>
      <span class="project-year-small">${escapeHtml(project.year || '')}</span>
    `;
    projectList.appendChild(btn);
  });
}

function openProject(index) {
  activeProject = index;
  activeImage = 0;
  const project = projects[index];
  window.location.hash = project.id;
  document.querySelectorAll('.project-button').forEach((button, i) => button.classList.toggle('is-active', i === index));
  renderProjectInfo(project);
  if (project.layout === 'word') renderWordLayout(project);
  else renderCarousel(project);
}

function renderProjectInfo(project) {
  projectInfo.innerHTML = `
    <h1 class="title">${escapeHtml(project.title)}</h1>
    <div class="details">${escapeHtml(project.details || '')}</div>
    ${project.text && project.layout !== 'word' ? `<div class="text">${escapeHtml(project.text)}</div>` : ''}
  `;
}

function renderCarousel(project) {
  const total = project.images.length;
  const src = project.images[activeImage];
  projectView.innerHTML = `
    <div class="carousel project-${project.id}">
      <div class="carousel-image-wrap">
        <img class="carousel-image" src="${src}" alt="${escapeHtml(project.title)}">
      </div>
      <div class="carousel-controls">
        <button type="button" id="prevImage">←</button>
        <span>${activeImage + 1} / ${total}</span>
        <button type="button" id="nextImage">→</button>
      </div>
    </div>
  `;
  document.getElementById('prevImage').onclick = () => {
    activeImage = (activeImage - 1 + total) % total;
    renderCarousel(project);
  };
  document.getElementById('nextImage').onclick = () => {
    activeImage = (activeImage + 1) % total;
    renderCarousel(project);
  };
}
document.onkeydown = (event) => {
  if (event.key === 'ArrowLeft') {
    activeImage = (activeImage - 1 + total) % total;
    renderCarousel(project);
  }

  if (event.key === 'ArrowRight') {
    activeImage = (activeImage + 1) % total;
    renderCarousel(project);
  }
};
function renderWordLayout(project) {
  projectView.innerHTML = `
    <div class="word-layout">
      <img class="word-hero" src="${project.images[0]}" alt="">
      <img class="word-wide" src="${project.images[1]}" alt="">
      <div class="word-row">
        <img src="${project.images[2]}" alt="">
        <img src="${project.images[3]}" alt="">
      </div>
      <div class="word-text-centered">${escapeHtml(project.text.split('\n\n2020 INSPIRE PROJECT')[0])}</div>
      <img class="word-small-centered" src="${project.images[4]}" alt="">
      <div class="word-video-grid">
        <img src="${project.images[5]}" alt="">
        <img src="${project.images[6]}" alt="">
        <img src="${project.images[7]}" alt="">
        <img src="${project.images[8]}" alt="">
      </div>
      <div class="word-caption">2020 INSPIRE PROJECT :&lt;&lt; ΑΡΧΕΙΑ ΟΝΕΙΡΟΥ &gt;&gt; ΜΟΜus\nΠειραματικό Κέντρο Τεχνών Θεσσαλονίκης.</div>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

init();

document.addEventListener('keydown', function(event) {
  const activeProject = document.querySelector('.project-item.active');
  if (!activeProject) return;

  if (event.key === 'ArrowRight') {
    const nextButton = document.getElementById('nextImage');
    if (nextButton) nextButton.click();
  }

  if (event.key === 'ArrowLeft') {
    const prevButton = document.getElementById('prevImage');
    if (prevButton) prevButton.click();
  }
});
