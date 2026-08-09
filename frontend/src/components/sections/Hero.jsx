import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { FiGithub, FiLinkedin, FiMail, FiArrowDown } from 'react-icons/fi';

const socials = [
  { icon: FiGithub, href: 'https://github.com', label: 'GitHub' },
  { icon: FiLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: FiMail, href: 'mailto:hello@portfolio.dev', label: 'Email' },
];

export default function Hero() {
  return (
    <section
      id="home"
      className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 relative overflow-hidden"
    >
      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8"
      >
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-dark-text text-sm font-mono">Available for work</span>
      </motion.div>

      {/* Name */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-dark-title mb-4 leading-none"
      >
        Hi, I'm{' '}
        <span className="gradient-text">
        Yirgalem Zegeye
        </span>
      </motion.h1>

      {/* Typing animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="text-xl md:text-2xl text-dark-text font-mono mb-6 h-8"
      >
        <TypeAnimation
          sequence={[
            'Full-Stack Developer', 2000,
            'MERN Stack Engineer', 2000,
            'AI Solutions Developer', 2000,
            'Backend & API Developer', 2000,
          ]}
          wrapper="span"
          speed={50}
          repeat={Infinity}
        />
      </motion.div>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.45 }}
        className="text-dark-text max-w-2xl text-lg leading-relaxed mb-10"
      >
        I design and build scalable web systems with modern technologies, combining clean architecture, real-time functionality, and AI-powered solutions to solve real-world problems.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="flex flex-wrap items-center justify-center gap-4 mb-12"
      >
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(14,165,233,0.4)' }}
          whileTap={{ scale: 0.97 }}
          onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
          className="px-8 py-3.5 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-colors"
        >
          View My Work
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
          className="px-8 py-3.5 glass hover:border-primary-500 text-dark-title font-semibold rounded-xl border border-dark-border transition-all"
        >
          Get In Touch
        </motion.button>
      </motion.div>

      {/* Socials */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex items-center gap-4"
      >
        {socials.map(({ icon: Icon, href, label }) => (
          <motion.a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            whileHover={{ scale: 1.2, color: '#0ea5e9' }}
            className="p-3 glass rounded-xl text-dark-text hover:text-primary-400 transition-colors"
          >
            <Icon size={20} />
          </motion.a>
        ))}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-dark-text"
      >
        <span className="text-xs font-mono tracking-widest">SCROLL</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <FiArrowDown size={18} />
        </motion.div>
      </motion.div>
    </section>
  );
}
