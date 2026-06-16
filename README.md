# ERM-System — نظام إدارة المخاطر المؤسسية | Saudi Cable

موقع مستقل وكامل (Static Site) لنظام إدارة المخاطر المؤسسية، يعمل بدون خادم — يكفي فتح `index.html`.

## نقطة الدخول
- `index.html` → يحوّل إلى `login.html` (صفحة تسجيل الدخول)
- زر **تسجيل الدخول** ينقل إلى `dashboard.html`

## الصفحات (15)
dashboard · risks · risk-approvals · assessment · tracking · treatment · treatment-monitoring · compliance · compliance-calendar · incidents · audit · champions · discussions · reports · settings

## المزايا
- **نمطان**: نهاري / ليلي 🌙 — **ولغتان**: عربي (RTL) / إنجليزي (LTR)
- المبدّلات في الترويسة، والاختيار يُحفظ تلقائياً عبر كل الصفحات
- شريط جانبي موحّد يربط جميع الصفحات
- كل الأرقام لاتينية (0–9)

## الملفات المشتركة
- `erm-shell.css` — الألوان والمكوّنات (هوية النظام)
- `erm-shell.js` — الشريط الجانبي + الترويسة + الترجمة + الوضع
- `dashboard-data.js` — بيانات لوحة المعلومات

## ملاحظات
- الخطوط: Noto Sans Arabic (من Google Fonts) + الأيقونات: Lucide (CDN) — يتطلب اتصال إنترنت لعرضهما.
- البيانات المعروضة نموذجية للعرض؛ الربط بقاعدة بيانات حقيقية يحتاج تطويراً برمجياً (Next.js/Prisma كما في المستودع الأصلي).
