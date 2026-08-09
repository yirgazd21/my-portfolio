import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiBriefcase, FiBook } from 'react-icons/fi';
import RevealOnScroll from '../ui/RevealOnScroll';
import SectionHeading from '../ui/SectionHeading';
import api from '../../utils/api';

const fmt = (date) =>
  date ? new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present';

export default function Experience() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/experiences').then(({ data }) => setItems(data)).catch(() => {});
  }, []);

  const filtered = items.filter((i) => filter === 'all' || i.type === filter);

  return (
    <section id="experience" className="py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeading eyebrow="// journey" title="Experience & Education" />

        {/* Filter tabs */}
        <div className="flex justify-center gap-3 mb-16">
          {['all', 'work', 'education'].map((f) => (
            <motion.button
              key={f}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full font-medium text-sm capitalize transition-all ${
                filter === f
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/40'
                  : 'glass text-dark-text hover:text-dark-title'
              }`}
            >
              {f}
            </motion.button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="timeline-line hidden md:block" />

          <div className="space-y-8">
            {filtered.map((item, i) => (
              <RevealOnScroll key={item._id} delay={i * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className={`relative flex flex-col md:flex-row gap-6 ${
                    i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Card */}
                  <div className="md:w-5/12 glass rounded-2xl p-6 hover:border-primary-500/40 transition-all">
                    <div className="flex items-start gap-3 mb-3">
                      <span className={`p-2 rounded-lg ${item.type === 'work' ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400' : 'bg-accent/10 text-accent'}`}>
                        {item.type === 'work' ? <FiBriefcase size={16} /> : <FiBook size={16} />}
                      </span>
                      <div>
                        <h3 className="font-display font-semibold text-dark-title">{item.title}</h3>
                        <p className="text-primary-600 dark:text-primary-400 text-sm font-medium">{item.organization}</p>
                      </div>
                    </div>
                    <p className="text-dark-text text-sm mb-3 leading-relaxed">{item.description}</p>
                    <div className="flex items-center gap-2 text-xs text-dark-text font-mono">
                      <span>{fmt(item.startDate)}</span>
                      <span>→</span>
                      <span className={item.current ? 'text-green-600 dark:text-green-400' : ''}>{item.current ? 'Present' : fmt(item.endDate)}</span>
                    </div>
                    {item.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {item.skills.map((s) => (
                          <span key={s} className="text-xs px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Center dot */}
                  <div className="hidden md:flex md:w-2/12 justify-center items-start pt-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      className="w-4 h-4 rounded-full border-2 border-primary-500 bg-dark-bg"
                    />
                  </div>

                  {/* Spacer */}
                  <div className="hidden md:block md:w-5/12" />
                </motion.div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
