import { PrismaClient } from '/Users/abdulelahsejini/Documents/erm-system/node_modules/@prisma/client';
import { mkdirSync, writeFileSync } from 'fs';
const prisma = new PrismaClient();

async function main() {
  const outDir = '/Users/abdulelahsejini/Desktop/ERM-System/data';
  mkdirSync(outDir, { recursive: true });

  console.log('Fetching risks...');
  const risks = await prisma.risk.findMany({
    where: { isDeleted: false },
    include: {
      department: { select: { id:true, nameAr:true, nameEn:true, code:true } },
      category: { select: { nameAr:true, nameEn:true } },
      riskOwner: { select: { id:true, fullName:true, fullNameEn:true, email:true } },
      champion: { select: { id:true, fullName:true, fullNameEn:true, email:true } },
      owner: { select: { id:true, fullName:true, fullNameEn:true, email:true } },
      treatments: { select: { id:true, status:true, progress:true } },
    },
    orderBy: [{ residualScore:'desc' }, { createdAt:'desc' }],
  });

  console.log('Fetching treatment plans...');
  const treatments = await prisma.treatmentPlan.findMany({
    include: {
      risk: { select: { id:true, riskNumber:true, titleAr:true, titleEn:true,
        department: { select:{ nameAr:true, nameEn:true } },
        inherentScore:true, residualScore:true, inherentRating:true, residualRating:true } },
      responsible: { select: { fullName:true, fullNameEn:true, email:true } },
      monitor: { select: { fullName:true, fullNameEn:true, email:true } },
      riskOwner: { select: { fullName:true, fullNameEn:true, email:true } },
      tasks: { select: { id:true, status:true, titleAr:true, titleEn:true, dueDate:true,
        actionOwner:{ select:{ fullName:true, fullNameEn:true, email:true } },
        monitorOwner:{ select:{ fullName:true, fullNameEn:true, email:true } }
      }},
    },
    orderBy: { createdAt: 'desc' },
  });

  console.log('Fetching departments...');
  const departments = await prisma.department.findMany({
    include: {
      _count: { select: { risks: { where:{ isDeleted:false } } } },
    },
  });

  console.log('Fetching champions...');
  const champions = await prisma.user.findMany({
    where: { role: 'riskChampion', status: 'active' },
    select: { id:true, fullName:true, fullNameEn:true, email:true,
      department: { select: { nameAr:true, nameEn:true } },
      _count: { select: { championRisks: { where:{ isDeleted:false } }, responsibleTreatments:true } } },
  });

  console.log('Fetching risk approval requests...');
  const approvals = await prisma.riskApprovalRequest.findMany({
    include: {
      risk: { select: { id:true, riskNumber:true, titleAr:true, titleEn:true,
        category: { select:{ nameAr:true, nameEn:true } },
        department: { select:{ nameAr:true, nameEn:true } },
        inherentScore:true, inherentRating:true } },
      requester: { select: { fullName:true, fullNameEn:true, email:true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  console.log('Fetching discussions...');
  const allDiscussions = await prisma.treatmentDiscussion.findMany({
    take: 30,
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { fullName:true, fullNameEn:true, email:true } },
      treatmentPlan: { select: { id:true, titleAr:true, titleEn:true,
        risk: { select:{ riskNumber:true } } } },
    },
  });

  console.log('Fetching notifications...');
  const notifications = await prisma.notification.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    select: { id:true, type:true, titleAr:true, titleEn:true, messageAr:true, messageEn:true, isRead:true, link:true, createdAt:true },
  });

  console.log('Fetching incidents...');
  const incidents = await prisma.incident.findMany({
    take: 20,
    orderBy: { incidentDate: 'desc' },
    include: {
      department: { select: { nameAr:true, nameEn:true } },
      reportedBy: { select: { fullName:true, fullNameEn:true } },
    },
  });

  // ===== Aggregated stats =====
  const byRating: Record<string, number> = {};
  const byStrategy: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  const byDept: Record<string, { ar:string; en:string; total:number; critical:number; major:number; moderate:number; minor:number; negligible:number; withPlans:number; mitigated:number; inhAvg:number; resAvg:number; inhSum:number; resSum:number } > = {};

  for (const r of risks) {
    byRating[r.residualRating || 'Unknown'] = (byRating[r.residualRating || 'Unknown']||0) + 1;
    const k = r.department?.id || 'none';
    if (!byDept[k]) byDept[k] = { ar:r.department?.nameAr||'—', en:r.department?.nameEn||'—', total:0, critical:0, major:0, moderate:0, minor:0, negligible:0, withPlans:0, mitigated:0, inhAvg:0, resAvg:0, inhSum:0, resSum:0 };
    const d = byDept[k];
    d.total++;
    d.inhSum += r.inherentScore || 0;
    d.resSum += r.residualScore || 0;
    if (r.residualRating === 'Critical') d.critical++;
    else if (r.residualRating === 'Major') d.major++;
    else if (r.residualRating === 'Moderate') d.moderate++;
    else if (r.residualRating === 'Minor') d.minor++;
    else if (r.residualRating === 'Negligible') d.negligible++;
    if (r.treatments.length > 0) d.withPlans++;
    if (r.treatments.some(t => t.status === 'completed')) d.mitigated++;
  }
  for (const d of Object.values(byDept)) {
    d.inhAvg = d.total > 0 ? +(d.inhSum/d.total).toFixed(1) : 0;
    d.resAvg = d.total > 0 ? +(d.resSum/d.total).toFixed(1) : 0;
  }
  for (const t of treatments) {
    byStrategy[t.strategy] = (byStrategy[t.strategy]||0) + 1;
    byStatus[t.status] = (byStatus[t.status]||0) + 1;
  }

  // 5x5 heatmap
  const heatmap: Record<string, number> = {};
  for (const r of risks) {
    const l = r.residualLikelihood, i = r.residualImpact;
    if (l>=1&&l<=5&&i>=1&&i<=5) {
      const k = `${l}-${i}`; heatmap[k] = (heatmap[k]||0) + 1;
    }
  }

  const stats = {
    snapshotAt: new Date().toISOString(),
    counts: {
      risks: risks.length,
      treatments: treatments.length,
      tasks: treatments.reduce((a,t)=>a+t.tasks.length,0),
      departments: departments.length,
      champions: champions.length,
      incidents: incidents.length,
    },
    byRating,
    byStrategy,
    byStatus,
    byDepartment: Object.values(byDept).sort((a,b)=>b.total-a.total),
    heatmap,
    topRisks: risks.slice(0,10).map(r=>({
      id: r.id, riskNumber: r.riskNumber,
      titleAr: r.titleAr, titleEn: r.titleEn,
      departmentAr: r.department?.nameAr, departmentEn: r.department?.nameEn,
      inherentScore: r.inherentScore, inherentRating: r.inherentRating,
      residualScore: r.residualScore, residualRating: r.residualRating,
    })),
    overdue: treatments.filter(t => t.status === 'overdue').length,
    completionRate: treatments.length > 0
      ? Math.round((treatments.filter(t=>t.status==='completed').length / treatments.length) * 100)
      : 0,
    avgReduction: risks.length > 0
      ? Math.round((risks.reduce((a,r)=>a+(r.inherentScore-r.residualScore),0)/risks.reduce((a,r)=>a+r.inherentScore,0))*100)
      : 0,
  };

  // Trim data for client size
  const trimmedRisks = risks.map(r => ({
    id: r.id, riskNumber: r.riskNumber,
    titleAr: r.titleAr, titleEn: r.titleEn,
    descriptionAr: r.descriptionAr, descriptionEn: r.descriptionEn,
    causeAr: r.causeAr, causeEn: r.causeEn,
    impactAr: r.impactAr, impactEn: r.impactEn,
    existingControlsAr: r.existingControlsAr, existingControlsEn: r.existingControlsEn,
    departmentAr: r.department?.nameAr, departmentEn: r.department?.nameEn,
    categoryAr: r.category?.nameAr, categoryEn: r.category?.nameEn,
    status: r.status,
    inherentLikelihood: r.inherentLikelihood, inherentImpact: r.inherentImpact,
    inherentScore: r.inherentScore, inherentRating: r.inherentRating,
    residualLikelihood: r.residualLikelihood, residualImpact: r.residualImpact,
    residualScore: r.residualScore, residualRating: r.residualRating,
    ownerName: r.riskOwner?.fullName, ownerNameEn: r.riskOwner?.fullNameEn, ownerEmail: r.riskOwner?.email,
    championName: r.champion?.fullName, championNameEn: r.champion?.fullNameEn, championEmail: r.champion?.email,
    treatmentCount: r.treatments.length,
    createdAt: r.createdAt,
  }));

  const trimmedTreatments = treatments.map(t => ({
    id: t.id,
    riskId: t.risk?.id, riskNumber: t.risk?.riskNumber,
    riskTitleAr: t.risk?.titleAr, riskTitleEn: t.risk?.titleEn,
    departmentAr: t.risk?.department?.nameAr, departmentEn: t.risk?.department?.nameEn,
    titleAr: t.titleAr, titleEn: t.titleEn,
    strategy: t.strategy, status: t.status,
    priority: t.priority, progress: t.progress,
    startDate: t.startDate, dueDate: t.dueDate, completionDate: t.completionDate,
    responsibleName: t.responsible?.fullName, responsibleNameEn: t.responsible?.fullNameEn, responsibleEmail: t.responsible?.email,
    monitorName: t.monitor?.fullName, monitorEmail: t.monitor?.email,
    riskOwnerName: t.riskOwner?.fullName, riskOwnerEmail: t.riskOwner?.email,
    justificationAr: t.justificationAr, justificationEn: t.justificationEn,
    expectedResidualScore: t.expectedResidualScore, expectedResidualRating: t.expectedResidualRating,
    tasks: t.tasks.map(task => ({
      id: task.id, status: task.status,
      titleAr: task.titleAr, titleEn: task.titleEn, dueDate: task.dueDate,
      assigneeName: task.actionOwner?.fullName, assigneeEmail: task.actionOwner?.email,
      monitorName: task.monitorOwner?.fullName, monitorEmail: task.monitorOwner?.email,
    })),
    inherentScore: t.risk?.inherentScore, residualScore: t.risk?.residualScore,
    inherentRating: t.risk?.inherentRating, residualRating: t.risk?.residualRating,
  }));

  writeFileSync(`${outDir}/stats.json`, JSON.stringify(stats, null, 2));
  writeFileSync(`${outDir}/risks.json`, JSON.stringify(trimmedRisks));
  writeFileSync(`${outDir}/treatments.json`, JSON.stringify(trimmedTreatments));
  writeFileSync(`${outDir}/departments.json`, JSON.stringify(departments.map(d=>({ id:d.id, code:d.code, nameAr:d.nameAr, nameEn:d.nameEn, riskCount: d._count.risks }))));
  writeFileSync(`${outDir}/champions.json`, JSON.stringify(champions.map(c=>({ id:c.id, fullName:c.fullName, fullNameEn:c.fullNameEn, email:c.email, departmentAr:c.department?.nameAr, departmentEn:c.department?.nameEn, riskCount:c._count.championRisks, planCount:c._count.responsibleTreatments }))));
  writeFileSync(`${outDir}/incidents.json`, JSON.stringify(incidents.map(i=>({ id:i.id, incidentNumber:i.incidentNumber, titleAr:i.titleAr, titleEn:i.titleEn, severity:i.severity, status:i.status, departmentAr:i.department?.nameAr, departmentEn:i.department?.nameEn, incidentDate:i.incidentDate, user:i.reportedBy?.fullName }))));

  writeFileSync(`${outDir}/approvals.json`, JSON.stringify(approvals.map(a=>({
    id: a.id, status: a.status,
    riskNumber: a.risk?.riskNumber,
    riskTitleAr: a.risk?.titleAr, riskTitleEn: a.risk?.titleEn,
    categoryAr: a.risk?.category?.nameAr, categoryEn: a.risk?.category?.nameEn,
    departmentAr: a.risk?.department?.nameAr, departmentEn: a.risk?.department?.nameEn,
    inherentScore: a.risk?.inherentScore, inherentRating: a.risk?.inherentRating,
    requesterName: a.requester?.fullName, requesterNameEn: a.requester?.fullNameEn, requesterEmail: a.requester?.email,
    reviewNoteAr: a.reviewNoteAr, reviewNoteEn: a.reviewNoteEn,
    createdAt: a.createdAt,
  }))));

  writeFileSync(`${outDir}/notifications.json`, JSON.stringify(notifications));

  writeFileSync(`${outDir}/discussions.json`, JSON.stringify(allDiscussions.map(d=>({
    id: d.id, type: d.type, content: d.content,
    isResolved: d.isResolved,
    authorName: d.author?.fullName, authorNameEn: d.author?.fullNameEn, authorEmail: d.author?.email,
    treatmentPlanId: d.treatmentPlanId,
    planTitleAr: d.treatmentPlan?.titleAr, planTitleEn: d.treatmentPlan?.titleEn,
    riskNumber: d.treatmentPlan?.risk?.riskNumber,
    createdAt: d.createdAt,
    parentId: d.parentId,
  }))));

  console.log('\n✓ Snapshot written to', outDir);
  console.log('Risks:', risks.length, '· Treatments:', treatments.length, '· Champions:', champions.length, '· Departments:', departments.length, '· Incidents:', incidents.length);
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
