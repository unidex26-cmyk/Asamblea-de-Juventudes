/* II Asamblea de Juventudes · interacciones (vanilla, sin dependencias) */
(function () {
  'use strict';

  const CONFIG = window.ASAMBLEA_CONFIG || { formularioUrl: '', whatsappGrupo: '', instagram: '' };
  const d = document, w = window;
  const rm = w.matchMedia('(prefers-reduced-motion: reduce)');
  d.documentElement.classList.add('js');

  /* ---------- cabecera: progreso + estado + sección activa + parallax ---------- */
  const cab = d.querySelector('[data-cab]');
  const barra = d.createElement('div');
  barra.className = 'progreso';
  barra.setAttribute('aria-hidden', 'true');
  d.body.appendChild(barra);
  const navEnlaces = [].slice.call(d.querySelectorAll('.cab__nav a[href^="#"]'));
  const secciones = navEnlaces.map(function (a) { return d.getElementById(a.getAttribute('href').slice(1)); }).filter(Boolean);
  const hero = d.querySelector('.hero');
  const fotos = d.querySelector('[data-carrusel]');
  let pendiente = false;
  const pinta = function () {
    pendiente = false;
    const max = d.documentElement.scrollHeight - w.innerHeight;
    barra.style.setProperty('--p', max > 0 ? String(Math.min(1, w.scrollY / max)) : '0');
    if (cab) cab.classList.toggle('cab--bajo', w.scrollY > 8);
    const limite = w.scrollY + (cab ? cab.offsetHeight : 72) + 60;
    let actual = secciones.length ? secciones[0].id : null;
    secciones.forEach(function (s) { if (s.getBoundingClientRect().top + w.scrollY <= limite) actual = s.id; });
    navEnlaces.forEach(function (a) {
      if (a.getAttribute('href') === '#' + actual) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
    if (fotos && hero && !rm.matches) {
      const y = Math.min(w.scrollY, hero.offsetHeight);
      fotos.style.transform = 'translate3d(0,' + (y * 0.16).toFixed(1) + 'px,0)';
    }
  };
  w.addEventListener('scroll', function () { if (!pendiente) { pendiente = true; requestAnimationFrame(pinta); } }, { passive: true });
  w.addEventListener('resize', function () { if (!pendiente) { pendiente = true; requestAnimationFrame(pinta); } }, { passive: true });
  pinta();

  /* ---------- menú móvil ---------- */
  const btnMenu = d.querySelector('[data-menu-btn]');
  const navMenu = d.querySelector('[data-menu]');
  if (cab && btnMenu && navMenu) {
    const setMenu = function (abierto) {
      btnMenu.setAttribute('aria-expanded', String(abierto));
      btnMenu.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
      cab.classList.toggle('cab--abierto', abierto);
    };
    btnMenu.addEventListener('click', function () { setMenu(btnMenu.getAttribute('aria-expanded') !== 'true'); });
    navMenu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btnMenu.getAttribute('aria-expanded') === 'true') { setMenu(false); btnMenu.focus(); }
    });
  }

  /* ---------- reveals ---------- */
  const items = [].slice.call(d.querySelectorAll('[data-reveal]'));
  items.forEach(function (el) { el.style.setProperty('--rd', el.dataset.revealDelay || '0'); });
  if (rm.matches || !('IntersectionObserver' in w)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    items.forEach(function (el) {
      const r = el.getBoundingClientRect();
      if (r.top < w.innerHeight && r.bottom > 0) el.classList.add('is-in', 'is-quieto');
    });
    const io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    items.forEach(function (el) { if (!el.classList.contains('is-in')) io.observe(el); });
  }

  /* ---------- cuenta regresiva (todas las instancias) ---------- */
  [].slice.call(d.querySelectorAll('[data-cuenta]')).forEach(function (caja) {
    const inicio = new Date(caja.dataset.inicio).getTime();
    const fin = new Date(caja.dataset.fin).getTime();
    if (!isFinite(inicio) || !isFinite(fin)) return;
    const celdas = { d: caja.querySelector('[data-c-d]'), h: caja.querySelector('[data-c-h]'), m: caja.querySelector('[data-c-m]'), s: caja.querySelector('[data-c-s]') };
    const grid = caja.querySelector('[data-cuenta-grid]');
    const titulo = caja.querySelector('[data-cuenta-titulo]');
    const msg = caja.querySelector('[data-cuenta-msg]');
    const sr = caja.querySelector('[data-cuenta-sr]');
    let timer = 0, ultimoMin = -1;
    const pad = function (n) { return String(n).padStart(2, '0'); };
    const tick = function () {
      const ahora = Date.now();
      if (ahora >= fin) {
        if (grid) grid.style.display = 'none';
        if (titulo) titulo.hidden = true;
        if (msg) { msg.hidden = false; msg.textContent = 'La asamblea concluyó. ¡Gracias por ser parte!'; }
        if (sr) sr.textContent = 'La asamblea concluyó. Gracias por participar.';
        clearInterval(timer); timer = 0; return;
      }
      if (ahora >= inicio) {
        if (grid) grid.style.display = 'none';
        if (titulo) titulo.hidden = true;
        if (msg) { msg.hidden = false; msg.textContent = '¡Estamos en vivo! La asamblea está en curso.'; }
        if (sr) sr.textContent = 'La asamblea está en curso.';
        return;
      }
      const dif = Math.floor((inicio - ahora) / 1000);
      const dd = Math.floor(dif / 86400), hh = Math.floor(dif % 86400 / 3600), mm = Math.floor(dif % 3600 / 60), ss = dif % 60;
      if (celdas.d) celdas.d.textContent = pad(dd);
      if (celdas.h) celdas.h.textContent = pad(hh);
      if (celdas.m) celdas.m.textContent = pad(mm);
      if (celdas.s) celdas.s.textContent = pad(ss);
      if (sr && mm !== ultimoMin) { ultimoMin = mm; sr.textContent = 'Faltan ' + dd + ' días, ' + hh + ' horas y ' + mm + ' minutos para la asamblea.'; }
    };
    const arranca = function () { clearInterval(timer); timer = 0; tick(); if (!d.hidden && Date.now() < fin) timer = w.setInterval(tick, 1000); };
    d.addEventListener('visibilitychange', arranca);
    arranca();
  });

  /* ---------- carrusel del hero ---------- */
  const region = d.querySelector('[data-carrusel]');
  if (region) {
    const slides = [].slice.call(region.querySelectorAll('[data-slide]'));
    const ctrl = d.querySelector('[data-ctrl]');
    const puntos = ctrl ? [].slice.call(ctrl.querySelectorAll('[data-ir]')) : [];
    const pausa = ctrl ? ctrl.querySelector('[data-pausa]') : null;
    const credito = ctrl ? ctrl.querySelector('[data-credito]') : null;
    const anuncio = ctrl ? ctrl.querySelector('[data-anuncio]') : null;
    if (slides.length > 1) {
      let idx = 0, timer = 0, pausadoUsuario = false, hover = false, foco = false, visible = true;
      const debeGirar = function () { return !rm.matches && !pausadoUsuario && !hover && !foco && visible && !d.hidden; };
      const ir = function (n) {
        const anterior = idx;
        idx = ((n % slides.length) + slides.length) % slides.length;
        if (idx === anterior) return;
        slides.forEach(function (s) { s.classList.remove('es-activa', 'es-previa'); });
        slides[anterior].classList.add('es-previa');
        slides[idx].classList.add('es-activa');
        puntos.forEach(function (p, i) {
          p.classList.toggle('es-activa', i === idx);
          if (i === idx) p.setAttribute('aria-current', 'true'); else p.removeAttribute('aria-current');
        });
        if (credito) credito.textContent = slides[idx].dataset.credito || '';
        if (anuncio && !debeGirar()) anuncio.textContent = slides[idx].getAttribute('aria-label') || '';
      };
      const reinicia = function () { clearInterval(timer); timer = 0; if (debeGirar()) timer = w.setInterval(function () { ir(idx + 1); }, 6000); };
      puntos.forEach(function (p) { p.addEventListener('click', function () { ir(Number(p.dataset.ir)); reinicia(); }); });
      if (pausa) pausa.addEventListener('click', function () {
        pausadoUsuario = !pausadoUsuario;
        pausa.setAttribute('aria-pressed', String(pausadoUsuario));
        pausa.setAttribute('aria-label', pausadoUsuario ? 'Reanudar carrusel' : 'Pausar carrusel');
        if (anuncio) anuncio.textContent = pausadoUsuario ? (slides[idx].getAttribute('aria-label') || '') : '';
        reinicia();
      });
      if (ctrl) {
        ctrl.addEventListener('mouseenter', function () { hover = true; reinicia(); });
        ctrl.addEventListener('mouseleave', function () { hover = false; reinicia(); });
        ctrl.addEventListener('focusin', function () { foco = true; reinicia(); });
        ctrl.addEventListener('focusout', function () { foco = false; reinicia(); });
        ctrl.addEventListener('keydown', function (e) {
          if (e.key === 'ArrowRight') { ir(idx + 1); reinicia(); }
          if (e.key === 'ArrowLeft') { ir(idx - 1); reinicia(); }
        });
      }
      let x0 = 0, y0 = 0;
      const zona = region.closest('.hero') || region;
      zona.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
      zona.addEventListener('touchend', function (e) {
        const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
        if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) { ir(idx + (dx < 0 ? 1 : -1)); reinicia(); }
      }, { passive: true });
      if ('IntersectionObserver' in w) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; reinicia(); }).observe(zona);
      d.addEventListener('visibilitychange', reinicia);
      reinicia();
    }
  }

  /* ---------- toast + compartir ---------- */
  const toast = d.querySelector('[data-toast]');
  let toastTimer = 0, toastOculto = 0;
  const avisa = function (texto) {
    if (!toast) return;
    toast.textContent = texto; toast.hidden = false;
    requestAnimationFrame(function () { toast.classList.add('es-visible'); });
    clearTimeout(toastTimer); clearTimeout(toastOculto);
    toastTimer = w.setTimeout(function () {
      toast.classList.remove('es-visible');
      toastOculto = w.setTimeout(function () { toast.hidden = true; }, 300);
    }, 2600);
  };
  const urlActual = function () { return location.href.split('#')[0]; };
  const textoCompartir = function () { return 'II Asamblea de Juventudes · Tu participación transforma · 28 de noviembre, UNSA Arequipa'; };
  const copiar = function () {
    const enlace = urlActual();
    const exito = function () { avisa('Enlace copiado. ¡Compártelo!'); };
    const respaldo = function () {
      const ta = d.createElement('textarea');
      ta.value = enlace; ta.style.position = 'fixed'; ta.style.opacity = '0';
      d.body.appendChild(ta); ta.select();
      try { d.execCommand('copy'); exito(); } catch (e) { avisa('Copia el enlace desde la barra de direcciones.'); }
      ta.remove();
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(enlace).then(exito, respaldo);
    } else respaldo();
  };
  const nativo = function () {
    if (navigator.share) {
      navigator.share({ title: d.title, text: textoCompartir(), url: urlActual() }).catch(function () { /* cancelado */ });
    } else copiar();
  };
  const porWhatsApp = function () { w.open('https://wa.me/?text=' + encodeURIComponent(textoCompartir() + ' ' + urlActual()), '_blank', 'noopener'); };
  [].slice.call(d.querySelectorAll('[data-compartir-wa]')).forEach(function (b) { b.addEventListener('click', porWhatsApp); });
  [].slice.call(d.querySelectorAll('[data-compartir-nativo]')).forEach(function (b) { b.addEventListener('click', nativo); });
  [].slice.call(d.querySelectorAll('[data-copiar]')).forEach(function (b) { b.addEventListener('click', copiar); });

  /* ---------- botones flotantes (compartir o enlaces directos según config.js) ---------- */
  const flWa = d.querySelector('[data-flotante-wa]');
  const flIg = d.querySelector('[data-flotante-ig]');
  if (flWa) {
    if (CONFIG.whatsappGrupo) { flWa.setAttribute('aria-label', 'Únete al grupo de WhatsApp'); flWa.title = 'Grupo de WhatsApp'; }
    flWa.addEventListener('click', function () {
      if (CONFIG.whatsappGrupo) w.open(CONFIG.whatsappGrupo, '_blank', 'noopener');
      else porWhatsApp();
    });
  }
  if (flIg) {
    if (CONFIG.instagram) {
      flIg.setAttribute('aria-label', 'Síguenos en Instagram'); flIg.title = 'Instagram';
      flIg.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" stroke="none"/></svg>';
    }
    flIg.addEventListener('click', function () {
      if (CONFIG.instagram) w.open(CONFIG.instagram, '_blank', 'noopener');
      else nativo();
    });
  }

  /* ---------- inscripción: activa el formulario cuando exista el enlace ---------- */
  const formEnlace = d.querySelector('[data-form-enlace]');
  const formPendiente = d.querySelector('[data-form-pendiente]');
  const urlForm = (CONFIG.formularioUrl || '').trim();
  if (formEnlace && formPendiente && urlForm) {
    formEnlace.href = urlForm;
    formEnlace.hidden = false;
    formPendiente.hidden = true;
  }
})();