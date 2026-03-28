
// Example: smooth scroll for anchor links (already handled by CSS scroll-behavior)
// You can add things like: lightbox for gallery images, scroll animations, etc.

const defaultProjectTags = ["Unity", "Unreal", "C#", "C++"];

function getTagsFromDataset(tagString) {
  const tags = tagString
    ? tagString.split(',').map((tag) => tag.trim()).filter(Boolean)
    : defaultProjectTags;

  return tags;
}

function renderProjectTags(container, tags) {
  if (!container) {
    return;
  }

  container.replaceChildren();
  container.classList.add('project-tags');

  tags.forEach((tag) => {
    const tagEl = document.createElement('span');
    tagEl.className = 'project-tag';
    tagEl.textContent = tag;
    container.appendChild(tagEl);
  });
}

function setupProjectTags() {
  const cards = document.querySelectorAll('.project-card');
  if (!cards.length) {
    return;
  }

  cards.forEach((card) => {
    const tags = getTagsFromDataset(card.dataset.tags);

    if (!tags.length) {
      return;
    }

    let tagsContainer = card.querySelector('.project-tags');
    if (!tagsContainer) {
      tagsContainer = document.createElement('div');
      tagsContainer.className = 'project-tags';
    }

    renderProjectTags(tagsContainer, tags);

    const textContainer = card.querySelector('.project-card-text-container');
    if (textContainer && tagsContainer.parentElement !== textContainer) {
      textContainer.appendChild(tagsContainer);
    }
  });
}

function setupProjectPageTags() {
  const projectHeader = document.querySelector('#project-header[data-tags]');
  if (!projectHeader) {
    return;
  }

  const tags = getTagsFromDataset(projectHeader.dataset.tags);
  if (!tags.length) {
    return;
  }

  const tagsContainer = projectHeader.querySelector('.project-tags');
  renderProjectTags(tagsContainer, tags);
}

function setupSectionNavigation() {
  const navLinks = Array.from(document.querySelectorAll('.nav-index a[href^="#"]'));
  if (!navLinks.length) {
    return;
  }

  const sectionPairs = [];

  navLinks.forEach((link) => {
    const targetId = link.getAttribute('href')?.slice(1);
    if (!targetId) {
      return;
    }

    const section = document.getElementById(targetId);
    if (section) {
      sectionPairs.push({ link, section });
    }
  });

  if (!sectionPairs.length) {
    return;
  }

  const setActiveLink = (activeLink) => {
    navLinks.forEach((link) => {
      link.classList.toggle('active', link === activeLink);
    });
  };

  const updateActiveLinkFromScrollPosition = () => {
    const probeLine = window.scrollY + window.innerHeight * 0.35;
    const scrollBottom = window.scrollY + window.innerHeight;
    const documentBottom = document.documentElement.scrollHeight;

    if (documentBottom - scrollBottom <= 64) {
      const lastLink = sectionPairs[sectionPairs.length - 1]?.link;
      if (lastLink) {
        setActiveLink(lastLink);
      }
      return;
    }

    let activeLink = sectionPairs[0].link;

    sectionPairs.forEach(({ section, link }) => {
      if (section.offsetTop <= probeLine) {
        activeLink = link;
      }
    });

    if (activeLink) {
      setActiveLink(activeLink);
    }
  };

  const initialLink = navLinks.find((link) => {
    const targetId = link.getAttribute('href')?.slice(1);
    return targetId && window.location.hash === `#${targetId}`;
  }) || navLinks[0];

  setActiveLink(initialLink);
  updateActiveLinkFromScrollPosition();

  window.addEventListener('scroll', updateActiveLinkFromScrollPosition, { passive: true });
  window.addEventListener('resize', updateActiveLinkFromScrollPosition);
}

function setupNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const navbar = document.querySelector('.navbar');
  if (!toggle || !navbar) {
    return;
  }

  const mobileQuery = window.matchMedia('(max-width: 900px)');

  const syncToggleState = () => {
    if (!mobileQuery.matches) {
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      return;
    }

    const isOpen = document.body.classList.contains('nav-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  };

  toggle.addEventListener('click', () => {
    if (!mobileQuery.matches) {
      return;
    }

    document.body.classList.toggle('nav-open');
    syncToggleState();
  });

  navbar.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (!mobileQuery.matches) {
        return;
      }

      document.body.classList.remove('nav-open');
      syncToggleState();
    });
  });

  mobileQuery.addEventListener('change', syncToggleState);
  window.addEventListener('resize', syncToggleState);
  syncToggleState();
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('Portfolio loaded!');
  setupProjectTags();
  setupProjectPageTags();
  setupSectionNavigation();
  setupNavToggle();
});
