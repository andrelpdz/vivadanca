async function iniciarTrajetoria() {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;
  const timelineStatus = document.querySelector('#timeline-status');
  const timelineRetry = document.querySelector('#timeline-retry');
  timelineStatus.hidden = false;
  timelineStatus.textContent = 'Carregando nossa trajetória…';
  timelineRetry.hidden = true;
  timelineRetry.onclick = iniciarTrajetoria;
  timeline.setAttribute('aria-busy', 'true');

  const timelineViewport = timeline.querySelector('.timeline-viewport');
  const timelineYears = timeline.querySelector('.timeline-years');
  const timelinePrevious = document.querySelector('#timeline-prev');
  const timelineNext = document.querySelector('#timeline-next');
  const timelinePosition = document.querySelector('#timeline-position');
  const timelineReading = timeline.querySelector('.timeline-reading');
  const timelineReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let timelineSlides = [];
  let timelineLinks = [];
  let timelineActive = 0;
  let timelineFrame = 0;
  let timelineDrag = null;
  let timelineTarget = null;

  // 1. Busca os dados diretamente da sua API PHP
  try {
    const response = await fetch('../backend/api_linha_tempo.php', { cache: 'no-store', headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error('Falha ao consultar a trajetória');
    const resultado = await response.json();
    
    if (!resultado.sucesso || !Array.isArray(resultado.linha_tempo)) throw new Error('Resposta inválida');

    const dados = resultado.linha_tempo;
    if (!dados.length) {
      timelineStatus.textContent = 'Ainda não há registros disponíveis nesta linha do tempo.';
      timeline.setAttribute('aria-busy', 'false');
      return;
    }

    // 2. Monta os anos na navegação de topo e os slides no carrossel dinamicamente
    const track = timeline.querySelector('.timeline-track');
    track.innerHTML = '';
    timelineYears.innerHTML = '';

    dados.forEach((item, index) => {
      // Cria o link do ano
      const yearLink = document.createElement('a');
      yearLink.href = `#momento-${index}`;
      yearLink.setAttribute('data-moment', index);
      yearLink.textContent = item.data;
      if (index === 0) yearLink.setAttribute('aria-current', 'step');
      timelineYears.appendChild(yearLink);

      // Cria o slide do card
      const slide = document.createElement('li');
      slide.className = `timeline-slide ${index === 0 ? 'is-active' : ''}`;
      slide.id = `momento-${index}`;
      slide.setAttribute('aria-label', `${index + 1} de ${dados.length} — ${item.data}`);

      slide.innerHTML = `
        <article>
          <figure>
            <img src="../assets/linha_tempo/${item.foto}" alt="Registro de ${item.data}" draggable="false" ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}>
          </figure>
          <div class="timeline-story">
            <p class="eyebrow">${item.data} · Nossa trajetória</p>
            <h2>Registro histórico</h2>
            <p>${item.descricao}</p>
          </div>
        </article>
      `;
      track.appendChild(slide);
    });

    timelineSlides = [...timeline.querySelectorAll('.timeline-slide')];
    timelineLinks = [...timelineYears.querySelectorAll('[data-moment]')];

  } catch (error) {
    timelineStatus.textContent = 'Não foi possível carregar a trajetória. Verifique sua conexão e tente novamente.';
    timelineRetry.hidden = false;
    timeline.setAttribute('aria-busy', 'false');
    return;
  }

  function updateTimeline(index) {
    timelineActive = index;
    timelineSlides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
    timelineLinks.forEach((link, i) => {
      if (i === index) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    });
    timelinePrevious.disabled = index === 0;
    timelineNext.disabled = index === timelineSlides.length - 1;
    timelinePosition.textContent = `${index + 1} / ${timelineSlides.length}`;
    timelineReading.replaceChildren(timelineSlides[index].querySelector('.timeline-story').cloneNode(true));
    
    const selected = timelineLinks[index];
    if (selected) {
      const yearBounds = selected.getBoundingClientRect();
      const stripBounds = timelineYears.getBoundingClientRect();
      if (yearBounds.left < stripBounds.left || yearBounds.right > stripBounds.right) {
        timelineYears.scrollTo({ left: timelineYears.scrollLeft + yearBounds.left - stripBounds.left - (stripBounds.width - yearBounds.width) / 2, behavior: timelineReducedMotion.matches ? 'auto' : 'smooth' });
      }
    }
  }

  function paintAlbum() {
    const bounds = timelineViewport.getBoundingClientRect();
    const center = bounds.left + bounds.width / 2;
    const step = timelineSlides[0] ? timelineSlides[0].getBoundingClientRect().width : 1;
    let nearest = 0;
    let nearestDistance = Infinity;

    timelineSlides.forEach((slide, index) => {
      const rect = slide.getBoundingClientRect();
      const distance = (rect.left + rect.width / 2 - center) / step;
      const strength = Math.min(Math.abs(distance), 1);
      slide.style.setProperty('--album-angle', `${-Math.max(-1, Math.min(1, distance)) * 55}deg`);
      slide.style.setProperty('--album-scale', String(1 - strength * 0.23));
      slide.style.setProperty('--album-opacity', String(1 - Math.min(Math.abs(distance), 2) * 0.23));
      slide.style.zIndex = String(Math.max(0, 100 - Math.round(Math.abs(distance) * 20)));
      if (Math.abs(distance) < nearestDistance) { nearest = index; nearestDistance = Math.abs(distance); }
    });

    if (timelineTarget === nearest && nearestDistance < 0.04) timelineTarget = null;
    if (timelineTarget === null && nearest !== timelineActive) updateTimeline(nearest);
    return nearest;
  }

  function goToTimeline(index, smooth = true) {
    index = Math.max(0, Math.min(index, timelineSlides.length - 1));
    const slideBounds = timelineSlides[index].getBoundingClientRect();
    const viewportBounds = timelineViewport.getBoundingClientRect();
    const left = timelineViewport.scrollLeft + slideBounds.left + slideBounds.width / 2 - viewportBounds.left - viewportBounds.width / 2;
    timelineTarget = index;
    timelineViewport.scrollTo({ left, behavior: smooth && !timelineReducedMotion.matches ? 'smooth' : 'instant' });
    updateTimeline(index);
    requestAnimationFrame(paintAlbum);
  }

  timelineStatus.hidden = true;
  timeline.setAttribute('aria-busy', 'false');
  timeline.classList.add('timeline-ready');
  timeline.querySelector('.timeline-controls').hidden = false;

  timelineLinks.forEach((link, index) => link.addEventListener('click', (event) => {
    event.preventDefault();
    goToTimeline(index);
    history.replaceState(null, '', `#momento-${index}`);
  }));

  timelinePrevious.addEventListener('click', () => goToTimeline(timelineActive - 1));
  timelineNext.addEventListener('click', () => goToTimeline(timelineActive + 1));

  timelineViewport.addEventListener('keydown', (event) => {
    const targetIndex = { ArrowLeft: timelineActive - 1, ArrowRight: timelineActive + 1, Home: 0, End: timelineSlides.length - 1 }[event.key];
    if (targetIndex !== undefined) { event.preventDefault(); goToTimeline(targetIndex); }
  });

  timelineViewport.addEventListener('scroll', () => {
    if (timelineFrame) cancelAnimationFrame(timelineFrame);
    timelineFrame = requestAnimationFrame(() => {
      timelineFrame = 0;
      paintAlbum();
    });
  }, { passive: true });

  timelineViewport.addEventListener('scrollend', () => { timelineTarget = null; paintAlbum(); });
  timelineViewport.addEventListener('wheel', () => { timelineTarget = null; }, { passive: true });

  timelineViewport.addEventListener('pointerdown', (event) => {
    timelineTarget = null;
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    timelineDrag = { x: event.clientX, left: timelineViewport.scrollLeft, pointerId: event.pointerId };
    timelineViewport.classList.add('is-dragging');
    timelineViewport.setPointerCapture(event.pointerId);
  });

  timelineViewport.addEventListener('pointermove', (event) => {
    if (!timelineDrag) return;
    timelineViewport.scrollLeft = timelineDrag.left - (event.clientX - timelineDrag.x);
  });

  function finishTimelineDrag() {
    if (!timelineDrag) return;
    const pointerId = timelineDrag.pointerId;
    const nearest = paintAlbum();
    timelineDrag = null;
    timelineViewport.classList.remove('is-dragging');
    if (timelineViewport.hasPointerCapture(pointerId)) timelineViewport.releasePointerCapture(pointerId);
    goToTimeline(nearest);
  }

  timelineViewport.addEventListener('pointerup', finishTimelineDrag);
  timelineViewport.addEventListener('pointercancel', finishTimelineDrag);
  timelineViewport.addEventListener('lostpointercapture', finishTimelineDrag);
  window.addEventListener('resize', () => goToTimeline(timelineActive, false));

  const initialMoment = location.hash.match(/^#momento-(\d+)$/);
  requestAnimationFrame(() => goToTimeline(initialMoment ? Number(initialMoment[1]) : 0, false));
}
document.addEventListener("DOMContentLoaded", iniciarTrajetoria);
