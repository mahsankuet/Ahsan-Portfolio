const $ = (id) => document.getElementById(id);

function setText(id, value) {
  const el = $(id);
  if (el && value != null) el.textContent = value;
}

function make(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text != null) el.textContent = text;
  return el;
}

async function loadSite() {
  try {
    const response = await fetch('content/site.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Could not load site content.');
    const data = await response.json();

    setText('brand-name', data.site_name);
    setText('hero-eyebrow', data.hero?.eyebrow);
    setText('hero-title', data.hero?.title);
    setText('hero-intro', data.hero?.intro);

    const stats = $('stats');
    stats.innerHTML = '';
    (data.stats || []).forEach(item => {
      const box = make('div');
      box.append(make('strong', '', item.value), make('span', '', item.label));
      stats.append(box);
    });

    const projects = data.projects || [];
    const collage = $('hero-collage');
    collage.innerHTML = '';
    projects.slice(0, 4).forEach((project, index) => {
      const a = make('a', 'hero-shot shot-' + ['a','b','c','d'][index]);
      a.href = project.url || '#work';
      a.target = '_blank';
      a.rel = 'noopener';
      const img = make('img');
      img.src = project.image;
      img.alt = project.title || 'Portfolio project';
      img.decoding = 'async';
      a.append(img);
      collage.append(a);
    });

    setText('work-eyebrow', data.work?.eyebrow);
    setText('work-title', data.work?.title);
    setText('work-intro', data.work?.intro);

    const portfolio = $('portfolio-grid');
    portfolio.innerHTML = '';
    projects.forEach(project => {
      const card = make('a', 'portfolio-card' + (project.featured ? ' featured' : ''));
      card.href = project.url || '#';
      card.target = '_blank';
      card.rel = 'noopener';

      const imageWrap = make('div', 'portfolio-image');
      const img = make('img');
      img.src = project.image;
      img.alt = project.title || 'Portfolio project';
      img.loading = 'lazy';
      img.decoding = 'async';
      imageWrap.append(img);

      const meta = make('div', 'portfolio-meta');
      meta.append(
        make('span', '', project.category || 'Portfolio'),
        make('h3', '', project.title || 'Project'),
        make('b', '', 'View project ↗')
      );

      card.append(imageWrap, meta);
      portfolio.append(card);
    });

    setText('services-eyebrow', data.services_section?.eyebrow);
    setText('services-title', data.services_section?.title);

    const services = $('services-grid');
    services.innerHTML = '';
    (data.services || []).forEach(service => {
      const item = make('div');
      item.append(
        make('b', '', service.number || ''),
        make('h3', '', service.title || ''),
        make('p', '', service.description || '')
      );
      services.append(item);
    });

    setText('about-eyebrow', data.about?.eyebrow);
    setText('about-title', data.about?.title);

    const about = $('about-paragraphs');
    about.innerHTML = '';
    (data.about?.paragraphs || []).forEach(text => about.append(make('p', '', text)));

    const skills = $('skills');
    skills.innerHTML = '';
    (data.about?.skills || []).forEach(skill => skills.append(make('span', '', skill)));

    setText('contact-eyebrow', data.contact?.eyebrow);
    setText('contact-title', data.contact?.title);
    setText('contact-text', data.contact?.text);

    const email = data.contact?.email || '';
    const behance = data.links?.behance || '#';
    const upwork = data.links?.upwork || '#';

    $('email-link').href = 'mailto:' + email;
    $('hire-link').href = upwork;
    $('behance-link').href = behance;
    $('upwork-link').href = upwork;
    $('footer-behance').href = behance;
    $('footer-upwork').href = upwork;
    $('footer-email').href = 'mailto:' + email;
    setText('footer-copy', data.footer || '');
  } catch (error) {
    console.error(error);
  }
}

loadSite();