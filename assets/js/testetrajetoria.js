const timeline = document.querySelector('.timeline');
const timelineViewport = timeline.querySelector('.timeline-viewport');
const timelineSlides = [...timeline.querySelectorAll('.timeline-slide')];
const timelineYears = timeline.querySelector('.timeline-years');
const timelineLinks = [...timelineYears.querySelectorAll('[data-moment]')];
const timelinePrevious = document.querySelector('#timeline-prev');
const timelineNext = document.querySelector('#timeline-next');
const timelinePosition = document.querySelector('#timeline-position');
const timelineReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let timelineActive = 0;
let timelineFrame = 0;
let timelineDrag = null;

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
  const selected = timelineLinks[index];
  const yearBounds = selected.getBoundingClientRect();
  const stripBounds = timelineYears.getBoundingClientRect();
  if (yearBounds.left < stripBounds.left || yearBounds.right > stripBounds.right) {
    timelineYears.scrollTo({ left: timelineYears.scrollLeft + yearBounds.left - stripBounds.left - (stripBounds.width - yearBounds.width) / 2, behavior: timelineReducedMotion.matches ? 'auto' : 'smooth' });
  }
}

function closestTimelineSlide() {
  const bounds = timelineViewport.getBoundingClientRect();
  const center = bounds.left + bounds.width / 2;
  let nearest = 0;
  let distance = Infinity;
  timelineSlides.forEach((slide, index) => {
    const rect = slide.getBoundingClientRect();
    const nextDistance = Math.abs(rect.left + rect.width / 2 - center);
    if (nextDistance < distance) { nearest = index; distance = nextDistance; }
  });
  return nearest;
}

function goToTimeline(index, smooth = true) {
  index = Math.max(0, Math.min(index, timelineSlides.length - 1));
  const slideBounds = timelineSlides[index].getBoundingClientRect();
  const viewportBounds = timelineViewport.getBoundingClientRect();
  const left = timelineViewport.scrollLeft + slideBounds.left + slideBounds.width / 2 - viewportBounds.left - viewportBounds.width / 2;
  timelineViewport.scrollTo({ left, behavior: smooth && !timelineReducedMotion.matches ? 'smooth' : 'instant' });
  updateTimeline(index);
}

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
    const nearest = closestTimelineSlide();
    if (nearest !== timelineActive) updateTimeline(nearest);
  });
}, { passive: true });
timelineViewport.addEventListener('pointerdown', (event) => {
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
  const nearest = closestTimelineSlide();
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
