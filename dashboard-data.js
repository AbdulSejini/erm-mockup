/* Dashboard dynamic content + responsive grids — driven by real data snapshot */
window.ermInit = async function(){
  const L = ()=>window.ermLang();

  const stats = await window.ermLoad('stats') || {};
  const risks = await window.ermLoad('risks') || [];
  const treatments = await window.ermLoad('treatments') || [];
  const c = stats.counts || {};
  const byRating = stats.byRating || {};
  const byStatus = stats.byStatus || {};

  // responsive grids
  const st=document.createElement('style');
  st.textContent=`
    @media(min-width:640px){#ratingCards{grid-template-columns:repeat(5,1fr)!important;}.hero-stats{grid-template-columns:repeat(4,1fr)!important;}}
    @media(min-width:1024px){#secondaryStats{grid-template-columns:repeat(4,1fr)!important;}#midGrid{grid-template-columns:repeat(3,1fr)!important;}#bottomGrid{grid-template-columns:repeat(2,1fr)!important;}}
  `;
  document.head.appendChild(st);

  // hero quick stats — real numbers
  const totalRisks = c.risks || 0;
  const totalTreatments = c.treatments || 0;
  const completionRate = totalTreatments > 0 ? Math.round(((byStatus.completed||0) / totalTreatments) * 100) : 0;
  const critical = byRating.Critical || 0;
  document.querySelector('.hero-stats').innerHTML = [
    ['إجمالي المخاطر','Total Risks',totalRisks],
    ['خطط المعالجة','Treatment Plans',totalTreatments],
    ['معدل الإنجاز','Completion Rate',completionRate+'%'],
    ['المخاطر الحرجة','Critical',critical],
  ].map(([ar,en,v])=>`<div style="background:rgba(255,255,255,.2);backdrop-filter:blur(4px);border-radius:1rem;padding:1rem;border:1px solid rgba(255,255,255,.2)"><p style="margin:0;color:rgba(255,255,255,.7);font-size:.75rem" data-ar="${ar}" data-en="${en}">${ar}</p><p style="margin:.25rem 0 0;font-size:1.875rem;font-weight:700;color:#fff">${v}</p></div>`).join('');

  // rating cards from real data
  const RT=[
    ['حرج','Critical','20-25','#ef4444','#f43f5e', byRating.Critical||0],
    ['رئيسي','Major','15-19','#f97316','#f59e0b', byRating.Major||0],
    ['متوسط','Moderate','10-14','#facc15','#fbbf24', byRating.Moderate||0],
    ['ثانوي','Minor','5-9','#10b981','#22c55e', byRating.Minor||0],
    ['ضئيل','Negligible','1-4','#0ea5e9','#3b82f6', byRating.Negligible||0]
  ];
  document.getElementById('ratingCards').innerHTML = RT.map(([ar,en,r,c1,c2,v])=>`<div class="card"><div style="padding:.7rem;text-align:center;background:linear-gradient(90deg,${c1},${c2})"><p style="margin:0;color:#fff;font-size:.875rem;font-weight:600" data-ar="${ar}" data-en="${en}">${ar}</p></div><div style="padding:1rem;text-align:center"><p style="margin:0;font-size:2.25rem;font-weight:700;color:${c1}">${v}</p><p class="muted" style="margin:.25rem 0 0;font-size:.75rem">${r}</p></div></div>`).join('');

  // secondary stats — real
  const SC=[
    ['play','خطط قيد التنفيذ','In Progress', byStatus.inProgress||0,'#3b82f6','#6366f1'],
    ['check-circle','خطط مكتملة','Completed', byStatus.completed||0,'#10b981','#22c55e'],
    ['clock','خطط متأخرة','Overdue', byStatus.overdue||0,'#ef4444','#f43f5e'],
    ['users','رواد المخاطر','Risk Champions', c.champions||0,'#a855f7','#8b5cf6']
  ];
  document.getElementById('secondaryStats').innerHTML = SC.map(([ic,ar,en,v,c1,c2])=>`<div class="stat-tile"><div class="glow" style="background:linear-gradient(135deg,${c1},${c2})"></div><div style="position:relative;display:flex;align-items:center;justify-content:space-between"><div><p class="muted" style="margin:0;font-size:.875rem;font-weight:500" data-ar="${ar}" data-en="${en}">${ar}</p><p style="margin:.25rem 0 0;font-size:1.875rem;font-weight:700;color:${c1}">${v}</p></div><div style="display:flex;height:3.5rem;width:3.5rem;align-items:center;justify-content:center;border-radius:1rem;box-shadow:0 8px 16px -4px ${c1}66;background:linear-gradient(135deg,${c1},${c2})"><i data-lucide="${ic}" style="width:1.75rem;height:1.75rem;color:#fff"></i></div></div></div>`).join('');

  // matrix from real heatmap
  const MC = stats.heatmap || {};
  const col=(l,i)=>{const s=l*i;return s>=20?'#dc2626':s>=15?'#f97316':s>=10?'#eab308':s>=5?'#22c55e':'#3b82f6';};
  let mh='';
  for(let l=1;l<=5;l++){mh+=`<div style="display:flex;align-items:center"><div style="display:flex;align-items:center;justify-content:flex-end;padding-inline-end:.5rem;width:52px;height:52px"><span class="muted" style="font-size:.75rem">${l}</span></div><div style="display:flex">`;for(let i=1;i<=5;i++){const cnt=MC[`${l}-${i}`]||0;mh+=`<div class="matrix-cell" style="background:${col(l,i)}">${cnt||''}</div>`;}mh+=`</div></div>`;}
  document.getElementById('matrix').innerHTML=mh;
  document.getElementById('xaxis').innerHTML=[1,2,3,4,5].map(i=>`<div style="display:flex;align-items:flex-start;justify-content:center;padding-top:.5rem;width:52px"><span class="muted" style="font-size:.75rem">${i}</span></div>`).join('');
  document.getElementById('legend').innerHTML=[['#dc2626','حرج','Critical'],['#f97316','مرتفع','High'],['#eab308','متوسط','Medium'],['#22c55e','منخفض','Low'],['#3b82f6','ضئيل','Negligible']].map(([c,ar,en])=>`<div style="display:flex;align-items:center;gap:.375rem"><div style="height:.75rem;width:.75rem;border-radius:.25rem;background:${c}"></div><span class="muted" style="font-size:.75rem" data-ar="${ar}" data-en="${en}">${ar}</span></div>`).join('');

  // deadlines — upcoming treatment plans
  const today = new Date();
  const upcoming = treatments
    .filter(t => t.dueDate && t.status !== 'completed')
    .map(t => ({ ...t, daysLeft: Math.round((new Date(t.dueDate) - today) / 86400000) }))
    .sort((a,b) => a.daysLeft - b.daysLeft)
    .slice(0, 4);
  document.getElementById('deadlines').innerHTML = upcoming.map(t => {
    const p = t.progress || 0;
    const pc = p>=80?'#10b981':p>=50?'#f59e0b':'#ef4444';
    const d = t.daysLeft;
    const c = d<0?'#dc2626':d<7?'#ef4444':d<30?'#f59e0b':'#3b82f6';
    const la = d<0?`متأخر ${Math.abs(d)}d`:`${d} يوم`;
    const le = d<0?`${Math.abs(d)}d late`:`${d}d`;
    const ta = (t.titleAr||'—').replace(/"/g,'&quot;');
    const te = (t.titleEn||ta).replace(/"/g,'&quot;');
    return `<a href="treatment-detail.html?id=${t.id}" style="display:block;border-radius:.75rem;padding:.75rem;text-decoration:none;border:1px solid var(--border);background:var(--background-tertiary)"><div style="display:flex;align-items:flex-start;justify-content:space-between;gap:.5rem"><div style="flex:1;min-width:0"><p style="margin:0;font-size:.875rem;font-weight:500;color:var(--foreground)" data-ar="${ta}" data-en="${te}">${ta}</p><div style="display:flex;gap:.5rem;margin-top:.25rem"><code class="mono">${t.riskNumber||'—'}</code></div><div style="margin-top:.5rem"><div style="display:flex;justify-content:space-between;font-size:.75rem;margin-bottom:.25rem" class="muted"><span data-ar="التقدم" data-en="Progress">التقدم</span><span>${p}%</span></div><div class="progress"><span style="width:${p}%;background:${pc}"></span></div></div></div><div style="flex-shrink:0;border-radius:.75rem;padding:.4rem .6rem;font-size:.75rem;font-weight:700;color:#fff;background:${c}"><span data-ar="${la}" data-en="${le}">${la}</span></div></div></a>`;
  }).join('');

  // recent risks — top 5
  const recent = risks.slice(0,5);
  const RATING={Critical:['حرج','Critical','#ef4444'],Major:['رئيسي','Major','#f97316'],Moderate:['متوسط','Moderate','#eab308'],Minor:['ثانوي','Minor','#22c55e'],Negligible:['ضئيل','Negligible','#3b82f6']};
  document.getElementById('recentRisks').innerHTML=recent.map(r=>{
    const ratInfo = RATING[r.inherentRating] || ['—','—','#64748b'];
    const [ra,re,c] = ratInfo;
    const t = r.treatmentCount > 0;
    const ta = (r.titleAr||'—').replace(/"/g,'&quot;');
    const te = (r.titleEn||ta).replace(/"/g,'&quot;');
    const dt = r.createdAt ? new Date(r.createdAt).toISOString().slice(0,10) : '—';
    return `<tr style="cursor:pointer" onclick="window.location.href='risk-detail.html?id=${r.id}'"><td><code class="mono">${r.riskNumber||'—'}</code></td><td><p style="margin:0;font-weight:500;color:var(--foreground)" data-ar="${ta}" data-en="${te}">${ta}</p><p class="muted" style="margin:.1rem 0 0;font-size:.75rem" data-ar="${r.departmentAr||'—'}" data-en="${r.departmentEn||r.departmentAr||'—'}">${r.departmentAr||'—'}</p></td><td><span class="chip" style="background:${c}1f;color:${c}" data-ar="${ra}" data-en="${re}">${ra}</span></td><td>${t?`<span style="display:inline-flex;align-items:center;gap:.25rem;color:#10b981"><i data-lucide="check-circle" style="width:1rem;height:1rem"></i><span style="font-size:.75rem" data-ar="نعم" data-en="Yes">نعم</span></span>`:`<span style="display:inline-flex;align-items:center;gap:.25rem;color:var(--foreground-muted)"><i data-lucide="x-circle" style="width:1rem;height:1rem"></i><span style="font-size:.75rem" data-ar="لا" data-en="No">لا</span></span>`}</td><td class="muted" data-ar="${r.championName||'—'}" data-en="${r.championNameEn||r.championName||'—'}">${r.championName||'—'}</td><td class="muted">${dt}</td></tr>`;
  }).join('');

  // treatment status from real byStatus
  const total = c.treatments || 0;
  const TS=[
    ['لم يبدأ','Not Started', byStatus.notStarted||0,'#64748b','circle-dot'],
    ['قيد التنفيذ','In Progress', byStatus.inProgress||0,'#3b82f6','play'],
    ['مكتمل','Completed', byStatus.completed||0,'#10b981','check-circle-2'],
    ['متأخر','Overdue', byStatus.overdue||0,'#ef4444','clock']
  ];
  const mxV = Math.max(...TS.map(t => t[2]), 1);
  document.getElementById('treatmentStatus').innerHTML=TS.map(([ar,en,v,c,ic])=>`<div style="display:flex;align-items:center;gap:.75rem"><div style="padding:.5rem;border-radius:.5rem;background:${c}33"><i data-lucide="${ic}" style="width:1rem;height:1rem;color:${c}"></i></div><div style="flex:1"><div style="display:flex;justify-content:space-between;margin-bottom:.25rem"><span class="muted" style="font-size:.875rem" data-ar="${ar}" data-en="${en}">${ar}</span><span style="font-size:.875rem;font-weight:700;color:var(--foreground)">${v}</span></div><div class="progress"><span style="width:${(v/mxV)*100}%;background:${c}"></span></div></div></div>`).join('')+`<div style="margin-top:1rem;padding-top:1rem;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center"><span class="muted" style="font-size:.875rem" data-ar="معدل الإنجاز الكلي" data-en="Overall Completion Rate">معدل الإنجاز الكلي</span><span style="font-size:1.5rem;font-weight:700;color:var(--primary)">${completionRate}%</span></div>`;

  // quick actions
  const QA=[
    ['alert-triangle','تسجيل خطر جديد','Register New Risk','إضافة خطر للسجل','Add risk to register','#f97316','#f59e0b','risk-new.html'],
    ['target','متابعة المخاطر','Track Risks','متابعة حسب الإدارة','Track by department','#3b82f6','#6366f1','tracking.html'],
    ['wrench','خطط المعالجة','Treatment Plans',`${byStatus.inProgress||0} قيد التنفيذ`,`${byStatus.inProgress||0} in progress`,'#10b981','#22c55e','treatment.html'],
    ['file-text','التقارير','Reports','عرض تقارير المخاطر','View risk reports','#a855f7','#8b5cf6','reports.html'],
    ['users','رواد المخاطر','Risk Champions',`${c.champions||0} رائد نشط`,`${c.champions||0} active`,'#f59e0b','#eab308','champions.html']
  ];
  document.getElementById('quickActions').innerHTML=QA.map(([ic,ta,te,sa,se,c1,c2,href])=>`<a href="${href}" style="display:flex;align-items:center;gap:.75rem;padding:.75rem;border-radius:.75rem;text-decoration:none;border:1px solid var(--border)"><div style="display:flex;height:2.5rem;width:2.5rem;align-items:center;justify-content:center;border-radius:.75rem;color:#fff;box-shadow:0 4px 8px rgba(0,0,0,.15);background:linear-gradient(135deg,${c1},${c2})"><i data-lucide="${ic}" style="width:1.25rem;height:1.25rem"></i></div><div style="flex:1"><p style="margin:0;font-size:.875rem;font-weight:500;color:var(--foreground)" data-ar="${ta}" data-en="${te}">${ta}</p><p class="muted" style="margin:.1rem 0 0;font-size:.75rem" data-ar="${sa}" data-en="${se}">${sa}</p></div><i data-lucide="chevron-right" class="flip-x" style="width:1.25rem;height:1.25rem;color:var(--foreground-muted)"></i></a>`).join('');

  // ===== Monthly Report PDF =====
  const monthlyBtn = document.getElementById('monthlyReportBtn');
  if(monthlyBtn){
    monthlyBtn.addEventListener('click', () => {
      const isAr = window.ermLang() === 'ar';
      const monthName = isAr ? 'يونيو 2026' : 'June 2026';
      const monthlyKPIs = [
        { lbl_ar:'إجمالي المخاطر', lbl_en:'Total Risks', val: totalRisks },
        { lbl_ar:'خطط معالجة', lbl_en:'Treatment Plans', val: totalTreatments },
        { lbl_ar:'حرجة', lbl_en:'Critical', val: critical },
        { lbl_ar:'معدل الإنجاز', lbl_en:'Completion Rate', val: completionRate + '%' },
      ];
      const ratingRows_ar = RT.map(([ar,en,r,c1,c2,v])=>`<tr><td>${ar}</td><td>${r}</td><td>${v}</td></tr>`).join('');
      const ratingRows_en = RT.map(([ar,en,r,c1,c2,v])=>`<tr><td>${en}</td><td>${r}</td><td>${v}</td></tr>`).join('');
      const recentRows_ar = recent.slice(0,10).map(r=>`<tr><td>${r.riskNumber||'—'}</td><td>${r.titleAr||'—'}</td><td>${r.departmentAr||'—'}</td><td>${window.ermRatingPill(r.inherentRating)}</td><td>${r.residualScore||'—'}</td></tr>`).join('');
      const recentRows_en = recent.slice(0,10).map(r=>`<tr><td>${r.riskNumber||'—'}</td><td>${r.titleEn||r.titleAr||'—'}</td><td>${r.departmentEn||r.departmentAr||'—'}</td><td>${window.ermRatingPill(r.inherentRating)}</td><td>${r.residualScore||'—'}</td></tr>`).join('');
      const overdueList = upcoming.filter(t=>t.daysLeft<0).slice(0,5);
      const overdueRows_ar = overdueList.length ? overdueList.map(t=>`<tr><td>${t.riskNumber||'—'}</td><td>${t.titleAr||'—'}</td><td>${t.progress||0}%</td><td>${Math.abs(t.daysLeft)} يوم</td></tr>`).join('') : `<tr><td colspan="4" style="text-align:center;color:#64748b">لا توجد خطط متأخرة</td></tr>`;
      const overdueRows_en = overdueList.length ? overdueList.map(t=>`<tr><td>${t.riskNumber||'—'}</td><td>${t.titleEn||t.titleAr||'—'}</td><td>${t.progress||0}%</td><td>${Math.abs(t.daysLeft)} days</td></tr>`).join('') : `<tr><td colspan="4" style="text-align:center;color:#64748b">No overdue plans</td></tr>`;

      window.ermPrintPDF({
        title_ar: 'التقرير الشهري — ' + monthName,
        title_en: 'Monthly Risk Report — ' + monthName,
        subtitle_ar: 'لمحة تنفيذية عن المخاطر المؤسسية وخطط المعالجة',
        subtitle_en: 'Executive snapshot of enterprise risks and treatment plans',
        sections: [
          {
            title_ar: 'مؤشرات الأداء الرئيسية',
            title_en: 'Key Performance Indicators',
            html_ar: `<div class="erm-grid cols-4">${monthlyKPIs.map(k=>`<div class="erm-kpi"><div class="lbl">${k.lbl_ar}</div><div class="val">${k.val}</div></div>`).join('')}</div>`,
            html_en: `<div class="erm-grid cols-4">${monthlyKPIs.map(k=>`<div class="erm-kpi"><div class="lbl">${k.lbl_en}</div><div class="val">${k.val}</div></div>`).join('')}</div>`,
          },
          {
            title_ar: 'توزيع المخاطر حسب التصنيف',
            title_en: 'Risk Distribution by Rating',
            html_ar: `<table class="erm-table"><thead><tr><th>التصنيف</th><th>المدى</th><th>العدد</th></tr></thead><tbody>${ratingRows_ar}</tbody></table>`,
            html_en: `<table class="erm-table"><thead><tr><th>Rating</th><th>Range</th><th>Count</th></tr></thead><tbody>${ratingRows_en}</tbody></table>`,
          },
          {
            title_ar: 'حالة خطط المعالجة',
            title_en: 'Treatment Plan Status',
            html_ar: `<table class="erm-table"><thead><tr><th>الحالة</th><th>العدد</th></tr></thead><tbody>${TS.map(([ar,en,v])=>`<tr><td>${ar}</td><td>${v}</td></tr>`).join('')}</tbody></table>`,
            html_en: `<table class="erm-table"><thead><tr><th>Status</th><th>Count</th></tr></thead><tbody>${TS.map(([ar,en,v])=>`<tr><td>${en}</td><td>${v}</td></tr>`).join('')}</tbody></table>`,
          },
          {
            title_ar: 'أعلى 10 مخاطر',
            title_en: 'Top 10 Risks',
            html_ar: `<table class="erm-table"><thead><tr><th>الرقم</th><th>العنوان</th><th>الإدارة</th><th>التصنيف</th><th>المتبقي</th></tr></thead><tbody>${recentRows_ar}</tbody></table>`,
            html_en: `<table class="erm-table"><thead><tr><th>ID</th><th>Title</th><th>Department</th><th>Rating</th><th>Residual</th></tr></thead><tbody>${recentRows_en}</tbody></table>`,
          },
          {
            title_ar: 'الخطط المتأخرة',
            title_en: 'Overdue Plans',
            html_ar: `<table class="erm-table"><thead><tr><th>الخطر</th><th>الخطة</th><th>التقدم</th><th>التأخير</th></tr></thead><tbody>${overdueRows_ar}</tbody></table>`,
            html_en: `<table class="erm-table"><thead><tr><th>Risk</th><th>Plan</th><th>Progress</th><th>Days late</th></tr></thead><tbody>${overdueRows_en}</tbody></table>`,
          },
        ],
      });
    });
  }

  if(window.lucide) lucide.createIcons();
  window.ermApplyLang();
};
