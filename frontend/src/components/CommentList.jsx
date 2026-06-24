import { formatDate } from '../utils/formatDate.js';

export function CommentList({ comments }) {
  if (!comments.length) return <p className="py-8 text-center text-sm text-slate-500">Non ci sono ancora commenti.</p>;
  return <div className="space-y-3">{comments.map((comment) => <article key={comment.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4"><div className="mb-2 flex justify-between gap-3 text-xs"><span className="font-bold text-slate-700">{comment.authorEmail}</span><time className="text-slate-500">{formatDate(comment.createdAt)}</time></div><p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{comment.text}</p></article>)}</div>;
}
