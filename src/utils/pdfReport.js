import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { classifySGY, getRecommendations } from '../data/sgyQuestionnaire';

export function generateSGYReport(evaluation, userName) {
  const doc = new jsPDF();
  const classification = classifySGY(evaluation.score);
  const recommendations = getRecommendations(evaluation.categoryScores);

  doc.setFillColor(15, 76, 129);
  doc.rect(0, 0, 210, 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text('Rapport d\'évaluation SGY', 14, 17);
  doc.setFontSize(10);
  doc.text('Al-imar-dhaki — PropTech Algérie', 14, 24);

  doc.setTextColor(51, 51, 51);
  doc.setFontSize(12);
  let y = 38;
  doc.setFont(undefined, 'bold');
  doc.text('Informations du projet', 14, y);
  doc.setFont(undefined, 'normal');
  y += 7;
  doc.setFontSize(10);
  doc.text(`Nom du projet : ${evaluation.projetNom || '-'}`, 14, y); y += 6;
  doc.text(`Date d'évaluation : ${new Date(evaluation.createdAt).toLocaleString('fr-FR')}`, 14, y); y += 6;
  doc.text(`Utilisateur : ${userName || '-'}`, 14, y); y += 10;

  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Résultats', 14, y);
  doc.setFont(undefined, 'normal');
  y += 7;
  doc.setFontSize(10);
  doc.text(`Score global SGY : ${evaluation.score}/100`, 14, y); y += 6;
  doc.text(`Classification : ${classification.label}`, 14, y); y += 10;

  autoTable(doc, {
    startY: y,
    head: [['Catégorie', 'Score obtenu', 'Score max', 'Pourcentage']],
    body: evaluation.categoryScores.map((c) => [c.label, String(c.obtained), String(c.max), `${c.percentage}%`]),
    headStyles: { fillColor: [15, 76, 129] },
    styles: { fontSize: 9 },
  });

  y = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Analyse synthétique', 14, y);
  doc.setFont(undefined, 'normal');
  y += 7;
  doc.setFontSize(10);
  const analyseLines = doc.splitTextToSize(classification.description, 180);
  doc.text(analyseLines, 14, y);
  y += analyseLines.length * 5 + 8;

  if (recommendations.length) {
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Recommandations générales', 14, y);
    doc.setFont(undefined, 'normal');
    y += 7;
    doc.setFontSize(10);
    recommendations.forEach((r) => {
      if (y > 270) { doc.addPage(); y = 20; }
      const lines = doc.splitTextToSize(`• ${r.categorie} : ${r.texte}`, 180);
      doc.text(lines, 14, y);
      y += lines.length * 5 + 3;
    });
  }

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Rapport généré automatiquement par الإعمار الذكي — MVP', 14, 290);

  doc.save(`rapport-sgy-${(evaluation.projetNom || 'projet').replace(/\s+/g, '-')}.pdf`);
}
