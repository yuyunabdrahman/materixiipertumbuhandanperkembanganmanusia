import Dexie from 'dexie'

export const db = new Dexie('tumbuhBersama')

db.version(1).stores({
  quizResults: '++id, student, score, total, createdAt',
  worksheets: '++id, student, group, createdAt',
})

export async function getLearningStats() {
  const [quizResults, worksheets] = await Promise.all([
    db.quizResults.toArray(),
    db.worksheets.toArray(),
  ])
  const latest = quizResults.slice().sort((a, b) => b.createdAt - a.createdAt)[0]
  return {
    quizCount: quizResults.length,
    worksheetCount: worksheets.length,
    bestScore: quizResults.reduce((best, item) => Math.max(best, item.score), 0),
    latestScore: latest ? latest.score : null,
  }
}
