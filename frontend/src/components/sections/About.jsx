import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import RevealOnScroll from '../ui/RevealOnScroll';
import SectionHeading from '../ui/SectionHeading';
import api, { resolveImageUrl } from '../../utils/api';

const stats = [
  { value: '5+', label: 'Years Experience' },
  { value: '30+', label: 'Projects Delivered' },
  { value: '15+', label: 'Happy Clients' },
  { value: '12k+', label: 'GitHub Stars' },
];

export default function About() {
  const [adminInfo, setAdminInfo] = useState(null);

  useEffect(() => {
    api.get('/auth/public-admin')
      .then(({ data }) => setAdminInfo(data))
      .catch(() => {});
  }, []);

  return (
    <section id="about" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading eyebrow="// about.me" title="Who I Am" />

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Avatar */}
          <RevealOnScroll>
            <div className="relative mx-auto w-72 h-72 md:w-80 md:h-80">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border border-dashed border-primary-500/30"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-4 rounded-full border border-dashed border-accent/20"
              />
              <div className="absolute inset-8 rounded-full glass animate-glow overflow-hidden flex items-center justify-center">
                {adminInfo?.profileImage ? (
                  <img src={resolveImageUrl(adminInfo.profileImage)} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-8xl select-none">👨‍💻</span>
                )}
              </div>
            </div>
          </RevealOnScroll>

          {/* Text */}
          <div className="space-y-6">
            <RevealOnScroll delay={0.1}>
  <p className="text-dark-text text-lg leading-relaxed">
    I'm a passionate{' '}
    <span className="text-primary-600 dark:text-primary-400 font-semibold">
      Full-Stack Developer
    </span>{' '}
    from{' '}
    <span className="text-primary-600 dark:text-primary-400 font-semibold">
      Ethiopia
    </span>
    , focused on building modern, scalable, and user-friendly software applications.
  </p>
</RevealOnScroll>

<RevealOnScroll delay={0.2}>
  <p className="text-dark-text leading-relaxed">
    I work with a wide range of technologies, including{' '}
    <span className="text-accent font-semibold">
      JavaScript, Java, Python, PHP, React, Node.js, Express, and SQL/NoSQL databases
    </span>
    . I enjoy building responsive web applications, REST APIs, real-time systems,
    and AI-powered solutions.
  </p>
</RevealOnScroll>

<RevealOnScroll delay={0.3}>
  <p className="text-dark-text leading-relaxed">
    I'm passionate about solving real-world problems through software and continuously
    improving my skills in{' '}
    <span className="text-accent font-semibold">
      software architecture, backend development, AI, and system design
    </span>
    . I enjoy exploring new technologies and turning ideas into practical solutions.
  </p>
</RevealOnScroll>

            {/* Stats */}
            <RevealOnScroll delay={0.4}>
              <div className="grid grid-cols-2 gap-4 mt-8">
                {stats.map(({ value, label }) => (
                  <motion.div
                    key={label}
                    whileHover={{ scale: 1.04 }}
                    className="glass rounded-xl p-4 text-center"
                  >
                    <div className="font-display text-3xl font-bold gradient-text">{value}</div>
                    <div className="text-dark-text text-sm mt-1">{label}</div>
                  </motion.div>
                ))}
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
