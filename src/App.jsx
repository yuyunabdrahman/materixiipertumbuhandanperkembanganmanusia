import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight, BookOpen, Check, CheckCircle2, ChevronRight,
  ClipboardCheck, GraduationCap, Heart, Home, Lightbulb, RotateCcw,
  Sparkles, Star, Target, Trophy, Users, X,
} from 'lucide-react'
import { db, getLearningStats } from './db'

const navItems = [
  { id: 'home', label: 'Beranda', icon: Home },
  { id: 'materi', label: 'Jelajah Materi', icon: BookOpen },
  { id: 'game', label: 'Papan Interaktif', icon: Sparkles },
  { id: 'quiz', label: 'Kuis Kilat', icon: Target },
  { id: 'lkpd', label: 'LKPD Kelas', icon: ClipboardCheck },
]

const lessons = [
  {
    id: 'apa-itu',
    title: 'Tumbuh atau berkembang?',
    subtitle: 'Kenali dua proses yang berjalan beriringan',
    icon: '🌱',
    color: 'bg-[#e7f8ef]',
    duration: '4 menit',
    paragraphs: [
      ['Pertumbuhan', ' adalah perubahan ukuran tubuh yang dapat diukur, misalnya tinggi dan berat badan bertambah. Pertumbuhan bersifat kuantitatif.'],
      ['Perkembangan', ' adalah proses menuju kedewasaan dan kemampuan yang lebih matang. Contohnya, anak mulai bisa membaca, berlari, atau mengelola emosi. Perkembangan bersifat kualitatif.'],
    ],
    fact: 'Setiap manusia tumbuh dan berkembang dengan kecepatan yang berbeda. Tidak perlu membandingkan tubuh atau kemampuanmu dengan orang lain.',
    points: ['Pertumbuhan bisa diukur dengan angka.', 'Perkembangan terlihat dari perubahan kemampuan.', 'Keduanya dipengaruhi faktor dari dalam dan luar tubuh.'],
  },
  {
    id: 'tahapan',
    title: 'Tahapan kehidupan manusia',
    subtitle: 'Dari awal kehidupan hingga lanjut usia',
    icon: '🧭',
    color: 'bg-[#fff1e7]',
    duration: '5 menit',
    paragraphs: [
      ['Bayi dan balita', ' mengalami pertumbuhan pesat dan belajar kemampuan dasar seperti berjalan dan berbicara.'],
      ['Anak-anak dan remaja', ' bertambah tinggi, belajar mandiri, serta mengalami perubahan fisik dan emosi. Masa pubertas merupakan bagian alami dari masa remaja.'],
      ['Dewasa dan lanjut usia', ' umumnya memiliki kemampuan yang lebih matang. Seiring bertambah usia, beberapa fungsi tubuh dapat berubah secara bertahap.'],
    ],
    fact: 'Pubertas tidak dimulai pada usia yang sama untuk setiap orang. Perubahan tubuh adalah hal alami dan sebaiknya disikapi dengan rasa hormat.',
    points: ['Setiap tahap memiliki ciri khas.', 'Urutan tahap kehidupan berlangsung bertahap.', 'Waktu dan pengalaman tiap orang tidak selalu sama.'],
  },
  {
    id: 'faktor',
    title: 'Apa yang memengaruhi?',
    subtitle: 'Kebiasaan sehat membantu tubuh berkembang',
    icon: '✨',
    color: 'bg-[#eeecff]',
    duration: '4 menit',
    paragraphs: [
      ['Faktor dari dalam tubuh', ' meliputi keturunan (gen) dan hormon. Keduanya ikut berperan dalam menentukan ciri serta proses pertumbuhan seseorang.'],
      ['Faktor dari lingkungan', ' mencakup makanan bergizi, istirahat cukup, aktivitas fisik, kesehatan, dan dukungan orang-orang di sekitar.'],
    ],
    fact: 'Merawat diri tidak berarti harus sempurna. Mulailah dari kebiasaan kecil: makan beragam, bergerak aktif, tidur cukup, dan bertanya kepada orang dewasa tepercaya saat butuh bantuan.',
    points: ['Gen dan hormon merupakan faktor internal.', 'Gizi, tidur, dan aktivitas merupakan faktor lingkungan.', 'Kebiasaan sehat mendukung tubuh, bukan menjamin hasil yang sama bagi semua orang.'],
  },
]

const questions = [
  {
    text: 'Manakah contoh pertumbuhan yang dapat diukur?',
    options: ['Berat badan bertambah 2 kg', 'Mulai bisa mengendalikan emosi', 'Mampu bekerja sama', 'Belajar memahami perasaan teman'],
    answer: 0,
    explanation: 'Berat badan dapat diukur dengan angka, sehingga termasuk contoh pertumbuhan.',
  },
  {
    text: 'Perubahan kemampuan dari belum bisa menjadi bisa disebut …',
    options: ['Pematangan', 'Perkembangan', 'Pengukuran', 'Keturunan'],
    answer: 1,
    explanation: 'Perkembangan terlihat dari bertambah matangnya kemampuan seseorang.',
  },
  {
    text: 'Yang termasuk faktor lingkungan yang mendukung pertumbuhan adalah …',
    options: ['Warna mata', 'Gen dari orang tua', 'Makanan bergizi dan istirahat cukup', 'Bentuk rambut'],
    answer: 2,
    explanation: 'Asupan gizi dan istirahat adalah faktor lingkungan yang bisa mendukung kesehatan.',
  },
  {
    text: 'Pernyataan yang tepat tentang pubertas adalah …',
    options: ['Terjadi pada waktu yang persis sama bagi semua orang', 'Merupakan perubahan alami pada masa remaja', 'Hanya memengaruhi tinggi badan', 'Harus disembunyikan dari orang dewasa'],
    answer: 1,
    explanation: 'Pubertas adalah proses alami. Waktu dan pengalaman setiap orang dapat berbeda.',
  },
  {
    text: 'Mana yang merupakan contoh perkembangan?',
    options: ['Tinggi badan bertambah', 'Berat badan bertambah', 'Ukuran sepatu berubah', 'Makin terampil menyampaikan pendapat'],
    answer: 3,
    explanation: 'Keterampilan menyampaikan pendapat menunjukkan perubahan kemampuan.',
  },
]

const boardCards = [
  { text: 'Tinggi badan bertambah 5 cm', type: 'Pertumbuhan' },
  { text: 'Belajar membaca dengan lancar', type: 'Perkembangan' },
  { text: 'Berat badan bertambah', type: 'Pertumbuhan' },
  { text: 'Mampu bekerja sama dalam kelompok', type: 'Perkembangan' },
  { text: 'Ukuran kaki berubah', type: 'Pertumbuhan' },
  { text: 'Makin terampil mengatur waktu', type: 'Perkembangan' },
]

const stages = ['Bayi', 'Anak-anak', 'Remaja', 'Dewasa', 'Lanjut usia']
const worksheetPrompts = [
  'Tuliskan satu contoh pertumbuhan dan satu contoh perkembangan yang kamu amati.',
  'Sebutkan dua kebiasaan sehat yang mendukung pertumbuhan dan perkembangan.',
  'Mengapa kita perlu menghargai perbedaan waktu tumbuh setiap orang?',
]

function IconBadge({ children, className = '' }) {
  return <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${className}`}>{children}</span>
}

function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="mb-2 text-xs font-extrabold uppercase tracking-[.16em] text-brand">{eyebrow}</p>}
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-[30px]">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-muted sm:text-base">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState('home')
  const [activeLesson, setActiveLesson] = useState(lessons[0].id)
  const [stats, setStats] = useState({ quizCount: 0, worksheetCount: 0, bestScore: 0, latestScore: null })
  const [storageError, setStorageError] = useState('')
  const [student, setStudent] = useState(() => localStorage.getItem('tb-student') || '')
  const [group, setGroup] = useState(() => localStorage.getItem('tb-group') || '')
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizChoice, setQuizChoice] = useState(null)
  const [quizScore, setQuizScore] = useState(0)
  const [quizFinished, setQuizFinished] = useState(false)
  const [quizSaved, setQuizSaved] = useState(false)
  const [quizSaving, setQuizSaving] = useState(false)
  const [boardAnswers, setBoardAnswers] = useState({})
  const [boardChecked, setBoardChecked] = useState(false)
  const [stageOrder, setStageOrder] = useState([])
  const [stageChecked, setStageChecked] = useState(false)
  const [worksheetAnswers, setWorksheetAnswers] = useState(['', '', ''])
  const [worksheetSaved, setWorksheetSaved] = useState(false)
  const [worksheetSaving, setWorksheetSaving] = useState(false)
  const [worksheetHistory, setWorksheetHistory] = useState([])

  useEffect(() => {
    refreshStats()
    loadWorksheets()
  }, [])

  useEffect(() => {
    localStorage.setItem('tb-student', student)
  }, [student])

  useEffect(() => {
    localStorage.setItem('tb-group', group)
  }, [group])

  async function refreshStats() {
    try {
      setStats(await getLearningStats())
      setStorageError('')
    } catch (error) {
      console.error('Tidak dapat membaca progres dari IndexedDB:', error)
      setStorageError('Penyimpanan browser tidak dapat dibaca. Coba gunakan browser terbaru dan pastikan mode privat tidak membatasi penyimpanan.')
    }
  }

  async function loadWorksheets() {
    try {
      setWorksheetHistory(await db.worksheets.orderBy('createdAt').reverse().limit(5).toArray())
    } catch (error) {
      console.error('Tidak dapat memuat LKPD dari IndexedDB:', error)
      setStorageError('Riwayat LKPD tidak dapat dimuat dari penyimpanan browser.')
    }
  }

  function go(nextPage) {
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function startQuiz() {
    setQuizIndex(0)
    setQuizChoice(null)
    setQuizScore(0)
    setQuizFinished(false)
    setQuizSaved(false)
    go('quiz')
  }

  function answerQuiz() {
    if (quizChoice === null) return
    const nextScore = quizScore + (quizChoice === questions[quizIndex].answer ? 1 : 0)
    setQuizScore(nextScore)
    if (quizIndex === questions.length - 1) {
      setQuizFinished(true)
      saveQuizResult(nextScore)
    } else {
      setQuizIndex(quizIndex + 1)
      setQuizChoice(null)
    }
  }

  async function saveQuizResult(score) {
    setQuizSaving(true)
    try {
      await db.quizResults.add({
        student: student.trim() || 'Siswa',
        score,
        total: questions.length,
        createdAt: Date.now(),
      })
      setQuizSaved(true)
      await refreshStats()
    } catch (error) {
      console.error('Tidak dapat menyimpan hasil kuis ke IndexedDB:', error)
      setStorageError('Hasil kuis belum tersimpan. Periksa izin penyimpanan browser lalu coba lagi.')
    } finally {
      setQuizSaving(false)
    }
  }

  async function saveWorksheet(event) {
    event.preventDefault()
    setWorksheetSaving(true)
    try {
      await db.worksheets.add({
        student: student.trim() || 'Siswa',
        group: group.trim() || 'Kelas',
        answers: worksheetAnswers.map((answer) => answer.trim()),
        createdAt: Date.now(),
      })
      setWorksheetSaved(true)
      setWorksheetAnswers(['', '', ''])
      await loadWorksheets()
      await refreshStats()
    } catch (error) {
      console.error('Tidak dapat menyimpan LKPD ke IndexedDB:', error)
      setStorageError('LKPD belum tersimpan. Periksa izin penyimpanan browser lalu coba lagi.')
    } finally {
      setWorksheetSaving(false)
    }
  }

  const lesson = useMemo(() => lessons.find((item) => item.id === activeLesson) || lessons[0], [activeLesson])
  const boardScore = boardCards.reduce((score, card, index) => score + (boardAnswers[index] === card.type ? 1 : 0), 0)
  const sortedCorrectly = stageOrder.length === stages.length && stageOrder.every((stage, index) => stage === stages[index])
  const answeredQuestions = Object.keys(boardAnswers).length

  function toggleStage(stage) {
    if (stageChecked) return
    setStageOrder((current) => current.includes(stage) ? current.filter((item) => item !== stage) : [...current, stage])
  }

  function resetQuiz() {
    setQuizIndex(0)
    setQuizChoice(null)
    setQuizScore(0)
    setQuizFinished(false)
    setQuizSaved(false)
  }

  const pageContent = (() => {
    if (page === 'materi') return (
      <>
        <SectionHeading eyebrow="Jelajah materi" title="Kenali proses tumbuhmu" description="Pilih topik untuk belajar dengan ritmemu sendiri. Ada fakta menarik dan rangkuman di setiap bagian." />
        <div className="grid gap-6 lg:grid-cols-[.82fr_1.18fr]">
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {lessons.map((item, index) => (
              <button key={item.id} onClick={() => setActiveLesson(item.id)} className={`topic-card flex items-center gap-4 rounded-3xl border p-4 text-left ${activeLesson === item.id ? 'border-brand bg-white shadow-soft' : 'border-transparent bg-white'}`}>
                <IconBadge className={item.color}><span className="text-xl">{item.icon}</span></IconBadge>
                <span className="min-w-0 flex-1">
                  <span className="mb-1 block text-[11px] font-extrabold uppercase tracking-wider text-muted">Topik {index + 1} · {item.duration}</span>
                  <span className="block font-display text-sm font-extrabold leading-snug text-ink">{item.title}</span>
                </span>
                <ChevronRight size={17} className="text-muted" />
              </button>
            ))}
          </div>
          <article className="soft-card pop-in rounded-[28px] p-6 sm:p-8" key={lesson.id}>
            <div className={`mb-6 flex h-28 items-center justify-center rounded-3xl ${lesson.color}`}>
              <span className="text-6xl">{lesson.icon}</span>
            </div>
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[.15em] text-brand">{lesson.duration} membaca</p>
            <h2 className="font-display text-2xl font-extrabold text-ink">{lesson.title}</h2>
            <p className="mb-6 mt-2 text-sm leading-6 text-muted">{lesson.subtitle}</p>
            <div className="space-y-4 text-[15px] leading-7 text-[#555e70]">
              {lesson.paragraphs.map((parts, index) => <p key={index}><strong className="text-ink">{parts[0]}</strong>{parts[1]}</p>)}
            </div>
            <div className="my-6 rounded-2xl border border-[#eeecff] bg-[#f7f6ff] p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-extrabold text-[#5147d3]"><Lightbulb size={17} /> Tahukah kamu?</div>
              <p className="text-sm leading-6 text-[#5b5c75]">{lesson.fact}</p>
            </div>
            <h3 className="mb-3 font-display font-extrabold text-ink">Ingat tiga hal ini</h3>
            <ul className="space-y-3">
              {lesson.points.map((point) => <li className="flex gap-3 text-sm leading-6 text-[#555e70]" key={point}><CheckCircle2 size={18} className="mt-1 shrink-0 text-[#41ad86]" />{point}</li>)}
            </ul>
            <button onClick={() => go('game')} className="btn-primary mt-7 inline-flex min-h-12 items-center gap-2 rounded-2xl px-5 text-sm font-bold">Coba aktivitas <ArrowRight size={17} /></button>
          </article>
        </div>
      </>
    )

    if (page === 'game') return (
      <>
        <SectionHeading eyebrow="Papan interaktif" title="Ayo main sambil belajar!" description="Tampilkan di layar kelas, lalu ajak siswa maju untuk memilih jawaban atau menyusun tahap kehidupan. Bisa dimainkan dengan sentuhan." action={<span className="rounded-full bg-[#eeecff] px-3 py-2 text-xs font-bold text-[#5147d3]">👆 Ramah papan sentuh</span>} />
        <div className="mb-6 grid gap-5 xl:grid-cols-2">
          <section className="soft-card rounded-[28px] p-5 sm:p-7">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div><span className="mb-2 inline-flex rounded-full bg-[#e7f8ef] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#248a68]">Misi 1 · Klasifikasi</span><h2 className="font-display text-xl font-extrabold text-ink">Tumbuh atau berkembang?</h2><p className="mt-1 text-sm text-muted">Pilih kategori yang cocok untuk setiap pernyataan.</p></div>
              <span className="text-3xl">🧩</span>
            </div>
            {group && <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#f7f8fc] px-3 py-2 text-xs font-bold text-muted"><Users size={14} /> {group}</p>}
            <div className="space-y-3">
              {boardCards.map((card, index) => (
                <div key={card.text} className={`rounded-2xl border p-3 transition ${boardChecked && boardAnswers[index] === card.type ? 'border-[#a9e6cf] bg-[#f1fbf7]' : boardChecked && boardAnswers[index] ? 'border-[#ffd2c8] bg-[#fff7f5]' : 'border-[#eef0f5] bg-white'}`}>
                  <p className="mb-3 text-sm font-bold text-ink">{index + 1}. {card.text}</p>
                  <div className="flex gap-2">
                    {['Pertumbuhan', 'Perkembangan'].map((type) => <button key={type} disabled={boardChecked} onClick={() => setBoardAnswers((current) => ({ ...current, [index]: type }))} className={`min-h-10 flex-1 rounded-xl px-2 text-xs font-bold transition sm:text-sm ${boardAnswers[index] === type ? 'bg-brand text-white' : 'bg-[#f4f5f9] text-[#687084] hover:bg-[#eeecff]'}`}>{type}</button>)}
                  </div>
                  {boardChecked && boardAnswers[index] !== card.type && <p className="mt-2 text-xs font-bold text-[#d46b54]">Jawaban: {card.type}</p>}
                </div>
              ))}
            </div>
            {boardChecked ? (
              <div className="mt-5 rounded-2xl bg-[#f7f6ff] p-4">
                <p className="font-display font-extrabold text-ink">{boardScore === boardCards.length ? 'Sempurna! Kalian hebat! 🎉' : `Kalian mendapat ${boardScore} dari ${boardCards.length} poin!`}</p>
                <button onClick={() => { setBoardAnswers({}); setBoardChecked(false) }} className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-brand"><RotateCcw size={15} /> Main lagi</button>
              </div>
            ) : <button disabled={answeredQuestions < boardCards.length} onClick={() => setBoardChecked(true)} className="btn-primary mt-5 min-h-12 w-full rounded-2xl px-5 text-sm font-bold">Periksa jawaban <Check size={17} className="ml-1 inline" /></button>}
          </section>

          <section className="soft-card rounded-[28px] p-5 sm:p-7">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div><span className="mb-2 inline-flex rounded-full bg-[#fff0e3] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#bc713e]">Misi 2 · Urutan</span><h2 className="font-display text-xl font-extrabold text-ink">Susun tahap kehidupan</h2><p className="mt-1 text-sm text-muted">Ketuk kartu menurut urutan yang benar, dari awal hingga akhir.</p></div>
              <span className="text-3xl">🪜</span>
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              {stages.map((stage, index) => stageOrder.includes(stage) ? <span key={stage} className="rounded-xl bg-[#eeecff] px-3 py-2 text-sm font-bold text-[#5147d3]">{index + 1}. {stage}</span> : null)}
              {stageOrder.length === 0 && <p className="py-2 text-sm text-muted">Urutan pilihanmu akan muncul di sini.</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[...stages].reverse().map((stage) => {
                const selected = stageOrder.includes(stage)
                return <button key={stage} onClick={() => toggleStage(stage)} disabled={stageChecked || selected} className={`board-card min-h-[76px] rounded-2xl border px-4 text-left font-bold ${selected ? 'border-[#e3e5ed] bg-[#f6f7f9] text-muted' : 'border-[#eef0f5] bg-white text-ink hover:border-brand'}`}><span className="mr-2 text-lg">{stage === 'Bayi' ? '👶' : stage === 'Anak-anak' ? '🧒' : stage === 'Remaja' ? '🧑' : stage === 'Dewasa' ? '🧑‍💼' : '👵'}</span>{stage}</button>
              })}
            </div>
            {stageChecked && <div className={`mt-5 rounded-2xl p-4 ${sortedCorrectly ? 'bg-[#effaf5]' : 'bg-[#fff7ed]'}`}><p className="font-display font-extrabold text-ink">{sortedCorrectly ? 'Betul! Urutannya sudah tepat! 🌟' : 'Belum pas, coba ingat perjalanan hidup manusia.'}</p>{!sortedCorrectly && <p className="mt-1 text-sm text-muted">Urutan yang benar: {stages.join(' → ')}</p>}</div>}
            {stageChecked ? <button onClick={() => { setStageOrder([]); setStageChecked(false) }} className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[#f4f5f9] px-5 text-sm font-bold text-ink"><RotateCcw size={16} /> Ulangi susun</button> : <button disabled={stageOrder.length !== stages.length} onClick={() => setStageChecked(true)} className="btn-primary mt-5 min-h-12 w-full rounded-2xl px-5 text-sm font-bold">Periksa urutan <Check size={17} className="ml-1 inline" /></button>}
          </section>
        </div>
      </>
    )

    if (page === 'quiz') return (
      <>
        <SectionHeading eyebrow="Kuis kilat" title="Seberapa paham kamu?" description="Lima pertanyaan singkat untuk mengingat kembali hal-hal penting." action={<span className="rounded-full bg-[#fff0e3] px-3 py-2 text-xs font-bold text-[#bc713e]">⚡ 5 soal · tanpa batas waktu</span>} />
        <div className="mx-auto max-w-2xl">
          <section className="soft-card rounded-[30px] p-6 sm:p-9">
            {!quizFinished ? <>
              <div className="mb-6 flex items-center justify-between text-sm font-bold text-muted"><span>Soal {quizIndex + 1} dari {questions.length}</span><span className="text-brand">{Math.round((quizIndex / questions.length) * 100)}%</span></div>
              <div className="progress-track mb-8"><div className="progress-value" style={{ width: `${(quizIndex / questions.length) * 100}%` }} /></div>
              <h2 className="mb-6 font-display text-xl font-extrabold leading-snug text-ink sm:text-2xl">{questions[quizIndex].text}</h2>
              <div className="space-y-3">
                {questions[quizIndex].options.map((option, index) => {
                  const selected = quizChoice === index
                  const revealed = quizChoice !== null
                  const correct = index === questions[quizIndex].answer
                  const style = !revealed ? selected ? 'border-brand bg-[#f7f6ff]' : 'border-[#eef0f5] hover:border-[#c7c2ff]' : correct ? 'border-[#a9e6cf] bg-[#f1fbf7]' : selected ? 'border-[#ffd2c8] bg-[#fff7f5]' : 'border-[#eef0f5] opacity-60'
                  return <button key={option} onClick={() => !revealed && setQuizChoice(index)} className={`flex min-h-[58px] w-full items-center gap-3 rounded-2xl border p-4 text-left text-sm font-semibold text-ink transition ${style}`}>
                    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-extrabold ${selected ? 'bg-brand text-white' : 'bg-[#f1f2f7] text-muted'}`}>{String.fromCharCode(65 + index)}</span>
                    <span className="flex-1">{option}</span>
                    {revealed && correct && <CheckCircle2 size={19} className="text-[#36a77c]" />}
                    {revealed && selected && !correct && <X size={19} className="text-[#d46b54]" />}
                  </button>
                })}
              </div>
              {quizChoice !== null && <p className="mt-5 rounded-2xl bg-[#f7f6ff] p-4 text-sm leading-6 text-[#555e70]">{questions[quizIndex].explanation}</p>}
              <button disabled={quizChoice === null} onClick={answerQuiz} className="btn-primary mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-bold">{quizIndex === questions.length - 1 ? 'Lihat hasil' : 'Soal berikutnya'} <ArrowRight size={17} /></button>
            </> : <div className="py-4 text-center">
              <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-[28px] bg-[#fff3d7] text-4xl">{quizScore >= 4 ? '🏆' : quizScore >= 3 ? '🌟' : '💪'}</div>
              <p className="mb-2 text-xs font-extrabold uppercase tracking-[.16em] text-brand">Kuis selesai!</p>
              <h2 className="font-display text-3xl font-extrabold text-ink">{quizScore} dari {questions.length} benar</h2>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted">{quizScore >= 4 ? 'Hebat! Kamu sudah memahami banyak hal tentang pertumbuhan dan perkembangan.' : 'Terus berlatih, ya! Membaca kembali materi akan membantumu makin paham.'}</p>
              {quizSaving && <p className="mt-4 text-xs font-bold text-muted">Menyimpan hasil ke perangkat…</p>}
              {quizSaved && <p className="mt-4 inline-flex items-center gap-1 rounded-full bg-[#effaf5] px-3 py-2 text-xs font-bold text-[#248a68]"><CheckCircle2 size={14} /> Hasil tersimpan di perangkat ini</p>}
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <button onClick={resetQuiz} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#f4f5f9] px-5 text-sm font-bold text-ink"><RotateCcw size={16} /> Coba lagi</button>
                <button onClick={() => go('materi')} className="btn-primary inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-bold">Baca materi <BookOpen size={16} /></button>
              </div>
            </div>}
          </section>
        </div>
      </>
    )

    if (page === 'lkpd') return (
      <>
        <SectionHeading eyebrow="Lembar kerja peserta didik" title="LKPD: Jurnal tumbuh kembang" description="Ajak siswa berdiskusi dan menuliskan hasil refleksi. Jawaban tersimpan di browser perangkat ini, bukan dikirim ke server." action={<span className="rounded-full bg-[#e7f8ef] px-3 py-2 text-xs font-bold text-[#248a68]">📝 Bisa dikerjakan bersama</span>} />
        <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
          <form onSubmit={saveWorksheet} className="soft-card rounded-[28px] p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3 border-b border-[#f0f1f5] pb-5">
              <IconBadge className="bg-[#eeecff]"><ClipboardCheck size={20} className="text-brand" /></IconBadge>
              <div><p className="font-display font-extrabold text-ink">Ayo amati dan refleksikan</p><p className="mt-1 text-xs text-muted">Jawab dengan kalimatmu sendiri.</p></div>
            </div>
            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-bold text-[#596174]">Nama siswa / perwakilan
                <input value={student} onChange={(event) => setStudent(event.target.value)} placeholder="Contoh: Naya" className="answer-input mt-2 min-h-12 w-full rounded-xl border border-[#e8eaf0] bg-white px-4 text-sm text-ink" />
              </label>
              <label className="text-xs font-bold text-[#596174]">Nama kelas / kelompok
                <input value={group} onChange={(event) => setGroup(event.target.value)} placeholder="Contoh: Kelompok 2" className="answer-input mt-2 min-h-12 w-full rounded-xl border border-[#e8eaf0] bg-white px-4 text-sm text-ink" />
              </label>
            </div>
            <div className="space-y-5">
              {worksheetPrompts.map((prompt, index) => <label key={prompt} className="block">
                <span className="mb-2 block text-sm font-bold leading-6 text-ink"><span className="mr-2 text-brand">{String(index + 1).padStart(2, '0')}</span>{prompt}</span>
                <textarea required minLength={4} rows={3} value={worksheetAnswers[index]} onChange={(event) => setWorksheetAnswers((current) => current.map((answer, answerIndex) => answerIndex === index ? event.target.value : answer))} placeholder="Tuliskan jawabanmu di sini…" className="answer-input w-full resize-y rounded-2xl border border-[#e8eaf0] bg-[#fcfcfe] p-4 text-sm leading-6 text-ink placeholder:text-[#a2a8b6]" />
              </label>)}
            </div>
            <button disabled={worksheetSaving} className="btn-primary mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-bold">{worksheetSaving ? 'Menyimpan…' : 'Simpan LKPD di perangkat'} <Check size={17} /></button>
            {worksheetSaved && <p className="mt-3 text-center text-sm font-bold text-[#248a68]">LKPD berhasil tersimpan di perangkat ini. Terima kasih! 🌱</p>}
          </form>
          <aside className="space-y-5">
            <div className="rounded-[28px] bg-[#eeecff] p-6">
              <div className="mb-3 flex items-center gap-2 font-display font-extrabold text-[#5147d3]"><Heart size={18} /> Pesan untuk kelas</div>
              <p className="text-sm leading-6 text-[#5e5a87]">Setiap orang punya perjalanan tumbuh yang unik. Gunakan pertanyaan ini untuk saling mendengarkan, bukan membandingkan.</p>
              <p className="mt-4 text-xs font-bold text-[#746eb5]">Waktu diskusi yang disarankan: 10–15 menit</p>
            </div>
            <div className="soft-card rounded-[28px] p-6">
              <div className="mb-4 flex items-center justify-between">
                <div><h2 className="font-display font-extrabold text-ink">LKPD tersimpan</h2><p className="mt-1 text-xs text-muted">Di browser perangkat ini</p></div>
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#f4f5f9] text-brand"><ClipboardCheck size={17} /></span>
              </div>
              {worksheetHistory.length ? <ul className="space-y-3">
                {worksheetHistory.map((item) => <li key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-[#f8f9fc] p-3"><div className="min-w-0"><p className="truncate text-sm font-bold text-ink">{item.student} · {item.group}</p><p className="mt-1 text-[11px] text-muted">{new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p></div><CheckCircle2 size={17} className="shrink-0 text-[#41ad86]" /></li>)}
              </ul> : <p className="rounded-xl bg-[#f8f9fc] p-4 text-sm leading-6 text-muted">Belum ada LKPD. Isian yang disimpan akan tampil di sini.</p>}
            </div>
          </aside>
        </div>
      </>
    )

    return (
      <>
        <section className="relative mb-7 overflow-hidden rounded-[30px] bg-[#6258e8] px-6 py-8 text-white sm:px-10 sm:py-10">
          <div className="absolute -right-9 -top-12 h-56 w-56 rounded-full bg-white/10" />
          <div className="absolute right-[17%] top-[58%] h-24 w-24 rounded-full bg-[#ffd780]/20" />
          <div className="relative z-10 max-w-[610px]">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-2 text-xs font-bold"><Sparkles size={14} /> Biologi manusia · Belajar interaktif</span>
            <h1 className="font-display text-[32px] font-extrabold leading-tight tracking-tight sm:text-[42px]">Halo, penjelajah!<br />Siap mengenal dirimu? 🌿</h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-white/80 sm:text-base">Belajar pertumbuhan dan perkembangan manusia lewat cerita, permainan, dan tantangan seru di kelas.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => go('materi')} className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-white px-5 text-sm font-extrabold text-[#5147d3] hover:bg-[#f5f3ff]">Mulai belajar <ArrowRight size={17} /></button>
              <button onClick={() => go('game')} className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-white/15 px-5 text-sm font-bold text-white hover:bg-white/25"><Sparkles size={16} /> Buka papan kelas</button>
            </div>
          </div>
          <div className="absolute bottom-0 right-5 hidden h-[240px] w-[250px] items-end justify-center sm:flex" aria-hidden="true">
            <div className="relative mb-2 flex h-44 w-44 items-center justify-center rounded-[50%_50%_44%_44%] bg-[#ffdf9b] text-[100px] shadow-[inset_-10px_-8px_0_rgba(238,174,80,.2)]">🧑🏻‍🔬</div>
            <span className="absolute right-3 top-8 rotate-12 text-4xl">✨</span><span className="absolute left-0 top-16 -rotate-12 text-3xl">🌱</span>
          </div>
        </section>

        <div className="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: 'Kuis dikerjakan', value: stats.quizCount, icon: Target, bg: 'bg-[#eeecff]', fg: 'text-brand' },
            { label: 'Skor terbaik', value: `${stats.bestScore}/${questions.length}`, icon: Trophy, bg: 'bg-[#fff3d7]', fg: 'text-[#d69128]' },
            { label: 'LKPD tersimpan', value: stats.worksheetCount, icon: ClipboardCheck, bg: 'bg-[#e7f8ef]', fg: 'text-[#35a17b]' },
            { label: 'Belajar bersama', value: group || 'Satu kelas', icon: Users, bg: 'bg-[#fff0e3]', fg: 'text-[#df8754]' },
          ].map(({ label, value, icon: Icon, bg, fg }) => <div className="soft-card flex items-center gap-3 rounded-2xl p-4 sm:gap-4 sm:p-5" key={label}><IconBadge className={bg}><Icon size={19} className={fg} /></IconBadge><div className="min-w-0"><p className="text-[11px] font-semibold leading-4 text-muted sm:text-xs">{label}</p><p className="mt-1 truncate font-display text-lg font-extrabold text-ink">{value}</p></div></div>)}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
          <section>
            <div className="mb-4 flex items-end justify-between gap-3"><div><p className="text-xs font-extrabold uppercase tracking-[.15em] text-brand">Mulai petualangan</p><h2 className="mt-1 font-display text-xl font-extrabold text-ink">Pilih aktivitasmu</h2></div><span className="hidden text-xs font-semibold text-muted sm:block">Belajar dengan cara yang kamu suka</span></div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { title: 'Jelajah materi', desc: 'Baca fakta seru tentang tubuhmu', icon: '📚', tint: 'bg-[#eeecff]', page: 'materi', hint: '3 topik' },
                { title: 'Papan interaktif', desc: 'Main dan bergerak bersama kelas', icon: '🎮', tint: 'bg-[#fff0e3]', page: 'game', hint: '2 misi' },
                { title: 'Kuis kilat', desc: 'Uji ingatanmu dengan 5 soal', icon: '⚡', tint: 'bg-[#fff3d7]', page: 'quiz', hint: '5 soal' },
                { title: 'LKPD kelas', desc: 'Tulis dan simpan hasil diskusi', icon: '✏️', tint: 'bg-[#e7f8ef]', page: 'lkpd', hint: '3 refleksi' },
              ].map((item) => <button onClick={() => item.page === 'quiz' ? startQuiz() : go(item.page)} key={item.title} className="topic-card soft-card flex min-h-[114px] items-center gap-4 rounded-3xl p-4 text-left sm:p-5"><span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-2xl ${item.tint}`}>{item.icon}</span><span className="min-w-0 flex-1"><span className="block font-display text-sm font-extrabold text-ink sm:text-base">{item.title}</span><span className="mt-1 block text-xs leading-5 text-muted">{item.desc}</span><span className="mt-2 inline-block text-[10px] font-extrabold uppercase tracking-wider text-brand">{item.hint}</span></span><ChevronRight size={18} className="shrink-0 text-muted" /></button>)}
            </div>
          </section>
          <aside className="space-y-5">
            <div className="soft-card rounded-3xl p-5 sm:p-6">
              <div className="mb-4 flex items-start justify-between">
                <div><p className="text-xs font-extrabold uppercase tracking-[.15em] text-brand">Perjalanan belajar</p><h2 className="mt-1 font-display text-lg font-extrabold text-ink">Tiga langkah seru</h2></div>
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#fff3d7]"><Star size={19} className="text-[#d69128]" /></span>
              </div>
              <div className="space-y-4">
                {[['01', 'Kenali materinya', 'Temukan hal baru tentang tubuh', 'materi', 'bg-[#eeecff] text-brand'], ['02', 'Main bareng kelas', 'Ajak teman ke papan interaktif', 'game', 'bg-[#fff0e3] text-[#df8754]'], ['03', 'Coba kuis & LKPD', 'Cek pemahaman dan refleksi', 'quiz', 'bg-[#e7f8ef] text-[#35a17b]']].map(([number, title, desc, target, color]) => <button key={number} onClick={() => target === 'quiz' ? startQuiz() : go(target)} className="flex w-full items-center gap-3 text-left"><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-xs font-extrabold ${color}`}>{number}</span><span className="min-w-0 flex-1"><span className="block text-sm font-extrabold text-ink">{title}</span><span className="mt-0.5 block text-xs text-muted">{desc}</span></span><ArrowRight size={15} className="text-muted" /></button>)}
              </div>
              {stats.latestScore !== null && <div className="mt-5 rounded-2xl bg-[#f7f6ff] p-3 text-xs font-semibold text-[#5147d3]">Skor kuis terakhir: {stats.latestScore}/{questions.length}. Ayo coba lagi dan lampaui rekor!</div>}
            </div>
            <div className="rounded-3xl bg-[#e7f8ef] p-5 sm:p-6">
              <div className="flex items-start gap-3"><span className="text-2xl">💚</span><div><h3 className="font-display font-extrabold text-[#24795e]">Setiap orang unik</h3><p className="mt-2 text-sm leading-6 text-[#467764]">Kita tumbuh dengan kecepatan berbeda. Jaga tubuhmu, hargai temanmu, dan rayakan setiap hal baru yang kamu pelajari.</p></div></div>
            </div>
          </aside>
        </div>
      </>
    )
  })()

  return (
    <div className="app-shell">
      <aside className="sidebar fixed inset-y-0 left-0 z-20 flex flex-col border-r border-[#eceef4] bg-white px-5 py-6">
        <button onClick={() => go('home')} className="mb-9 flex items-center gap-3 px-2 text-left">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand text-2xl">🌱</span>
          <span><span className="block font-display text-base font-extrabold tracking-tight text-ink">Tumbuh<span className="text-brand">Bersama</span></span><span className="mt-0.5 block text-[10px] font-bold uppercase tracking-[.15em] text-muted">Petualangan IPA</span></span>
        </button>
        <p className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-[.16em] text-[#a3a9b6]">Ruang belajar</p>
        <nav className="space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => go(id)} className={`nav-item flex min-h-12 w-full items-center gap-3 rounded-2xl px-3 text-sm text-[#697184] ${page === id ? 'active' : ''}`}><Icon size={18} /><span className="flex-1 text-left">{label}</span>{id === 'game' && <span className="rounded-md bg-white/80 px-1.5 py-0.5 text-[9px] font-extrabold">LIVE</span>}</button>)}
        </nav>
        <div className="mt-auto">
          <div className="rounded-2xl bg-[#f7f6ff] p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-extrabold text-[#5147d3]"><GraduationCap size={16} /> Mode kelas</div>
            <p className="text-xs leading-5 text-[#77749b]">Buka papan interaktif untuk bermain bersama di kelas.</p>
            <button onClick={() => go('game')} className="mt-3 text-xs font-extrabold text-brand">Buka papan <ArrowRight size={13} className="ml-1 inline" /></button>
          </div>
          <p className="mt-5 px-2 text-[10px] leading-5 text-[#a3a9b6]">Belajar dengan rasa ingin tahu.<br />Data tersimpan di perangkatmu.</p>
        </div>
      </aside>

      <main className="main-area min-h-screen">
        <header className="sticky top-0 z-10 border-b border-[#eceef4] bg-[#f7f8fc]/90 backdrop-blur-md">
          <div className="page-wrap flex min-h-[72px] items-center justify-between px-8">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-xl lg:hidden">🌱</span>
              <div><p className="font-display text-sm font-extrabold text-ink">{navItems.find((item) => item.id === page)?.label || 'Ruang belajar'}</p><p className="mt-0.5 text-[11px] text-muted">Pertumbuhan & perkembangan manusia</p></div>
            </div>
            <div className="flex items-center gap-3">
              <label className="hidden items-center gap-2 rounded-full border border-[#eceef4] bg-white px-3 py-2 sm:flex"><span className="text-base">👋</span><input aria-label="Nama siswa" value={student} onChange={(event) => setStudent(event.target.value)} placeholder="Namamu" className="w-24 bg-transparent text-xs font-bold text-ink outline-none placeholder:text-muted" /></label>
              <label className="hidden items-center gap-2 rounded-full border border-[#eceef4] bg-white px-3 py-2 md:flex"><Users size={14} className="text-brand" /><input aria-label="Nama kelas atau kelompok" value={group} onChange={(event) => setGroup(event.target.value)} placeholder="Nama kelas" className="w-24 bg-transparent text-xs font-bold text-ink outline-none placeholder:text-muted" /></label>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#fff0e3] text-lg">🌼</span>
            </div>
          </div>
        </header>
        <div className="page-wrap px-8 py-8">
          {storageError && <div role="alert" className="mb-5 flex items-start gap-3 rounded-2xl border border-[#ffd2c8] bg-[#fff7f5] p-4 text-sm text-[#9c4a38]"><span className="font-extrabold">Penyimpanan:</span><span>{storageError}</span><button aria-label="Tutup pesan" onClick={() => setStorageError('')} className="ml-auto"><X size={16} /></button></div>}
          {pageContent}
          <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[#e9ebf2] py-5 text-[11px] text-muted">
            <span>🌿 Tumbuh Bersama · Belajar IPA dengan menyenangkan</span>
            <span>Data tersimpan hanya di perangkat ini · Tanpa akun, tanpa server</span>
          </footer>
        </div>
      </main>

      <nav className="mobile-nav fixed inset-x-0 bottom-0 z-30 hidden justify-around border-t border-[#eceef4] bg-white/95 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 backdrop-blur-md">
        {navItems.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => go(id)} className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[9px] font-bold ${page === id ? 'text-brand' : 'text-muted'}`}><Icon size={19} /><span className="truncate">{label}</span></button>)}
      </nav>
    </div>
  )
}
