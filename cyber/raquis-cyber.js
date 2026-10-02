(() => {
  'use strict';
  const scriptSrc = document.currentScript?.src || '';
  const base = scriptSrc ? new URL('./', scriptSrc).href : '';
  const css = base ? new URL('raquis-cyber.css', base).href : '';
  const logoDefault = 'https://raquischile.cl/assets/themes/clinica%20raquis/img/logo_header.png';
  const heroDefault = 'https://raquis-landing-vercel.vercel.app/assets/hero.webp';
  const giftQuiroImg = 'https://raquischile.cl/assets/uploads/2025/04/giftcard-quiropractica-raquis.png';
  const giftMasoImg = 'https://raquischile.cl/assets/uploads/2025/04/giftcard-masoterapia-raquis.png';
  const giftQuiroUrl = 'https://micrositios.getnet.cl/link/show?code=576ee2bac6c1f6ca3f5ee28147d78338aba4bf92f6cbd5ab62caa4c0cfef81cc&genid=124020&isQr=0';
  const giftMasoUrl = 'https://micrositios.getnet.cl/link/show?code=1c50cc00e4d63c206eb87542b5d0a1935c659df4ebfb8ca81c992cd8aac757e7&genid=131987';
  const clp = n => `$${Number(n).toLocaleString('es-CL')}`;
  const esc = s => String(s ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
  const tracked = raw => {
    if (!raw || raw === '#') return '#';
    try {
      const to = new URL(raw, location.href), from = new URL(location.href);
      from.searchParams.forEach((v,k)=>{/^(utm_[a-z0-9_]+|fbclid|gclid|msclkid)$/i.test(k)&&!to.searchParams.has(k)&&to.searchParams.set(k,v)});
      return to.href;
    } catch (_) { return raw; }
  };

  class RaquisCyber extends HTMLElement {
    constructor(){ super(); this.attachShadow({mode:'open'}); }
    connectedCallback(){
      if(!this.hasAttribute('contained')){ this.fullBleed(); this._resize=()=>this.fullBleed(); addEventListener('resize',this._resize,{passive:true}); }
      this.render(); this.bind();
    }
    disconnectedCallback(){ if(this._resize) removeEventListener('resize',this._resize); }
    fullBleed(){
      const w=document.documentElement.clientWidth||innerWidth,s=this.style;
      s.setProperty('display','block','important'); s.setProperty('position','relative','important');
      s.setProperty('left',`calc(50% - ${w/2}px)`,'important'); s.setProperty('width',`${w}px`,'important');
      s.setProperty('max-width','none','important'); s.setProperty('margin-left','0','important'); s.setProperty('margin-right','0','important');
    }
    a(name,fallback=''){ return this.getAttribute(name)||fallback; }
    get products(){
      const img={
        q:this.a('img-quiropractica',''), k:this.a('img-kinesiologia',''), m:this.a('img-masoterapia',''), o:this.a('img-ondas',''),
        gq:this.a('img-gift-quiro',giftQuiroImg), gm:this.a('img-gift-maso',giftMasoImg)
      };
      return [
        ['quiro-10','Quiropráctica','Plan 10 sesiones de quiropráctica','40%',210000,350000,140000,'10 meses','',img.q,tracked(this.a('url-quiro-10','#'))],
        ['quiro-4','Quiropráctica','Plan 4 sesiones de quiropráctica','30%',98000,140000,42000,'4 meses','',img.q,tracked(this.a('url-quiro-4','#'))],
        ['kine-10','Kinesiología','Plan 10 sesiones de kinesiología','30%',175000,250000,75000,'10 meses','Excluye Prof. Roberto Urzua',img.k,tracked(this.a('url-kine-10','#'))],
        ['kine-5','Kinesiología','Plan 5 sesiones de kinesiología','25%',93750,125000,31250,'5 meses','Excluye Prof. Roberto Urzua',img.k,tracked(this.a('url-kine-5','#'))],
        ['maso-8','Masoterapia','Plan 8 sesiones de masoterapia','25%',180000,240000,60000,'10 meses','',img.m,tracked(this.a('url-maso-8','#'))],
        ['maso-4','Masoterapia','Plan 4 sesiones de masoterapia','20%',96000,120000,24000,'6 meses','',img.m,tracked(this.a('url-maso-4','#'))],
        ['ondas-5','Ondas de choque','Plan 5 sesiones de ondas de choque','25%',112500,150000,37500,'5 meses','Valor por sesión: $30.000',img.o,tracked(this.a('url-ondas-5','#'))],
        ['gift-maso','Gift Cards','Gift card de masoterapia · 1 sesión','20%',24000,30000,6000,'2 meses','',img.gm,tracked(this.a('url-gift-maso',giftMasoUrl))],
        ['gift-quiro','Gift Cards','Gift card de quiropráctica · 1 sesión','15%',30000,35000,5000,'2 meses','',img.gq,tracked(this.a('url-gift-quiro',giftQuiroUrl))]
      ].map(x=>({id:x[0],category:x[1],title:x[2],discount:x[3],price:x[4],regular:x[5],saving:x[6],duration:x[7],note:x[8],image:x[9],url:x[10]}));
    }
    card(p,wide=false){
      const pending=p.url==='#';
      const media=p.image?`<img src="${esc(p.image)}" alt="${esc(p.category)}" loading="lazy">`:`<div class="media-fallback"><b>${esc(p.category)}</b><span>Imagen pendiente</span></div>`;
      return `<article class="offer-card${wide?' offer-card--wide':''}"><div class="offer-media">${media}<span class="discount">${esc(p.discount)}<small>DCTO.</small></span></div><div class="offer-copy"><h3>${esc(p.title)}</h3><div class="prices"><strong>${clp(p.price)}</strong><s>${clp(p.regular)}</s></div><div class="saving">Ahorras <b>${clp(p.saving)}</b></div><div class="meta"><span>◷ Vigencia: ${esc(p.duration)}</span>${p.note?`<span>${esc(p.note)}</span>`:''}</div><a class="buy${pending?' is-pending':''}" data-product="${esc(p.id)}" data-category="${esc(p.category)}" data-price="${p.price}" data-discount="${esc(p.discount)}" href="${esc(p.url)}" ${pending?'aria-disabled="true"':'target="_blank" rel="noopener noreferrer"'}>${pending?'ENLACE PENDIENTE':'COMPRAR →'}</a></div></article>`;
    }
    category(name,intro,wide=false){
      const items=this.products.filter(p=>p.category===name);
      return `<section class="category"><div class="category-head"><h2>${esc(name)}</h2><p>${esc(intro)}</p></div><div class="offers${wide?' offers--wide':''}">${items.map(p=>this.card(p,wide)).join('')}</div></section>`;
    }
    render(){
      const logo=this.a('logo-src',logoDefault), hero=this.a('hero-image',heroDefault);
      this.shadowRoot.innerHTML=`${css?`<link rel="stylesheet" href="${esc(css)}">`:''}<main class="page"><div class="wrap brand"><img src="${esc(logo)}" alt="Raquis"></div><section class="wrap hero"><div class="hero-copy"><span class="pill">CYBER RAQUIS</span><h1>Tu bienestar también está <span>en Cyber</span></h1><p>Promociones especiales en quiropráctica, kinesiología, masoterapia, ondas de choque y Gift Cards.</p><button class="primary js-scroll">VER PROMOCIONES ↓</button></div><div class="hero-media"><img src="${esc(hero)}" alt="Atención en Clínica Raquis"><div class="hero-badge">40%<small>HASTA DCTO.</small></div></div></section><div class="wrap trustbar"><div>％<b>Promociones por tiempo limitado</b></div><div>✓<b>Compra online</b></div><div>＋<b>Equipo profesional</b></div><div>⌖<b>Providencia y Santiago Centro</b></div></div><div class="wrap promos" id="promos">${this.category('Quiropráctica','Planes Cyber disponibles por tiempo limitado.')}${this.category('Kinesiología','Planes Cyber con vigencia informada en cada promoción.')}${this.category('Masoterapia','Elige el plan que mejor se ajuste a lo que buscas.')}${this.category('Ondas de choque','Promoción Cyber disponible en formato de 5 sesiones.',true)}${this.category('Gift Cards','Regala una sesión de bienestar con precio Cyber.')}</div><section class="reviews"><div class="wrap"><h2>Lo que dicen nuestros pacientes</h2><p>Reseñas reales de Google.</p><div class="reviews-slot"><slot name="google-reviews"><div class="reviews-placeholder"><b>Widget de reseñas de Google</b><span>Inserta aquí el script o bloque de tu proveedor de reseñas.</span></div></slot></div></div></section><section class="confidence"><div class="wrap confidence-grid"><div>✓<b>Equipo profesional</b></div><div>⌖<b>Providencia y Santiago Centro</b></div><div>▣<b>Compra online</b></div><div>◷<b>Vigencia visible en cada promoción</b></div></div></section><section class="wrap faq"><h2>Preguntas frecuentes</h2><div class="faq-grid"><details><summary>¿Hasta cuándo puedo comprar las promociones Cyber?</summary><p>Las promociones estarán disponibles durante el periodo Cyber informado por Raquis y sujeto a disponibilidad.</p></details><details><summary>¿Cuánto tiempo tengo para usar mi plan?</summary><p>Cada card indica la vigencia específica del plan o Gift Card desde su compra.</p></details><details><summary>¿Puedo usar las promociones en ambas sedes?</summary><p>La disponibilidad puede variar según servicio y sede. Las condiciones definitivas se informarán antes de publicar la campaña.</p></details><details><summary>¿Las promociones son acumulables con otros descuentos?</summary><p>Las condiciones de acumulación se informarán junto a los términos de la campaña Cyber.</p></details><details><summary>¿Cómo recibo mi compra o Gift Card?</summary><p>Al completar la compra online recibirás la confirmación correspondiente del medio de pago utilizado.</p></details><details><summary>¿Qué pasa con el Prof. Roberto Urzua en Kinesiología?</summary><p>Los planes Cyber de Kinesiología indicados en esta página excluyen atenciones con el Prof. Roberto Urzua.</p></details></div></section></main>`;
    }
    bind(){
      this.shadowRoot.querySelector('.js-scroll')?.addEventListener('click',()=>{this.shadowRoot.querySelector('#promos')?.scrollIntoView({behavior:'smooth'});this.track('raquis_cyber_view_promos',{position:'hero'})});
      this.shadowRoot.querySelectorAll('.buy').forEach(a=>a.addEventListener('click',e=>{if(a.classList.contains('is-pending')){e.preventDefault();return}this.track('raquis_cyber_purchase_click',{product:a.dataset.product,category:a.dataset.category,price:Number(a.dataset.price),discount:a.dataset.discount,destination:a.href})}));
    }
    track(event,data){
      const detail={event,...data};
      try{window.dataLayer=window.dataLayer||[];window.dataLayer.push(detail)}catch(_){}
      try{if(typeof window.fbq==='function')window.fbq('trackCustom',event==='raquis_cyber_purchase_click'?'RaquisCyberPurchaseClick':'RaquisCyberViewPromos',data)}catch(_){}
      this.dispatchEvent(new CustomEvent(event.replaceAll('_',':'),{bubbles:true,composed:true,detail}));
    }
  }
  if(!customElements.get('raquis-cyber')) customElements.define('raquis-cyber',RaquisCyber);
})();
