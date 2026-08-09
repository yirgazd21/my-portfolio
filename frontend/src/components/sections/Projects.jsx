import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiExternalLink, FiStar, FiMessageSquare } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import RevealOnScroll from '../ui/RevealOnScroll';
import SectionHeading from '../ui/SectionHeading';
import api, { resolveImageUrl } from '../../utils/api';

function ProjectCard({ project, index }) {
  const navigate = useNavigate();
  const approvedReviews = project.reviews?.filter((r) => r.isApproved) || [];
  const avgRating = approvedReviews.length
    ? (approvedReviews.reduce((a, r) => a + r.rating, 0) / approvedReviews.length).toFixed(1)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      className="glass rounded-2xl overflow-hidden border border-dark-border hover:border-primary-500/40 transition-all group"
    >
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={resolveImageUrl(project.images?.[0]) || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800'}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />
        {project.featured && (
          <span className="absolute top-3 left-3 text-xs font-mono px-2.5 py-1 bg-primary-600/90 text-white rounded-full backdrop-blur-sm">
            ⭐ Featured
          </span>
        )}
        <span className="absolute top-3 right-3 text-xs font-mono px-2.5 py-1 glass text-dark-text rounded-full">
          {project.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-display font-bold text-dark-title text-lg mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-dark-text text-sm leading-relaxed mb-4 line-clamp-2">
          {project.shortDescription || project.description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.techStack?.slice(0, 4).map((t) => (
            <span key={t} className="text-xs px-2 py-0.5 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-full">
              {t}
            </span>
          ))}
          {project.techStack?.length > 4 && (
            <span className="text-xs px-2 py-0.5 bg-dark-border text-dark-text rounded-full">
              +{project.techStack.length - 4}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-dark-border">
          <div className="flex items-center gap-4">
            {project.sourceCodeLink && (
              <a href={project.sourceCodeLink} target="_blank" rel="noreferrer"
                className="text-dark-text hover:text-dark-title transition-colors" title="Source code">
                <FiGithub size={18} />
              </a>
            )}
            {project.liveLink && (
              <a href={project.liveLink} target="_blank" rel="noreferrer"
                className="text-dark-text hover:text-primary-600 dark:hover:text-primary-400 transition-colors" title="Live demo">
                <FiExternalLink size={18} />
              </a>
            )}
            <button
              onClick={() => navigate(`/project/${project._id}`)}
              className="flex items-center gap-1.5 text-dark-text hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-xs"
            >
              <FiMessageSquare size={14} />
              <span>{approvedReviews.length} review{approvedReviews.length !== 1 ? 's' : ''}</span>
            </button>
          </div>
          {avgRating && (
            <div className="flex items-center gap-1 text-yellow-400 text-sm">
              <FiStar size={14} />
              <span className="font-mono text-xs">{avgRating}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Web App', 'API', 'ML/AI', 'Mobile App'];

  useEffect(() => {
    api.get('/projects').then(({ data }) => setProjects(data)).catch(() => {});
  }, []);

  const filtered = filter === 'All' ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading eyebrow="// portfolio" title="My Projects" subtitle="A selection of things I've built — click any project to read more and leave a review." />

        <RevealOnScroll>
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === cat ? 'bg-primary-600 text-white' : 'glass text-dark-text hover:text-dark-title'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </RevealOnScroll>

        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((project, i) => (
              <ProjectCard key={project._id} project={project} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
