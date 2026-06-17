/* ===== Saudi Cable ERM — shared shell: sidebar + header + i18n + theme ===== */
(function(){
  const NAV = [
    { g:['الرئيسية','Main'], items:[ ['layout-dashboard','لوحة المعلومات','Dashboard','dashboard.html'] ] },
    { g:['إدارة المخاطر','Risk Management'], items:[
      ['alert-triangle','المخاطر','Risks','risks.html'],
      ['check-square','موافقات المخاطر','Risk Approvals','risk-approvals.html'],
      ['clipboard-check','التقييم','Assessment','assessment.html'],
      ['target','المتابعة','Tracking','tracking.html'] ] },
    { g:['المعالجة','Treatment'], items:[
      ['wrench','خطط المعالجة','Treatment Plans','treatment.html'],
      ['activity','مراقبة المعالجة','Treatment Monitoring','treatment-monitoring.html'] ] },
    { g:['الامتثال والحوادث','Compliance & Incidents'], items:[
      ['shield-check','الامتثال','Compliance','compliance.html'],
      ['calendar-days','تقويم الامتثال','Compliance Calendar','compliance-calendar.html'],
      ['alert-circle','الحوادث','Incidents','incidents.html'],
      ['file-search','التدقيق','Audit','audit.html'] ] },
    { g:['التعاون','Collaboration'], items:[
      ['users','رواد المخاطر','Risk Champions','champions.html'],
      ['message-square','النقاشات','Discussions','discussions.html'] ] },
    { g:['النظام','System'], items:[
      ['file-bar-chart','التقارير','Reports','reports.html'],
      ['settings','الإعدادات','Settings','settings.html'] ] },
  ];

  const page = document.body.dataset.page || 'dashboard.html';

  function sidebar(){
    return `
    <aside id="sidebar">
      <div style="display:flex;align-items:center;gap:.75rem;height:4rem;padding:0 1rem;border-bottom:1px solid var(--border)">
        <div style="display:flex;height:2.5rem;width:2.5rem;align-items:center;justify-content:center;border-radius:.75rem;box-shadow:0 4px 8px rgba(0,0,0,.15);background:linear-gradient(135deg,var(--primary),var(--primary-hover))">
          <svg viewBox="0 0 24 24" style="height:1.25rem;width:1.25rem;color:#fff" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8" stroke-dasharray="4 2"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>
        </div>
        <div style="display:flex;flex-direction:column;min-width:0">
          <span style="font-size:.875rem;font-weight:700;color:var(--foreground)" data-ar="الكابلات السعودية" data-en="Saudi Cable">الكابلات السعودية</span>
          <span style="font-size:.75rem;font-weight:600;letter-spacing:.05em;color:var(--primary)">ERM</span>
        </div>
        <button id="closeSb" class="lg-hide" style="margin-inline-start:auto;background:none;border:0;color:var(--foreground-secondary);cursor:pointer;padding:.4rem"><i data-lucide="x"></i></button>
      </div>
      <nav style="flex:1;overflow-y:auto;padding:1rem .75rem">
        ${NAV.map((grp,gi)=>`
          <div style="${gi>0?'padding-top:1rem':''}">
            <div style="padding:0 .75rem .375rem"><span style="font-size:.625rem;font-weight:600;text-transform:uppercase;letter-spacing:.08em;opacity:.6;color:var(--foreground-secondary)" data-ar="${grp.g[0]}" data-en="${grp.g[1]}">${grp.g[0]}</span></div>
            <ul style="list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:.25rem">
              ${grp.items.map(([ic,ar,en,href])=>{
                const active = href===page;
                return `<li><a href="${href}" class="nav-link" data-active="${active}" style="position:relative;display:flex;align-items:center;gap:.75rem;border-radius:.75rem;padding:.625rem .75rem;font-size:.875rem;font-weight:500;text-decoration:none;${active?'background:var(--primary-light);color:var(--primary)':'color:var(--foreground-secondary)'}">
                  ${active?'<span style="position:absolute;top:50%;transform:translateY(-50%);width:.25rem;height:1.5rem;border-radius:999px;background:var(--primary);inset-inline-start:-.75rem"></span>':''}
                  <div style="display:flex;height:2.25rem;width:2.25rem;align-items:center;justify-content:center;border-radius:.5rem;flex-shrink:0;${active?'background:var(--primary);color:#fff':'background:var(--background-tertiary);color:var(--foreground-secondary)'}"><i data-lucide="${ic}" style="width:18px;height:18px"></i></div>
                  <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis" data-ar="${ar}" data-en="${en}">${ar}</span>
                </a></li>`;
              }).join('')}
            </ul>
          </div>`).join('')}
      </nav>
      <div style="padding:.75rem;border-top:1px solid var(--border)">
        <div style="display:flex;align-items:center;gap:.5rem;font-size:.75rem;font-weight:600;margin-bottom:.5rem;color:var(--foreground-secondary)">
          <span style="position:relative;display:flex;height:.625rem;width:.625rem"><span style="position:absolute;display:inline-flex;height:100%;width:100%;border-radius:50%;background:#4ade80;opacity:.75;animation:ping 1s cubic-bezier(0,0,.2,1) infinite"></span><span style="position:relative;display:inline-flex;border-radius:50%;height:.625rem;width:.625rem;background:#22c55e"></span></span>
          <span data-ar="المتصلون الآن" data-en="Online Now">المتصلون الآن</span>
          <span style="margin-inline-start:auto;background:rgba(34,197,94,.2);color:#16a34a;padding:.1rem .4rem;border-radius:999px;font-size:.625rem;font-weight:700">14</span>
        </div>
        <div style="display:flex;align-items:center;gap:.5rem;padding:.375rem .5rem;border-radius:.5rem">
          <div style="height:1.75rem;width:1.75rem;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:.75rem;font-weight:700;background:linear-gradient(135deg,var(--primary),var(--primary-hover))">A</div>
          <div style="flex:1;min-width:0"><p style="margin:0;font-size:.75rem;font-weight:500;color:var(--foreground)" data-ar="عبدالإله سجيني" data-en="Abdulelah Sejini">عبدالإله سجيني</p><p style="margin:0;font-size:.625rem;color:var(--foreground-secondary)" data-ar="مدير المخاطر" data-en="Risk Manager">مدير المخاطر</p></div>
        </div>
      </div>
    </aside>
    <div id="overlay" style="display:none"></div>`;
  }

  function header(){
    return `
    <header class="erm-header">
      <button id="menuBtn" class="lg-hide" style="border-radius:.75rem;padding:.5rem;background:none;border:0;color:var(--foreground-secondary);cursor:pointer"><i data-lucide="menu"></i></button>
      <div class="sm-show" style="position:relative;width:18rem;max-width:100%">
        <i data-lucide="search" style="position:absolute;top:50%;transform:translateY(-50%);width:1rem;height:1rem;inset-inline-start:.75rem;color:var(--foreground-muted)"></i>
        <input class="input" style="padding-inline-start:2.25rem" data-ar-ph="بحث عن خطر، خطة، إدارة..." data-en-ph="Search risks, plans, departments..." placeholder="بحث...">
      </div>
      <div style="margin-inline-start:auto;display:flex;align-items:center;gap:.5rem">
        <div style="display:inline-flex;border-radius:.75rem;padding:.25rem;gap:.25rem;background:var(--background-tertiary)">
          <button data-lang="ar" class="lang-btn" style="padding:.375rem .75rem;border-radius:.5rem;font-size:.75rem;font-weight:600;border:0;cursor:pointer">عربي</button>
          <button data-lang="en" class="lang-btn" style="padding:.375rem .75rem;border-radius:.5rem;font-size:.75rem;font-weight:600;border:0;cursor:pointer">EN</button>
        </div>
        <button id="themeBtn" style="border-radius:.75rem;padding:.625rem;background:var(--background-tertiary);color:var(--foreground-secondary);border:0;cursor:pointer" aria-label="theme">
          <i data-lucide="moon" class="theme-moon"></i><i data-lucide="sun" class="theme-sun" style="display:none"></i>
        </button>
        <button id="impersonateBtn" title="عرض كمستخدم آخر (Admin)" style="border-radius:.75rem;padding:.625rem;background:var(--background-tertiary);color:var(--foreground-secondary);border:0;cursor:pointer">
          <i data-lucide="user-cog"></i>
        </button>
        <div style="position:relative">
          <button id="notifBtn" style="position:relative;border-radius:.75rem;padding:.625rem;background:var(--background-tertiary);color:var(--foreground-secondary);border:0;cursor:pointer">
            <i data-lucide="bell"></i>
            <span id="notifBadge" style="position:absolute;top:-.25rem;inset-inline-end:-.25rem;display:none;height:1.25rem;min-width:1.25rem;padding:0 .25rem;align-items:center;justify-content:center;border-radius:50%;background:#ef4444;font-size:.625rem;color:#fff;font-weight:700">0</span>
          </button>
          <div id="notifPanel" style="display:none;position:absolute;top:calc(100% + .5rem);inset-inline-end:0;width:min(380px,calc(100vw - 2rem));background:var(--card);border:1px solid var(--border);border-radius:.85rem;box-shadow:0 18px 40px -12px rgba(0,0,0,.2);z-index:40;overflow:hidden">
            <div style="padding:.75rem 1rem;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
              <span style="font-weight:700;font-size:.9rem" data-ar="الإشعارات" data-en="Notifications">الإشعارات</span>
              <button id="notifMarkAll" style="background:none;border:0;color:var(--primary);font-size:.72rem;font-weight:600;cursor:pointer" data-ar="تعليم الكل مقروء" data-en="Mark all read">تعليم الكل مقروء</button>
            </div>
            <div id="notifList" style="max-height:65vh;overflow-y:auto;padding:.4rem 0"></div>
            <div style="padding:.6rem 1rem;border-top:1px solid var(--border);text-align:center"><a href="#" style="color:var(--primary);font-size:.78rem;font-weight:600;text-decoration:none" data-ar="عرض كل الإشعارات" data-en="View all notifications">عرض كل الإشعارات</a></div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:.5rem;padding-inline-start:.5rem;border-inline-start:1px solid var(--border)">
          <div style="height:2.25rem;width:2.25rem;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:.875rem;font-weight:700;background:linear-gradient(135deg,var(--primary),var(--primary-hover))">A</div>
          <div class="md-show"><p style="margin:0;font-size:.875rem;font-weight:600;color:var(--foreground)" data-ar="عبدالإله سجيني" data-en="Abdulelah Sejini">عبدالإله سجيني</p><p style="margin:0;font-size:.6875rem;color:var(--foreground-secondary)" data-ar="مدير المخاطر" data-en="Risk Manager">مدير المخاطر</p></div>
        </div>
      </div>
    </header>`;
  }

  // impersonation banner + modal
  function banner(){
    return `<div id="impBanner" style="display:none;background:linear-gradient(90deg,var(--primary),var(--primary-hover));color:#fff;padding:.65rem 1rem;align-items:center;gap:.85rem;flex-wrap:wrap;border-bottom:1px solid rgba(0,0,0,.1);box-shadow:0 2px 8px rgba(243,146,0,.25)">
      <i data-lucide="user-cog" style="width:1.1rem;height:1.1rem;flex-shrink:0"></i>
      <div style="flex:1;min-width:200px">
        <p style="margin:0;font-weight:700;font-size:.85rem" data-ar="أنت تعرض النظام كـ:" data-en="You are viewing as:">أنت تعرض النظام كـ:</p>
        <p style="margin:.1rem 0 0;font-size:.78rem;opacity:.95"><strong id="impName"></strong> · <span id="impRole" style="opacity:.85"></span></p>
      </div>
      <button id="impExit" style="border-radius:.5rem;padding:.45rem .85rem;background:#fff;color:var(--primary);font-weight:700;font-size:.78rem;border:0;cursor:pointer;display:inline-flex;align-items:center;gap:.4rem"><i data-lucide="log-out" style="width:.85rem;height:.85rem"></i><span data-ar="إنهاء العرض" data-en="Exit View">إنهاء العرض</span></button>
    </div>`;
  }
  function impModal(){
    const USERS=[
      ['محمد باحويرث','Mohammed Bawerath','رائد المخاطر','Risk Champion','ضمان الجودة + 4 أقسام','#a855f7'],
      ['نواف باقاسي','Nawaf Bagasi','رائد المخاطر','Risk Champion','المالية','#10b981'],
      ['تركي أبو طالب','Turki Abu Talib','رائد المخاطر','Risk Champion','المشتريات + الشحن','#3b82f6'],
      ['سعاد البيشي','Suaad Al-Bishi','محلل المخاطر','Risk Analyst','إدارة المخاطر','#f97316'],
      ['ماجد الدوسري','Majed Al-Dossari','مسؤول معالجة','Plan Owner','المالية','#ec4899'],
      ['فيصل الزغيبي','Faisal Al-Zaghibi','رائد المخاطر','Risk Champion','HSE','#22c55e'],
    ];
    return `<div id="impModal" style="display:none;position:fixed;inset:0;z-index:60;background:rgba(0,0,0,.5);backdrop-filter:blur(2px);align-items:center;justify-content:center;padding:1rem">
      <div style="background:var(--card);border-radius:1rem;width:100%;max-width:520px;max-height:85vh;display:flex;flex-direction:column;box-shadow:0 24px 48px rgba(0,0,0,.3);overflow:hidden">
        <div style="padding:1rem 1.25rem;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:.65rem">
          <div style="width:2.2rem;height:2.2rem;border-radius:.65rem;background:var(--primary-light);color:var(--primary);display:flex;align-items:center;justify-content:center"><i data-lucide="user-cog" style="width:1.1rem;height:1.1rem"></i></div>
          <div style="flex:1"><h3 style="margin:0;font-size:1rem;font-weight:700" data-ar="عرض النظام كمستخدم آخر" data-en="View as another user">عرض النظام كمستخدم آخر</h3><p class="muted" style="margin:.15rem 0 0;font-size:.72rem" data-ar="ميزة مخصصة لمدير النظام للتحقق من صلاحيات المستخدمين" data-en="Admin feature for verifying user permissions">ميزة مخصصة لمدير النظام للتحقق من صلاحيات المستخدمين</p></div>
          <button id="impClose" style="background:none;border:0;cursor:pointer;color:var(--foreground-secondary);padding:.4rem"><i data-lucide="x"></i></button>
        </div>
        <div style="padding:.85rem 1.25rem;border-bottom:1px solid var(--border)"><div style="position:relative"><i data-lucide="search" style="position:absolute;top:50%;transform:translateY(-50%);inset-inline-start:.75rem;width:1rem;height:1rem;color:var(--foreground-muted)"></i><input class="input" id="impSearch" style="padding-inline-start:2.25rem" data-ar-ph="ابحث عن مستخدم..." data-en-ph="Search user..." placeholder="بحث..."></div></div>
        <div id="impList" style="flex:1;overflow-y:auto;padding:.5rem">
          ${USERS.map(([na,ne,ra,re,da,c],i)=>`<button class="imp-user" data-i="${i}" data-na="${na}" data-ne="${ne}" data-ra="${ra}" data-re="${re}" style="width:100%;display:flex;align-items:center;gap:.85rem;padding:.75rem;border-radius:.7rem;border:1px solid transparent;background:transparent;cursor:pointer;text-align:start;font-family:inherit;transition:all .15s;margin-bottom:.25rem" onmouseover="this.style.background='var(--background-tertiary)'" onmouseout="this.style.background='transparent'">
            <div style="width:2.5rem;height:2.5rem;border-radius:50%;background:${c};color:#fff;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0">${na.charAt(0)}</div>
            <div style="flex:1;min-width:0">
              <p style="margin:0;font-weight:600;font-size:.88rem" data-ar="${na}" data-en="${ne}">${na}</p>
              <p class="muted" style="margin:.1rem 0 0;font-size:.73rem"><span data-ar="${ra}" data-en="${re}">${ra}</span> · <span data-ar="${da}" data-en="${da}">${da}</span></p>
            </div>
            <i data-lucide="chevron-left" class="flip-x" style="width:1rem;height:1rem;color:var(--foreground-muted);flex-shrink:0"></i>
          </button>`).join('')}
        </div>
      </div>
    </div>`;
  }

  // mount
  const root = document.getElementById('app');
  const content = root.innerHTML;
  root.innerHTML = `<div class="erm-wrap">${sidebar()}<div class="erm-main">${banner()}${header()}<main class="page animate-fadeIn">${content}</main></div></div>${impModal()}`;

  // responsive helpers
  const css = document.createElement('style');
  css.textContent = `
    .lg-hide{display:inline-flex;} @media(min-width:1024px){.lg-hide{display:none!important;}}
    .sm-show{display:none;} @media(min-width:640px){.sm-show{display:block;}}
    .md-show{display:none;} @media(min-width:768px){.md-show{display:block;}}
    @keyframes ping{75%,100%{transform:scale(2);opacity:0;}}
  `;
  document.head.appendChild(css);

  // ===== i18n + theme =====
  let lang = localStorage.getItem('erm_lang') || 'ar';
  let theme = localStorage.getItem('erm_theme') || 'light';

  window.ermApplyLang = function(){
    document.documentElement.lang = lang;
    document.documentElement.dir = lang==='ar'?'rtl':'ltr';
    document.querySelectorAll('[data-ar]').forEach(el=>{ if(el.dataset[lang]!==undefined) el.textContent = el.dataset[lang]; });
    document.querySelectorAll('[data-ar-ph]').forEach(el=>{ el.placeholder = lang==='ar'?el.dataset.arPh:el.dataset.enPh; });
    document.querySelectorAll('.lang-btn').forEach(b=>{
      const on=b.dataset.lang===lang; b.style.background=on?'var(--primary)':'transparent'; b.style.color=on?'#fff':'var(--foreground-secondary)';
    });
    localStorage.setItem('erm_lang',lang);
    if(window.ermOnLang) window.ermOnLang(lang);
  };
  function applyTheme(){
    document.documentElement.classList.toggle('dark',theme==='dark');
    document.querySelectorAll('.theme-moon').forEach(e=>e.style.display=theme==='dark'?'none':'inline-flex');
    document.querySelectorAll('.theme-sun').forEach(e=>e.style.display=theme==='dark'?'inline-flex':'none');
    localStorage.setItem('erm_theme',theme);
  }
  window.ermLang = ()=>lang;

  document.addEventListener('click',e=>{
    const lb=e.target.closest('.lang-btn'); if(lb){ lang=lb.dataset.lang; window.ermApplyLang(); if(window.lucide) lucide.createIcons(); }
    if(e.target.closest('#themeBtn')){ theme=theme==='dark'?'light':'dark'; applyTheme(); }
    if(e.target.closest('#menuBtn')){ document.getElementById('sidebar').classList.add('open'); document.getElementById('overlay').style.display='block'; }
    if(e.target.closest('#closeSb')||e.target.id==='overlay'){ document.getElementById('sidebar').classList.remove('open'); document.getElementById('overlay').style.display='none'; }
    // Notifications dropdown
    const np = document.getElementById('notifPanel');
    if(np){
      if(e.target.closest('#notifBtn')){
        np.style.display = np.style.display==='block' ? 'none' : 'block';
      } else if(!e.target.closest('#notifPanel')){
        np.style.display = 'none';
      }
      if(e.target.closest('#notifMarkAll')){
        document.querySelectorAll('.notif-item').forEach(x => x.classList.add('read'));
        const b = document.getElementById('notifBadge'); if(b) b.style.display='none';
      }
    }
    // Impersonation
    if(e.target.closest('#impersonateBtn')){ document.getElementById('impModal').style.display='flex'; }
    if(e.target.closest('#impClose')||e.target.id==='impModal'){ document.getElementById('impModal').style.display='none'; }
    const u=e.target.closest('.imp-user'); if(u){
      document.getElementById('impName').textContent=u.dataset.na;
      document.getElementById('impRole').textContent=u.dataset.ra;
      document.getElementById('impBanner').style.display='flex';
      document.getElementById('impModal').style.display='none';
    }
    if(e.target.closest('#impExit')){ document.getElementById('impBanner').style.display='none'; }
  });
  document.addEventListener('input',e=>{
    if(e.target.id==='impSearch'){
      const q=e.target.value.toLowerCase();
      document.querySelectorAll('.imp-user').forEach(u=>{
        const txt=(u.dataset.na+u.dataset.ne+u.dataset.ra+u.dataset.re).toLowerCase();
        u.style.display=txt.includes(q)?'flex':'none';
      });
    }
  });

  // ===== Real-data loader =====
  // Snapshot version is baked at deploy time so the URL changes whenever the
  // data files change — that gets us cache-busting without forcing a network
  // round trip on every load.
  window.ermData = {};
  const _cache = {};
  const SNAPSHOT_VERSION = '2026-06-17T08:48:10.090Z';
  window.ermLoad = async function(name){
    if(_cache[name]) return _cache[name];
    try{
      // No force-cache — let the browser honor the server's Cache-Control
      // headers + ETag. The ?v=<snapshot> query string changes on every
      // deploy so stale data can never persist across releases.
      const url = `data/${name}.json?v=${encodeURIComponent(SNAPSHOT_VERSION)}`;
      const r = await fetch(url);
      if(!r.ok) throw new Error(r.status);
      const j = await r.json();
      _cache[name] = j;
      window.ermData[name] = j;
      return j;
    }catch(e){ console.warn('ermLoad failed', name, e); return null; }
  };

  // Populate notifications dropdown async
  (async () => {
    const list = await (window.ermLoad ? window.ermLoad('notifications') : null);
    const root = document.getElementById('notifList');
    const badge = document.getElementById('notifBadge');
    if(!root) return;
    if(!list || !list.length){
      root.innerHTML = `<div style="padding:2rem 1rem;text-align:center;color:var(--foreground-muted)"><i data-lucide="bell-off" style="width:1.5rem;height:1.5rem;margin-bottom:.5rem"></i><p style="margin:0;font-size:.8rem" data-ar="لا توجد إشعارات" data-en="No notifications">لا توجد إشعارات</p></div>`;
      if(badge) badge.style.display = 'none';
      if(window.lucide) lucide.createIcons();
      return;
    }
    const unread = list.filter(n => !n.isRead).length;
    if(badge){
      if(unread > 0){ badge.textContent = unread > 99 ? '99+' : unread; badge.style.display = 'flex'; }
      else badge.style.display = 'none';
    }
    const TYPE_ICONS = {
      newRisk: ['alert-triangle','#F39200'],
      risk_approved: ['check-circle','#10b981'],
      risk_rejected: ['x-circle','#ef4444'],
      risk_deferred: ['clock','#f59e0b'],
      risk_revision_requested: ['edit-3','#3b82f6'],
      risk_approval_pending: ['inbox','#a855f7'],
      treatmentDue: ['calendar-clock','#ef4444'],
      residual_risk_approval: ['shield','#a855f7'],
      residual_risk_approved: ['shield-check','#10b981'],
      reviewReminder: ['bell','#3b82f6'],
    };
    function timeAgo(d){
      const lang = window.ermLang ? window.ermLang() : 'ar';
      const diff = (Date.now() - new Date(d).getTime())/1000;
      if(diff<3600) return lang==='ar' ? `منذ ${Math.floor(diff/60)} دقيقة` : `${Math.floor(diff/60)}m ago`;
      if(diff<86400) return lang==='ar' ? `منذ ${Math.floor(diff/3600)} ساعة` : `${Math.floor(diff/3600)}h ago`;
      const d2 = Math.floor(diff/86400);
      return lang==='ar' ? `منذ ${d2} يوم` : `${d2}d ago`;
    }
    root.innerHTML = list.slice(0, 15).map(n => {
      const conf = TYPE_ICONS[n.type] || ['info','#64748b'];
      const ta = (n.titleAr||'').replace(/"/g,'&quot;');
      const te = (n.titleEn||ta).replace(/"/g,'&quot;');
      const ma = (n.messageAr||'').replace(/"/g,'&quot;');
      const me = (n.messageEn||ma).replace(/"/g,'&quot;');
      return `<div class="notif-item ${n.isRead?'read':''}" style="display:flex;gap:.6rem;padding:.7rem 1rem;border-bottom:1px solid var(--border);cursor:pointer;${n.isRead?'opacity:.65':'background:rgba(243,146,0,.04)'}">
        <div style="flex-shrink:0;width:2.1rem;height:2.1rem;border-radius:50%;background:${conf[1]}1f;color:${conf[1]};display:flex;align-items:center;justify-content:center"><i data-lucide="${conf[0]}" style="width:1rem;height:1rem"></i></div>
        <div style="flex:1;min-width:0">
          <p style="margin:0;font-size:.78rem;font-weight:600;color:var(--foreground)" data-ar="${ta}" data-en="${te}">${ta}</p>
          <p style="margin:.15rem 0 0;font-size:.72rem;color:var(--foreground-secondary);line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden" data-ar="${ma}" data-en="${me}">${ma}</p>
          <p style="margin:.2rem 0 0;font-size:.65rem;color:var(--foreground-muted)" data-ar="${timeAgo(n.createdAt)}" data-en="${timeAgo(n.createdAt)}">${timeAgo(n.createdAt)}</p>
        </div>
        ${!n.isRead?'<span style="flex-shrink:0;width:.5rem;height:.5rem;border-radius:50%;background:var(--primary);margin-top:.3rem"></span>':''}
      </div>`;
    }).join('');
    if(window.lucide) lucide.createIcons();
    if(window.ermApplyLang) window.ermApplyLang();
  })();

  if(window.lucide) lucide.createIcons();
  applyTheme();
  window.ermApplyLang();
  if(window.ermInit) window.ermInit();
})();
