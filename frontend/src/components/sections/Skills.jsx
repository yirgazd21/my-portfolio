import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import RevealOnScroll from '../ui/RevealOnScroll';
import SectionHeading from '../ui/SectionHeading';
import api from '../../utils/api';

const CATEGORIES = ['All', 'Frontend', 'Backend', 'Database', 'DevOps', 'Tools'];

const getValidIconClass = (iconStr) => {
  if (!iconStr) return '';
  let name = iconStr.trim();
  if (name === 'ri-reactis-line') return 'ri-reactjs-line';
  if (name === 'ri-node-is') return 'ri-node-js';
  return name;
};

const getBrandColorStyle = (iconName) => {
  if (!iconName) return '#0ea5e9';
  const name = iconName.toLowerCase();
  if (name.includes('react')) return '#61dafb';
  if (name.includes('node')) return '#339933';
  if (name.includes('css') || name.includes('tailwind')) return '#38bdf8';
  if (name.includes('html')) return '#e34f26';
  if (name.includes('js') || name.includes('javascript')) return '#f7df1e';
  if (name.includes('database') || name.includes('postgres') || name.includes('sql')) return '#336791';
  if (name.includes('leaf') || name.includes('mongo')) return '#47a248';
  if (name.includes('docker')) return '#2496ed';
  if (name.includes('cloud') || name.includes('aws')) return '#ff9900';
  if (name.includes('git') || name.includes('github')) return '#f05032';
  if (name.includes('figma')) return '#f24e1e';
  if (name.includes('animation') || name.includes('framer')) return '#e91e63';
  return '#0ea5e9';
};

function SkillCard({ skill, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const validIcon = getValidIconClass(skill.icon);
  const isRemix = validIcon.startsWith('ri-');

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ scale: 1.03, borderColor: 'rgba(14, 165, 233, 0.4)' }}
      className="glass rounded-xl p-5 border border-dark-border transition-all"
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-dark-bg border border-dark-border" style={{ color: isRemix ? getBrandColorStyle(validIcon) : undefined }}>
          {isRemix ? <i className={`${validIcon} text-2xl`}></i> : (skill.icon || '⚙️')}
        </span>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-dark-title font-medium text-sm">{skill.name}</span>
            <span className="text-primary-600 dark:text-primary-400 text-xs font-mono">{skill.proficiency}%</span>
          </div>
          <div className="h-1.5 bg-dark-border rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={inView ? { width: `${skill.proficiency}%` } : {}}
              transition={{ duration: 1.2, delay: index * 0.05 + 0.3, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-primary-600 to-accent"
            />
          </div>
        </div>
      </div>
      <span className="text-xs text-dark-text font-mono px-2 py-0.5 bg-dark-bg rounded-full">
        {skill.category}
      </span>
    </motion.div>
  );
}

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [active, setActive] = useState('All');

  useEffect(() => {
    api.get('/skills').then(({ data }) => setSkills(data)).catch(() => {});
  }, []);

  const filtered = active === 'All' ? skills : skills.filter((s) => s.category === active);

  return (
    <section id="skills" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading eyebrow="// stack" title="Skills & Technologies" />

        {/* Category filter */}
        <RevealOnScroll>
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActive(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  active === cat
                    ? 'bg-primary-600 text-white'
                    : 'glass text-dark-text hover:text-dark-title'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </RevealOnScroll>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((skill, i) => (
            <SkillCard key={skill._id} skill={skill} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
