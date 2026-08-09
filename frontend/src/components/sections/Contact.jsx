import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiMail, FiMapPin, FiGithub } from 'react-icons/fi';
import toast from 'react-hot-toast';
import RevealOnScroll from '../ui/RevealOnScroll';
import SectionHeading from '../ui/SectionHeading';
import api from '../../utils/api';

const info = [
  { icon: FiMail, label: 'Email', value: 'yirgazdofficial@gmail.com' },
  { icon: FiMapPin, label: 'Location', value: 'Addis Ababa, Ethiopia' },
  { icon: FiGithub, label: 'GitHub', value: 'github.com/alexbekele' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const { data } = await api.post('/contact', form);
      toast.success(data.message || "Message sent! I'll be in touch soon. 🚀");
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeading eyebrow="// contact" title="Let's Work Together" subtitle="Have a project in mind or want to chat? Drop me a message." />

        <div className="grid md:grid-cols-2 gap-12">
          {/* Info */}
          <RevealOnScroll>
            <div className="space-y-6">
              <p className="text-dark-text leading-relaxed text-lg">
                I'm currently open to new opportunities. Whether it's a full-time role, 
                freelance project, or just a technical conversation — I'd love to hear from you.
              </p>
              {info.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="p-3 glass rounded-xl text-primary-600 dark:text-primary-400">
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-dark-text font-mono">{label}</div>
                    <div className="text-dark-title font-medium">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </RevealOnScroll>

          {/* Form */}
          <RevealOnScroll delay={0.2}>
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-5">
              {[
                { id: 'name', label: 'Name', type: 'text', placeholder: 'Your name' },
                { id: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
              ].map((field) => (
                <div key={field.id}>
                  <label className="block text-dark-text text-sm mb-1.5 font-medium">{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.id]}
                    onChange={(e) => setForm({ ...form, [field.id]: e.target.value })}
                    required
                    className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-dark-title placeholder-dark-text/50 focus:outline-none focus:border-primary-500 transition-colors text-sm"
                  />
                </div>
              ))}
              <div>
                <label className="block text-dark-text text-sm mb-1.5 font-medium">Message</label>
                <textarea
                  rows={5}
                  placeholder="Tell me about your project..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-dark-title placeholder-dark-text/50 focus:outline-none focus:border-primary-500 transition-colors resize-none text-sm"
                />
              </div>
              <motion.button
                type="submit"
                disabled={sending}
                whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(14,165,233,0.3)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
              >
                {sending ? (
                  <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                ) : (
                  <><FiSend size={18} /> Send Message</>
                )}
              </motion.button>
            </form>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
