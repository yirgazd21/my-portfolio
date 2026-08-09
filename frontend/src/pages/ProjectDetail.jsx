import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiGithub, FiExternalLink, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api, { resolveImageUrl } from '../utils/api';

function StarRating({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button key={s} type="button" onClick={() => onChange(s)}>
          <FiStar
            size={24}
            className={`transition-colors ${s <= value ? 'text-yellow-400 fill-yellow-400' : 'text-dark-text'}`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [form, setForm] = useState({ reviewerName: '', rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = () => api.get(`/projects/${id}`).then(({ data }) => setProject(data)).catch(() => navigate('/'));
  useEffect(() => { load(); }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/projects/${id}/reviews`, form);
      toast.success('Review submitted! Thank you 🙏');
      setForm({ reviewerName: '', rating: 5, comment: '' });
      load();
    } catch {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (!project) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-10 h-10 border-2 border-primary-500/20 border-t-primary-500 rounded-full" />
    </div>
  );

  const approvedReviews = project.reviews?.filter((r) => r.isApproved) || [];

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-dark-text hover:text-dark-title mb-8 transition-colors"
        >
          <FiArrowLeft /> Back to projects
        </motion.button>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-mono text-primary-600 dark:text-primary-400 uppercase tracking-widest">{project.category}</span>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-dark-title mt-1">{project.title}</h1>
            </div>
            <div className="flex gap-3">
              {project.sourceCodeLink && (
                <a href={project.sourceCodeLink} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 glass px-4 py-2 rounded-xl text-sm text-dark-title hover:border-primary-500/50 transition-all">
                  <FiGithub size={16} /> Code
                </a>
              )}
              {project.liveLink && (
                <a href={project.liveLink} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-xl text-sm text-white transition-colors">
                  <FiExternalLink size={16} /> Live Demo
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Image gallery */}
        {project.images?.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-10">
            <div className="rounded-2xl overflow-hidden h-72 md:h-96 mb-3">
              <img src={resolveImageUrl(project.images[imgIdx])} alt="" className="w-full h-full object-cover" />
            </div>
            {project.images.length > 1 && (
              <div className="flex gap-2">
                {project.images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === imgIdx ? 'border-primary-500' : 'border-dark-border'}`}>
                    <img src={resolveImageUrl(img)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Description */}
          <div className="md:col-span-2">
            <h2 className="font-display font-semibold text-dark-title text-xl mb-3">About this project</h2>
            <p className="text-dark-text leading-relaxed">{project.description}</p>
          </div>
          {/* Tech stack */}
          <div>
            <h2 className="font-display font-semibold text-dark-title text-xl mb-3">Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {project.techStack?.map((t) => (
                <span key={t} className="px-3 py-1 glass rounded-full text-primary-600 dark:text-primary-400 text-sm">{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="space-y-8">
          <h2 className="font-display font-semibold text-dark-title text-2xl">
            Reviews <span className="text-dark-text text-base font-normal">({approvedReviews.length})</span>
          </h2>

          {approvedReviews.length === 0 ? (
            <p className="text-dark-text italic">No reviews yet — be the first!</p>
          ) : (
            <div className="space-y-4">
              {approvedReviews.map((r) => (
                <motion.div key={r._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  className="glass rounded-xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-dark-title">{r.reviewerName}</span>
                    <div className="flex">
                      {[1,2,3,4,5].map((s) => (
                        <FiStar key={s} size={14} className={s <= r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-dark-text'} />
                      ))}
                    </div>
                  </div>
                  <p className="text-dark-text text-sm">{r.comment}</p>
                  <span className="text-xs text-dark-text/50 mt-2 block font-mono">{new Date(r.createdAt).toLocaleDateString()}</span>
                </motion.div>
              ))}
            </div>
          )}

          {/* Review form */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display font-semibold text-dark-title text-lg mb-5">Leave a Review</h3>
            <form onSubmit={submitReview} className="space-y-4">
              <input
                placeholder="Your name"
                value={form.reviewerName}
                onChange={(e) => setForm({ ...form, reviewerName: e.target.value })}
                required
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-dark-title placeholder-dark-text/50 focus:outline-none focus:border-primary-500 text-sm"
              />
              <div>
                <label className="text-dark-text text-sm mb-2 block">Rating</label>
                <StarRating value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
              </div>
              <textarea
                rows={4}
                placeholder="Share your thoughts..."
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                required
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-dark-title placeholder-dark-text/50 focus:outline-none focus:border-primary-500 resize-none text-sm"
              />
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
