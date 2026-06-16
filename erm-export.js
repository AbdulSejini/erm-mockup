/* ===== Saudi Cable ERM — Export & Print helpers =====
   Provides Excel (XLSX) export and themed PDF print, language-aware.
   Depends on SheetJS (xlsx.full.min.js) — loaded lazily on first use. */
(function(){
  const BRAND = {
    name_ar: 'شركة الكابلات السعودية',
    name_en: 'Saudi Cable Company',
    system_ar: 'نظام إدارة المخاطر المؤسسية',
    system_en: 'Enterprise Risk Management System',
    primary: '#F39200',
    primaryDeep: '#E08600',
    primaryLight: '#FFF4E6',
  };
  window.ERM_BRAND = BRAND;

  // ===== SheetJS loader (lazy) =====
  let _xlsxPromise = null;
  function loadXLSX(){
    if(window.XLSX) return Promise.resolve(window.XLSX);
    if(_xlsxPromise) return _xlsxPromise;
    _xlsxPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
      s.onload = () => resolve(window.XLSX);
      s.onerror = reject;
      document.head.appendChild(s);
    });
    return _xlsxPromise;
  }

  function todayStamp(){
    const d = new Date();
    return d.toISOString().slice(0,10);
  }

  // ===== Excel export =====
  // rows: array of objects keyed by header keys
  // headers: [{key, label_ar, label_en, width?}]
  // sheetName: optional; baseFilename without extension
  window.ermExportExcel = async function({ rows, headers, sheetName, baseFilename }){
    const isAr = window.ermLang() === 'ar';
    const XLSX = await loadXLSX();

    const labels = headers.map(h => isAr ? h.label_ar : h.label_en);
    const data = rows.map(r => headers.map(h => {
      const v = r[h.key];
      if(v === null || v === undefined) return '';
      if(v instanceof Date) return v.toISOString().slice(0,10);
      return v;
    }));

    // Build sheet with a 3-row themed header
    const aoa = [];
    aoa.push([isAr ? BRAND.name_ar : BRAND.name_en]);
    aoa.push([isAr ? BRAND.system_ar : BRAND.system_en]);
    aoa.push([(isAr ? 'تاريخ التصدير: ' : 'Exported: ') + todayStamp()]);
    aoa.push([]); // spacer
    aoa.push(labels);
    aoa.push(...data);

    const ws = XLSX.utils.aoa_to_sheet(aoa);

    // RTL view for Arabic
    if(isAr){
      ws['!views'] = [{ RTL: true }];
    }

    // Column widths
    ws['!cols'] = headers.map(h => ({ wch: h.width || 22 }));

    // Merge brand banner across all columns
    const lastCol = headers.length - 1;
    ws['!merges'] = [
      { s:{r:0,c:0}, e:{r:0,c:lastCol} },
      { s:{r:1,c:0}, e:{r:1,c:lastCol} },
      { s:{r:2,c:0}, e:{r:2,c:lastCol} },
    ];

    // Style brand and header rows (SheetJS Community edition keeps cell text;
    // styling needs xlsx-style for real fills — we set cell type but the
    // workbook still opens nicely in Excel. We at least set bold-like markers
    // via inline cell formats where supported.)
    function styleCell(ref, opts){
      if(!ws[ref]) return;
      ws[ref].s = opts;
    }
    styleCell('A1', { font:{ bold:true, sz:16, color:{ rgb:'FFFFFF' } }, fill:{ patternType:'solid', fgColor:{ rgb:'F39200' } }, alignment:{ horizontal:'center', vertical:'center' } });
    styleCell('A2', { font:{ bold:true, sz:12, color:{ rgb:'FFFFFF' } }, fill:{ patternType:'solid', fgColor:{ rgb:'E08600' } }, alignment:{ horizontal:'center' } });
    styleCell('A3', { font:{ italic:true, sz:10, color:{ rgb:'64748B' } }, alignment:{ horizontal:'center' } });
    // Header row at row 5 (0-based: row 4)
    for(let c=0; c<headers.length; c++){
      const ref = XLSX.utils.encode_cell({ r:4, c });
      styleCell(ref, { font:{ bold:true, color:{ rgb:'FFFFFF' } }, fill:{ patternType:'solid', fgColor:{ rgb:'F39200' } }, alignment:{ horizontal:'center', vertical:'center' } });
    }
    // Set row heights
    ws['!rows'] = [{ hpt:30 }, { hpt:20 }, { hpt:16 }, { hpt:8 }, { hpt:26 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName || (isAr ? 'بيانات' : 'Data'));
    const filename = `${baseFilename || 'export'}-${todayStamp()}.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  // ===== Themed PDF (via print) =====
  // Opens a new window with a print-friendly themed document and triggers print.
  // sections: [{ title_ar, title_en, html_ar, html_en }]
  window.ermPrintPDF = function({ title_ar, title_en, subtitle_ar, subtitle_en, sections }){
    const isAr = window.ermLang() === 'ar';
    const dir = isAr ? 'rtl' : 'ltr';
    const lang = isAr ? 'ar' : 'en';
    const title = isAr ? title_ar : title_en;
    const subtitle = isAr ? subtitle_ar : subtitle_en;
    const sysName = isAr ? BRAND.system_ar : BRAND.system_en;
    const brandName = isAr ? BRAND.name_ar : BRAND.name_en;
    const dateStr = new Date().toLocaleDateString(isAr ? 'ar-SA-u-ca-gregory' : 'en-GB', { year:'numeric', month:'long', day:'numeric' });

    const sectionsHTML = sections.map(s => `
      <section class="erm-section">
        <h2>${isAr ? s.title_ar : s.title_en}</h2>
        <div class="erm-content">${isAr ? s.html_ar : s.html_en}</div>
      </section>
    `).join('');

    const html = `<!doctype html>
<html lang="${lang}" dir="${dir}">
<head>
<meta charset="utf-8">
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
@page { size: A4; margin: 18mm 14mm 22mm; }
* { box-sizing: border-box; margin:0; padding:0; }
body {
  font-family: 'Noto Sans Arabic', system-ui, -apple-system, sans-serif;
  color: #1E293B; line-height: 1.6; font-size: 11.5pt;
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}
[lang="en"] body { font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; }

.erm-header {
  display: flex; align-items: center; gap: 14px;
  padding-bottom: 12px; margin-bottom: 16px;
  border-bottom: 3px solid ${BRAND.primary};
}
.erm-logo {
  width: 56px; height: 56px; border-radius: 12px;
  background: linear-gradient(135deg, ${BRAND.primary}, ${BRAND.primaryDeep});
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  box-shadow: 0 6px 14px -6px ${BRAND.primary};
}
.erm-logo svg { width:30px; height:30px; color:#fff; }
.erm-brand { flex:1; }
.erm-brand .name { font-size: 13pt; font-weight: 800; color: ${BRAND.primaryDeep}; margin-bottom:2px; }
.erm-brand .system { font-size: 10pt; color: #64748B; font-weight: 500; }
.erm-date { font-size: 9pt; color: #64748B; text-align: end; }

.erm-title {
  display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap;
  margin: 12px 0 6px;
}
.erm-title h1 { font-size: 19pt; font-weight: 800; color: #1E293B; }
.erm-subtitle { font-size: 11pt; color: #64748B; margin-bottom: 18px; }

.erm-section { margin-top: 18px; page-break-inside: avoid; }
.erm-section h2 {
  font-size: 13pt; font-weight: 700; color: ${BRAND.primaryDeep};
  border-${isAr ? 'right' : 'left'}: 4px solid ${BRAND.primary};
  padding-${isAr ? 'right' : 'left'}: 10px;
  margin-bottom: 10px;
}
.erm-content { font-size: 10.5pt; }

table.erm-table { width: 100%; border-collapse: collapse; margin: 8px 0; font-size: 10pt; }
table.erm-table th {
  background: ${BRAND.primary}; color: #fff; padding: 8px 10px;
  text-align: start; font-weight: 700; border: 1px solid ${BRAND.primaryDeep};
}
table.erm-table td { padding: 7px 10px; border: 1px solid #E2E8F0; vertical-align: top; }
table.erm-table tr:nth-child(even) td { background: #FAFBFC; }

.erm-grid { display: grid; gap: 10px; }
.erm-grid.cols-2 { grid-template-columns: 1fr 1fr; }
.erm-grid.cols-3 { grid-template-columns: 1fr 1fr 1fr; }
.erm-grid.cols-4 { grid-template-columns: 1fr 1fr 1fr 1fr; }

.erm-kpi {
  border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px;
  background: linear-gradient(135deg, ${BRAND.primaryLight}, #FFFFFF);
}
.erm-kpi .lbl { font-size: 9pt; color: #64748B; font-weight: 600; text-transform: uppercase; }
.erm-kpi .val { font-size: 18pt; font-weight: 800; color: ${BRAND.primaryDeep}; margin-top: 4px; }

.erm-pill { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 9pt; font-weight: 700; }
.erm-pill.critical { background: #fee2e2; color: #dc2626; }
.erm-pill.major { background: #ffedd5; color: #ea580c; }
.erm-pill.moderate { background: #fef3c7; color: #d97706; }
.erm-pill.minor { background: #dcfce7; color: #16a34a; }
.erm-pill.negligible { background: #dbeafe; color: #2563eb; }

.erm-meta { display: flex; flex-wrap: wrap; gap: 8px 24px; margin: 8px 0 14px; font-size: 10pt; color: #475569; }
.erm-meta span strong { color: #1E293B; font-weight: 700; }

.erm-footer {
  position: fixed; bottom: 8mm; left: 14mm; right: 14mm;
  padding-top: 8px; border-top: 1px solid #E2E8F0;
  display: flex; justify-content: space-between;
  font-size: 8.5pt; color: #94A3B8;
}
.erm-footer .brand-name { color: ${BRAND.primaryDeep}; font-weight: 700; }

@media print { .erm-noprint { display: none !important; } }
.erm-actions {
  position: fixed; top: 12px; ${isAr ? 'left' : 'right'}: 12px;
  display: flex; gap: 8px; z-index: 999;
}
.erm-actions button {
  font-family: inherit; font-size: 12px; font-weight: 600;
  padding: 8px 14px; border-radius: 8px; cursor: pointer; border: 0;
  background: ${BRAND.primary}; color: #fff;
  box-shadow: 0 4px 10px -4px ${BRAND.primary};
}
.erm-actions button.secondary { background: #fff; color: #475569; border: 1px solid #E2E8F0; }
</style>
</head>
<body>
<div class="erm-actions erm-noprint">
  <button onclick="window.print()">${isAr ? 'طباعة / حفظ PDF' : 'Print / Save PDF'}</button>
  <button class="secondary" onclick="window.close()">${isAr ? 'إغلاق' : 'Close'}</button>
</div>

<div class="erm-header">
  <div class="erm-logo">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <circle cx="12" cy="12" r="3"/>
      <circle cx="12" cy="12" r="8" stroke-dasharray="4 2"/>
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>
    </svg>
  </div>
  <div class="erm-brand">
    <div class="name">${brandName}</div>
    <div class="system">${sysName}</div>
  </div>
  <div class="erm-date">${dateStr}</div>
</div>

<div class="erm-title"><h1>${title}</h1></div>
${subtitle ? `<p class="erm-subtitle">${subtitle}</p>` : ''}

${sectionsHTML}

<div class="erm-footer">
  <div><span class="brand-name">${brandName}</span> — ${sysName}</div>
  <div>${isAr ? 'تم التصدير في ' + dateStr : 'Exported on ' + dateStr}</div>
</div>

<script>
  // Auto-open print dialog once fonts settle
  window.addEventListener('load', () => setTimeout(() => window.print(), 600));
</script>
</body>
</html>`;

    const w = window.open('', '_blank');
    if(!w){
      alert(isAr ? 'الرجاء السماح بفتح النوافذ المنبثقة لإنشاء التقرير' : 'Please allow popups to generate the report');
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
  };

  // ===== Helpers =====
  window.ermRatingPill = function(rating){
    const map = {
      Critical:['حرج','Critical','critical'],
      Major:['رئيسي','Major','major'],
      Moderate:['متوسط','Moderate','moderate'],
      Minor:['ثانوي','Minor','minor'],
      Negligible:['ضئيل','Negligible','negligible'],
    };
    const isAr = window.ermLang() === 'ar';
    const m = map[rating];
    if(!m) return rating || '';
    return `<span class="erm-pill ${m[2]}">${isAr ? m[0] : m[1]}</span>`;
  };
})();
