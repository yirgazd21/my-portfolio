import Navbar from '../components/layout/Navbar';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Experience from '../components/sections/Experience';
import Skills from '../components/sections/Skills';
import Projects from '../components/sections/Projects';
import Contact from '../components/sections/Contact';
import ParticleBackground from '../components/ui/ParticleBackground';

export default function Home() {
  return (
    <div className="bg-dark-bg min-h-screen noise">
      <ParticleBackground />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <footer className="text-center py-8 text-dark-text text-sm font-mono border-t border-dark-border">
        <p>Built with <span className="text-primary-600 dark:text-primary-400">MERN</span> + <span className="text-accent">Framer Motion</span> · © {new Date().getFullYear()} Alex Bekele</p>
      </footer>
    </div>
  );
}
