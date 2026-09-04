(() => {
  'use strict';

  const LEGACY_ASSET_BASE = 'https://raquis-landing-vercel.vercel.app/assets/';
  const SCRIPT_ASSET_BASE = (() => {
    try {
      const scriptUrl = document.currentScript && document.currentScript.src;
      return scriptUrl ? new URL('./assets/', scriptUrl).href : LEGACY_ASSET_BASE;
    } catch (_) {
      return LEGACY_ASSET_BASE;
    }
  })();
  const DEFAULT_BOOKING = 'https://93acf75076f8628c4a58b409561c93d08b7866c7.agenda.softwaredentalink.com/agenda/especialidad?modalidad=1&id_especialidad=13';
  const DEFAULT_LOGO = 'https://raquischile.cl/assets/themes/clinica%20raquis/img/logo_header.png';
  const clp = n => `$${Number(n).toLocaleString('es-CL')}`;

  function tracked(raw) {
    try {
      const to = new URL(raw || DEFAULT_BOOKING, location.href);
      const from = new URL(location.href);
      from.searchParams.forEach((v, k) => {
        if (/^(utm_[a-z0-9_]+|fbclid|gclid|msclkid)$/i.test(k) && !to.searchParams.has(k)) to.searchParams.set(k, v);
      });
      return to.href;
    } catch (_) { return raw || DEFAULT_BOOKING; }
  }

  class RaquisLanding extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.assetBase = LEGACY_ASSET_BASE;
    }

    connectedCallback() {
      if (!this.hasAttribute('contained')) {
        this.fullBleed();
        this._resize = () => this.fullBleed();
        addEventListener('resize', this._resize, { passive: true });
      }

      this.resolveAssetBase().then(() => {
        if (!this.isConnected) return;
        this.render();
        this.bind();
      });
    }

    disconnectedCallback() {
      if (this._resize) removeEventListener('resize', this._resize);
    }

    resolveAssetBase() {
      const customBase = this.getAttribute('asset-base');
      if (customBase) {
        this.assetBase = customBase.endsWith('/') ? customBase : `${customBase}/`;
        return Promise.resolve();
      }

      if (SCRIPT_ASSET_BASE === LEGACY_ASSET_BASE) {
        this.assetBase = LEGACY_ASSET_BASE;
        return Promise.resolve();
      }

      return new Promise(resolve => {
        const probe = new Image();
        let settled = false;
        const finish = base => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          this.assetBase = base;
          resolve();
        };
        const timer = setTimeout(() => finish(LEGACY_ASSET_BASE), 1800);
        probe.onload = () => finish(SCRIPT_ASSET_BASE);
        probe.onerror = () => finish(LEGACY_ASSET_BASE);
        probe.src = `${SCRIPT_ASSET_BASE}hero.webp`;
      });
    }

    fullBleed() {
      const w = document.documentElement.clientWidth || innerWidth;
      const s = this.style;
      s.setProperty('display', 'block', 'important');
      s.setProperty('position', 'relative', 'important');
      s.setProperty('left', `calc(50% - ${w / 2}px)`, 'important');
      s.setProperty('width', `${w}px`, 'important');
      s.setProperty('max-width', 'none', 'important');
      s.setProperty('margin-left', '0', 'important');
      s.setProperty('margin-right', '0', 'important');
    }

    get cfg() {
      const base = this.assetBase || LEGACY_ASSET_BASE;
      return {
        regular: this.getAttribute('regular-price') || '35000',
        promo: this.getAttribute('promo-price') || '21000',
        discount: this.getAttribute('discount') || '40%',
        label: this.getAttribute('campaign-label') || 'TODOS LOS MARTES DE SEPTIEMBRE',
        booking: tracked(this.getAttribute('booking-url') || DEFAULT_BOOKING),
        logo: this.getAttribute('logo-src') || DEFAULT_LOGO,
        hero: this.getAttribute('hero-image') || `${base}hero.webp`,
        video: this.getAttribute('video-src') || `${base}primera-sesion.mp4`,
        poster: this.getAttribute('video-poster') || `${base}video-poster.jpg`
      };
    }

    render() {
      const c = this.cfg;
      this.shadowRoot.innerHTML = `
      <style>
        :host{--o:#df4b05;--od:#c13e02;--ink:#292522;--muted:#716a65;--line:#eadbd1;--soft:#fff5ed;display:block;width:100%;background:#fff;color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}
        *,*:before,*:after{box-sizing:border-box}img,video{display:block;max-width:100%}a{color:inherit}.page{overflow:hidden;background:linear-gradient(180deg,#fffaf6 0,#fff 43%,#fffaf6 100%)}.wrap{width:min(1320px,calc(100% - 64px));margin:auto}.brand{padding:26px 0 10px}.brand img{width:230px;height:auto}:host([hide-brand]) .brand{display:none}
        .hero{display:grid;grid-template-columns:minmax(0,1.08fr) minmax(390px,.92fr);gap:48px;align-items:center;padding:42px 0 64px}.eyebrow{margin:0 0 18px;color:var(--o);font-weight:850;font-size:1rem;letter-spacing:.01em}.hero h1{max-width:720px;margin:0;font-size:clamp(3rem,5.25vw,5rem);line-height:.98;letter-spacing:-.05em;font-weight:820}.accent{color:var(--o)}.sub{margin:20px 0 0;color:#5d5651;font-size:clamp(1.08rem,1.6vw,1.3rem)}
        .price{display:grid;grid-template-columns:1fr 1.25fr;max-width:580px;margin:30px 0 20px;border:1px solid #ecd2c1;border-radius:18px;background:#fff;overflow:hidden;box-shadow:0 12px 30px rgba(65,40,25,.06)}.price>div{padding:18px 22px}.price>div+div{border-left:1px solid #ecd2c1}.label{display:block;margin-bottom:5px;font-size:.92rem;font-weight:650;color:#625a55}.old{text-decoration:line-through;color:#68615c;font-size:1.8rem}.promo{display:block;color:var(--o);font-size:clamp(2.45rem,4vw,3.65rem);line-height:1;font-weight:850;letter-spacing:-.04em;white-space:nowrap}
        .loc{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin:0 0 20px;font-weight:700;font-size:.96rem}.loc svg{color:var(--o)}.sep{color:#aaa19b;font-weight:400}.cta{display:inline-flex;align-items:center;justify-content:center;gap:12px;width:min(100%,580px);min-height:60px;padding:16px 24px;border-radius:13px;background:linear-gradient(#e95608,#da4803);color:white;text-decoration:none;font-weight:850;font-size:1.12rem;box-shadow:0 10px 22px rgba(190,61,2,.2);transition:.15s}.cta:hover{transform:translateY(-1px);box-shadow:0 14px 28px rgba(190,61,2,.25)}.micro{max-width:580px;margin:10px 0 0;text-align:center;color:#7a736e;font-size:.84rem}
        .hero-img{min-height:660px;border-radius:25px;overflow:hidden;background:#efe6df;box-shadow:0 22px 54px rgba(55,37,27,.11)}.hero-img img{width:100%;height:100%;object-fit:cover;object-position:center}
        .section{padding:72px 0;border-top:1px solid rgba(234,219,209,.9)}.title{margin:0 auto 12px;text-align:center;font-size:clamp(2rem,3.5vw,3rem);line-height:1.06;letter-spacing:-.035em}.intro{max-width:720px;margin:0 auto 38px;text-align:center;color:var(--muted);font-size:1.08rem;line-height:1.55}.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:0}.step{padding:0 28px;text-align:center}.step+.step{border-left:1px solid var(--line)}.num{display:grid;place-items:center;width:38px;height:38px;margin:0 auto 14px;border-radius:50%;background:#fff0e5;color:var(--o);font-weight:850}.step h3{margin:0 0 9px;font-size:1.02rem;line-height:1.15}.step p{margin:0;color:var(--muted);line-height:1.48;font-size:.94rem}.included{display:flex;justify-content:center;align-items:center;gap:8px;margin:28px 0 0;color:#544d48;font-weight:700}.included svg{color:var(--o)}
        .video-sec{background:#fff9f5}.video-grid{display:grid;grid-template-columns:minmax(280px,390px) minmax(0,1fr);gap:76px;align-items:center}.video-frame{aspect-ratio:9/16;border-radius:22px;overflow:hidden;background:#111;box-shadow:0 20px 48px rgba(60,42,30,.14)}.video-frame video{width:100%;height:100%;object-fit:cover}.video-copy{max-width:610px}.video-copy h2{margin:0 0 16px;font-size:clamp(2.15rem,4vw,3.4rem);line-height:1.02;letter-spacing:-.04em}.video-copy p{margin:0 0 28px;color:var(--muted);font-size:1.08rem;line-height:1.55}
        .final{padding:72px 0 88px}.final-box{position:relative;overflow:hidden;padding:54px 38px;border:1px solid #edd7c9;border-radius:25px;background:linear-gradient(135deg,#fff9f4,#fff1e7);text-align:center}.final-box:after{content:"";position:absolute;width:380px;height:160px;right:-70px;bottom:-95px;border:24px solid rgba(223,75,5,.05);border-radius:50%}.final h2{position:relative;z-index:1;margin:0 auto 10px;max-width:780px;font-size:clamp(2rem,3.6vw,3rem);line-height:1.05;letter-spacing:-.035em}.final h2 strong,.final-price strong{color:var(--o)}.final-price{position:relative;z-index:1;margin:0 0 24px;color:#625a55}.final .cta{position:relative;z-index:1}.final-loc{position:relative;z-index:1;display:flex;justify-content:center;align-items:center;gap:8px;flex-wrap:wrap;margin-top:20px;color:#746b65;font-size:.9rem}.final-loc svg{color:var(--o)}.sticky{display:none}
        @media(max-width:950px){.wrap{width:min(100% - 40px,760px)}.hero{grid-template-columns:1fr;gap:28px;padding:34px 0 50px}.hero-copy{order:1}.hero-img{order:2;min-height:0;aspect-ratio:4/3}.hero-img img{object-position:center 42%}.hero h1{font-size:clamp(2.9rem,9vw,4.3rem)}.steps{grid-template-columns:1fr 1fr;gap:30px 0}.step:nth-child(3){border-left:0}.video-grid{grid-template-columns:300px 1fr;gap:42px}}
        @media(max-width:680px){.wrap{width:calc(100% - 32px)}.hero{padding:24px 0 38px}.eyebrow{font-size:.84rem;margin-bottom:13px}.hero h1{font-size:clamp(2.5rem,12.5vw,3.45rem)}.sub{font-size:1rem;margin-top:14px}.price{margin:22px 0 16px}.price>div{padding:14px 15px}.old{font-size:1.38rem}.promo{font-size:2.25rem}.loc{font-size:.86rem}.cta{min-height:54px;font-size:1rem}.micro{font-size:.77rem}.hero-img{aspect-ratio:1/1.03;border-radius:20px}.section{padding:54px 0}.intro{font-size:.98rem;margin-bottom:26px}.steps{grid-template-columns:1fr;gap:0}.step{display:grid;grid-template-columns:44px 1fr;text-align:left;padding:18px 0;border-top:1px solid var(--line)}.step+.step{border-left:0}.step:first-child{border-top:0}.num{grid-row:1/3;margin:0}.step h3{margin:2px 0 5px}.step p{grid-column:2}.included{text-align:center;font-size:.86rem}.video-grid{grid-template-columns:1fr;gap:28px}.video-frame{width:min(82vw,320px);margin:auto}.video-copy{text-align:center}.video-copy h2{font-size:2rem}.video-copy .cta{width:100%}.final{padding:54px 0 82px}.final-box{padding:38px 20px}.final h2{font-size:2rem}.sticky{display:block;position:fixed;z-index:999999;left:0;right:0;bottom:0;padding:9px 12px max(9px,env(safe-area-inset-bottom));background:rgba(255,255,255,.96);border-top:1px solid #eadbd1;box-shadow:0 -8px 26px rgba(50,35,25,.1);backdrop-filter:blur(12px)}.sticky .cta{width:100%;min-height:50px}}
      </style>
      <main class="page">
        <div class="wrap brand"><img src="${c.logo}" alt="Raquis Quiropráctica y Kinesiología"></div>
        <section class="wrap hero">
          <div class="hero-copy">
            <p class="eyebrow">▣ &nbsp;${c.label}</p>
            <h1><span class="accent">${c.discount} OFF</span> en tu primera sesión quiropráctica</h1>
            <p class="sub">Evaluación y tratamiento según tu caso.</p>
            <div class="price"><div><span class="label">Valor general</span><span class="old">${clp(c.regular)}</span></div><div><span class="label">Precio especial martes</span><span class="promo">${clp(c.promo)}</span></div></div>
            <div class="loc"><svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.4A2.4 2.4 0 1 1 12 6.6a2.4 2.4 0 0 1 0 4.8Z"/></svg><span>Sede Providencia</span><span class="sep">|</span><span>Sede Santiago Centro</span></div>
            <a class="cta js-cta" data-pos="hero" href="${c.booking}">AGENDAR POR ${clp(c.promo)} →</a>
            <p class="micro">Cupos sujetos a disponibilidad por sede y horario.</p>
          </div>
          <div class="hero-img"><img src="${c.hero}" alt="Atención quiropráctica en Clínica Raquis"></div>
        </section>
        <section class="section"><div class="wrap">
          <h2 class="title">¿Qué hacemos en tu primera sesión?</h2><p class="intro">En aproximadamente <strong>30 minutos</strong> evaluamos tu condición antes de definir el tratamiento.</p>
          <div class="steps">
            <article class="step"><span class="num">1</span><h3>Revisamos tus antecedentes</h3><p>Evaluamos tu historial clínico para identificar posibles contraindicaciones.</p></article>
            <article class="step"><span class="num">2</span><h3>Evaluación funcional</h3><p>Revisamos movilidad, columna y extremidades con los tests que correspondan.</p></article>
            <article class="step"><span class="num">3</span><h3>Evaluamos tu columna</h3><p>Buscamos sensibilidades, restricciones y otros elementos relevantes.</p></article>
            <article class="step"><span class="num">4</span><h3>Comenzamos el tratamiento</h3><p>La atención se define según los resultados de tu evaluación y tus necesidades.</p></article>
          </div><p class="included">✓ Evaluación y tratamiento incluidos en tu primera sesión.</p>
        </div></section>
        <section class="section video-sec"><div class="wrap video-grid">
          <div class="video-frame"><video controls playsinline preload="metadata" poster="${c.poster}"><source src="${c.video}" type="video/mp4"></video></div>
          <div class="video-copy"><h2>Conoce cómo es una primera atención en Raquis</h2><p>Paz Grifferos te muestra qué hacemos durante tu primera sesión y cómo evaluamos tu condición antes del tratamiento.</p><a class="cta js-cta" data-pos="video" href="${c.booking}">AGENDAR CON ${c.discount} OFF →</a></div>
        </div></section>
        <section class="wrap final"><div class="final-box"><h2>Agenda tu primera sesión por <strong>${clp(c.promo)}</strong></h2><p class="final-price"><s>${clp(c.regular)}</s> · <strong>${c.discount} OFF</strong> todos los martes de septiembre</p><a class="cta js-cta" data-pos="final" href="${c.booking}">AGENDAR MI HORA →</a><div class="final-loc">Providencia <span>·</span> Santiago Centro <span>·</span> Todos los martes de septiembre</div></div></section>
        <div class="sticky"><a class="cta js-cta" data-pos="sticky_mobile" href="${c.booking}">AGENDAR · ${clp(c.promo)}</a></div>
      </main>`;
    }

    bind() {
      this.shadowRoot.querySelectorAll('.js-cta').forEach(a => a.addEventListener('click', () => {
        const detail = { event: 'raquis_landing_cta', position: a.dataset.pos, price: Number(this.cfg.promo), discount: this.cfg.discount, destination: a.href };
        try { window.dataLayer = window.dataLayer || []; window.dataLayer.push(detail); } catch (_) {}
        try { if (typeof window.fbq === 'function') window.fbq('trackCustom', 'RaquisLandingCTA', { position: detail.position, value: detail.price, currency: 'CLP' }); } catch (_) {}
        this.dispatchEvent(new CustomEvent('raquis:cta', { bubbles: true, composed: true, detail }));
      }));
    }
  }

  if (!customElements.get('raquis-landing')) customElements.define('raquis-landing', RaquisLanding);
})();
