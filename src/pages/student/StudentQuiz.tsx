import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2Icon, XCircleIcon } from 'lucide-react';
import { Button, Card, PageHeader, Progress, cx } from '../../components/ui/primitives';
import { ConfirmDialog } from '../../components/ui/feedback';
import { QUIZ, RECOMMENDED_TOPICS } from '../../data/academics';
import { useApp } from '../../contexts/AppContext';
import { api } from '../../api/client';
import { useApiLive, useList } from '../../api/hooks';

export function StudentQuiz() {
  const live = useApiLive();
  const quizzesRes = useList<Record<string, unknown>>('/lms/quizzes/');
  const [index, setIndex] = useState(0);
  const [questions, setQuestions] = useState(QUIZ.questions);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUIZ.questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const { toast } = useApp();

  useEffect(() => {
    const quiz = quizzesRes.data?.[0];
    if (!live || !quiz || !Array.isArray(quiz.questions)) return;
    const nextQuestions = quiz.questions as typeof QUIZ.questions;
    setQuestions(nextQuestions);
    setQuizId(String(quiz.id));
    setAnswers(Array(nextQuestions.length).fill(null));
    setIndex(0);
  }, [live, quizzesRes.data]);

  const q = questions[index] ?? QUIZ.questions[0];
  const score = answers.filter((a, i) => a === questions[i]?.answer).length;
  const pct = Math.round(score / Math.max(questions.length, 1) * 100);

  const choose = (i: number) => {
    const next = [...answers];
    next[index] = i;
    setAnswers(next);
  };

  const finish = async () => {
    setConfirm(false);
    if (live && quizId) {
      try {
        const result = await api.post<{ percentage: number }>(`/lms/quizzes/${quizId}/submit/`, { answers });
        toast({ tone: result.percentage >= 60 ? 'success' : 'warning', title: `Quiz complete — ${result.percentage}%`, body: 'Your attempt has been saved.' });
      } catch (error) {
        toast({ tone: 'warning', title: 'Quiz could not be submitted', body: error instanceof Error ? error.message : 'Please try again.' });
        return;
      }
    }
    setSubmitted(true);
    toast({ tone: pct >= 60 ? 'success' : 'warning', title: `Quiz complete — ${pct}%`, body: `You answered ${score} of ${questions.length} correctly.` });
  };

  if (submitted) {
    return (
      <div>
         <PageHeader title="Quiz results" subtitle={`${live && quizzesRes.data?.[0]?.title ? quizzesRes.data[0].title : QUIZ.title} · ${live && quizzesRes.data?.[0]?.subject_name ? quizzesRes.data[0].subject_name : QUIZ.subject}`} />
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <Card className="p-6 text-center">
              <p className="text-[13px] text-ink-muted">You scored</p>
              <p className="font-serif text-[52px] leading-none text-forest-800 mt-1">{pct}%</p>
              <p className="mt-2 text-[14px] text-ink-muted">
                 {score} of {questions.length} correct
              </p>
              <Progress className="mt-4 max-w-sm mx-auto" value={pct} tone={pct >= 60 ? 'forest' : 'gold'} label="Quiz score" />
            </Card>

            <Card className="p-5">
              <h2 className="text-[15px] font-semibold text-ink">Question review</h2>
              <ul className="mt-4 space-y-4">
                 {questions.map((question, i) => {
                  const correct = answers[i] === question.answer;
                  return (
                    <li key={i} className="rounded-lg border border-line p-4">
                      <div className="flex items-start gap-2.5">
                        {correct ? <CheckCircle2Icon size={18} className="mt-0.5 text-forest-600 shrink-0" /> : <XCircleIcon size={18} className="mt-0.5 text-red-500 shrink-0" />}
                        <div>
                          <p className="text-[14px] font-medium text-ink">{question.q}</p>
                          <p className="mt-1 text-[13px] text-ink-muted">
                            Your answer: {answers[i] != null ? question.options[answers[i] as number] : 'Not answered'} · Correct: {question.options[question.answer]}
                          </p>
                          <p className="mt-1 text-[13px] text-ink-muted italic">{question.why}</p>
                        </div>
                      </div>
                    </li>);

                })}
              </ul>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-5">
              <h3 className="text-[15px] font-semibold text-ink">What to work on next</h3>
              <ul className="mt-3 space-y-3">
                {RECOMMENDED_TOPICS.slice(0, 3).map((r) =>
                <li key={r.topic}>
                    <p className="text-[13.5px] font-medium text-ink">{r.topic}</p>
                    <p className="text-[12.5px] text-ink-muted">{r.activity}</p>
                    <Progress className="mt-1.5" value={r.progress} tone="gold" label={r.topic} />
                  </li>
                )}
              </ul>
            </Card>
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => {
                  setSubmitted(false);
                  setIndex(0);
                   setAnswers(Array(questions.length).fill(null));
                }}>
                
                Retake quiz
              </Button>
              <Link to="/student/learning">
                <Button variant="secondary" full>
                  Back to my learning
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>);

  }

  return (
    <div className="max-w-3xl">
      <PageHeader title={live && quizzesRes.data?.[0]?.title ? String(quizzesRes.data[0].title) : QUIZ.title} subtitle={`${live && quizzesRes.data?.[0]?.subject_name ? quizzesRes.data[0].subject_name : QUIZ.subject} · ${questions.length} questions · no time limit`} />

      <Card className="p-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[13px] font-medium text-ink-muted">
             Question {index + 1} of {questions.length}
          </p>
          <p className="text-[13px] text-ink-muted">{answers.filter((a) => a != null).length} answered</p>
        </div>
        <Progress className="mt-3" value={(index + 1) / Math.max(questions.length, 1) * 100} label="Quiz progress" />

        <motion.div key={index} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}>
          <h2 className="mt-6 font-serif text-[24px] leading-snug text-ink">{q.q}</h2>
          <ul className="mt-5 space-y-2.5" role="radiogroup" aria-label={q.q}>
            {q.options.map((o, i) => {
              const on = answers[index] === i;
              return (
                <li key={o}>
                  <button
                    role="radio"
                    aria-checked={on}
                    onClick={() => choose(i)}
                    className={cx(
                      'w-full flex items-center gap-3 rounded-lg border p-4 text-left transition-colors duration-150',
                      on ? 'border-forest-600 bg-forest-50' : 'border-line hover:border-forest-300'
                    )}>
                    
                    <span className={cx('h-6 w-6 shrink-0 rounded-full border-2 grid place-items-center text-[12px] font-semibold', on ? 'border-forest-600 bg-forest-600 text-white' : 'border-line text-ink-muted')}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-[15px] text-ink">{o}</span>
                  </button>
                </li>);

            })}
          </ul>
        </motion.div>

        <div className="mt-7 flex items-center justify-between gap-3 border-t border-line pt-5">
          <Button variant="ghost" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0}>
            Previous
          </Button>
           {index === questions.length - 1 ?
          <Button onClick={() => setConfirm(true)}>Submit quiz</Button> :

          <Button onClick={() => setIndex((i) => i + 1)}>Next question</Button>
          }
        </div>
      </Card>

      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={finish}
        title="Submit your quiz?"
         body={`You have answered ${answers.filter((a) => a != null).length} of ${questions.length} questions. You can retake this quiz twice.`}
        confirmLabel="Submit" />
      
    </div>);

}
