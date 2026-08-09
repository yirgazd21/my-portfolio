import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiLogOut, FiStar, FiToggleLeft, FiToggleRight, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api, { resolveImageUrl } from '../utils/api';

const TABS = ['Projects', 'Skills', 'Experience', 'Reviews', 'Admins'];

// ─── Reusable modal wrapper ─────────────────────────────
function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="glass rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}>
          <h2 className="font-display text-xl font-bold text-dark-title mb-5">{title}</h2>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Project CRUD ──────────────────────────────────────
function ProjectsTab() {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', shortDescription: '', description: '', sourceCodeLink: '', liveLink: '', techStack: '', category: 'Web App', featured: false });

  const load = () => api.get('/projects').then(({ data }) => setItems(data));
  useEffect(() => { load(); }, []);

  const openEdit = (item) => {
    setEditing(item);
    setForm({ ...item, techStack: item.techStack?.join(', ') || '' });
    setModal(true);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', shortDescription: '', description: '', sourceCodeLink: '', liveLink: '', techStack: '', category: 'Web App', featured: false });
    setModal(true);
  };

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...form, techStack: form.techStack.split(',').map((t) => t.trim()).filter(Boolean) };
    try {
      if (editing) {
        await api.put(`/projects/${editing._id}`, payload);
        toast.success('Project updated');
      } else {
        await api.post('/projects', payload);
        toast.success('Project created');
      }
      setModal(false);
      load();
    } catch { toast.error('Save failed'); }
  };

  const del = async (id) => {
    if (!confirm('Delete this project?')) return;
    try { await api.delete(`/projects/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const fieldClass = "w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-dark-title text-sm focus:outline-none focus:border-primary-500";

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-display text-xl font-bold text-dark-title">Projects ({items.length})</h3>
        <motion.button whileTap={{ scale: 0.95 }} onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm rounded-xl transition-colors">
          <FiPlus size={16} /> Add Project
        </motion.button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <motion.div key={item._id} layout className="glass rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-dark-title font-medium truncate">{item.title}</p>
                {item.featured && <span className="text-xs px-2 py-0.5 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-full">Featured</span>}
              </div>
              <p className="text-dark-text text-xs truncate">{item.shortDescription}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEdit(item)} className="p-2 glass rounded-lg text-dark-text hover:text-primary-600 dark:hover:text-primary-400 transition-colors"><FiEdit2 size={15} /></button>
              <button onClick={() => del(item._id)} className="p-2 glass rounded-lg text-dark-text hover:text-red-400 transition-colors"><FiTrash2 size={15} /></button>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Project' : 'New Project'}>
        <form onSubmit={save} className="space-y-3">
          {[['title', 'Title'], ['shortDescription', 'Short Description'], ['sourceCodeLink', 'Source Code URL'], ['liveLink', 'Live Demo URL'], ['techStack', 'Tech Stack (comma-separated)']].map(([key, label]) => (
            <div key={key}>
              <label className="text-dark-text text-xs mb-1 block">{label}</label>
              <input value={form[key] || ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className={fieldClass} />
            </div>
          ))}
          <div>
            <label className="text-dark-text text-xs mb-1 block">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${fieldClass} resize-none`} />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-dark-text text-xs mb-1 block">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={fieldClass}>
                {['Web App', 'Mobile App', 'API', 'ML/AI', 'Other'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 text-dark-text text-sm cursor-pointer mt-5">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-primary-500" />
              Featured
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="flex-1 py-2.5 glass rounded-xl text-dark-text hover:text-white text-sm transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-semibold transition-colors">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ─── Skills CRUD ──────────────────────────────────────
function SkillsTab() {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', icon: '', proficiency: 80, category: 'Frontend' });

  const load = () => api.get('/skills').then(({ data }) => setItems(data));
  useEffect(() => { load(); }, []);

  const openEdit = (item) => { setEditing(item); setForm(item); setModal(true); };
  const openCreate = () => { setEditing(null); setForm({ name: '', icon: '', proficiency: 80, category: 'Frontend' }); setModal(true); };

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing) await api.put(`/skills/${editing._id}`, form);
      else await api.post('/skills', form);
      toast.success('Saved'); setModal(false); load();
    } catch { toast.error('Save failed'); }
  };

  const del = async (id) => {
    if (!confirm('Delete?')) return;
    await api.delete(`/skills/${id}`); toast.success('Deleted'); load();
  };

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

  const fieldClass = "w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-dark-title text-sm focus:outline-none focus:border-primary-500";

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-display text-xl font-bold text-dark-title">Skills ({items.length})</h3>
        <motion.button whileTap={{ scale: 0.95 }} onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm rounded-xl transition-colors">
          <FiPlus size={16} /> Add Skill
        </motion.button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {items.map((item) => {
          const validIcon = getValidIconClass(item.icon);
          const isRemix = validIcon.startsWith('ri-');
          return (
            <motion.div key={item._id} layout className="glass rounded-xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xl shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-dark-bg border border-dark-border" style={{ color: isRemix ? getBrandColorStyle(validIcon) : undefined }}>
                  {isRemix ? <i className={`${validIcon} text-xl`}></i> : (item.icon || '⚙️')}
                </span>
                <div>
                  <p className="text-dark-title text-sm font-medium">{item.name}</p>
                  <p className="text-dark-text text-xs">{item.category} · {item.proficiency}%</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(item)} className="p-1.5 glass rounded-lg text-dark-text hover:text-primary-600 dark:hover:text-primary-400 transition-colors"><FiEdit2 size={14} /></button>
                <button onClick={() => del(item._id)} className="p-1.5 glass rounded-lg text-dark-text hover:text-red-400 transition-colors"><FiTrash2 size={14} /></button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Skill' : 'New Skill'}>
        <form onSubmit={save} className="space-y-3">
          {[['name', 'Name'], ['icon', 'Icon (emoji)']].map(([key, label]) => (
            <div key={key}>
              <label className="text-dark-text text-xs mb-1 block">{label}</label>
              <input value={form[key] || ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className={fieldClass} />
            </div>
          ))}
          <div>
            <label className="text-dark-text text-xs mb-1 block">Proficiency ({form.proficiency}%)</label>
            <input type="range" min={0} max={100} value={form.proficiency} onChange={(e) => setForm({ ...form, proficiency: +e.target.value })} className="w-full accent-primary-500" />
          </div>
          <div>
            <label className="text-dark-text text-xs mb-1 block">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={fieldClass}>
              {['Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'Tools', 'Other'].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="flex-1 py-2.5 glass rounded-xl text-dark-text text-sm">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ─── Experience CRUD ──────────────────────────────────
function ExperienceTab() {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    type: 'work',
    title: '',
    organization: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    skills: '',
    order: 0
  });

  const load = () => api.get('/experiences').then(({ data }) => setItems(data));
  useEffect(() => { load(); }, []);

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      ...item,
      startDate: item.startDate ? new Date(item.startDate).toISOString().split('T')[0] : '',
      endDate: item.endDate ? new Date(item.endDate).toISOString().split('T')[0] : '',
      skills: item.skills?.join(', ') || ''
    });
    setModal(true);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({
      type: 'work',
      title: '',
      organization: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      skills: '',
      order: 0
    });
    setModal(true);
  };

  const save = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      endDate: form.current ? null : (form.endDate || null),
      skills: form.skills.split(',').map((t) => t.trim()).filter(Boolean)
    };
    try {
      if (editing) {
        await api.put(`/experiences/${editing._id}`, payload);
        toast.success('Entry updated');
      } else {
        await api.post('/experiences', payload);
        toast.success('Entry created');
      }
      setModal(false);
      load();
    } catch {
      toast.error('Save failed');
    }
  };

  const del = async (id) => {
    if (!confirm('Delete this entry?')) return;
    try {
      await api.delete(`/experiences/${id}`);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  const fieldClass = "w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-dark-title text-sm focus:outline-none focus:border-primary-500";

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-display text-xl font-bold text-dark-title">Experience & Education ({items.length})</h3>
        <motion.button whileTap={{ scale: 0.95 }} onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm rounded-xl transition-colors">
          <FiPlus size={16} /> Add Entry
        </motion.button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <motion.div key={item._id} layout className="glass rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs px-2.5 py-0.5 rounded-full ${item.type === 'work' ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400' : 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400'}`}>
                  {item.type}
                </span>
                <p className="text-dark-title font-medium truncate">{item.title}</p>
              </div>
              <p className="text-dark-text text-xs truncate">{item.organization} {item.location && `· ${item.location}`}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEdit(item)} className="p-2 glass rounded-lg text-dark-text hover:text-primary-600 dark:hover:text-primary-400 transition-colors"><FiEdit2 size={15} /></button>
              <button onClick={() => del(item._id)} className="p-2 glass rounded-lg text-dark-text hover:text-red-400 transition-colors"><FiTrash2 size={15} /></button>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Entry' : 'New Entry'}>
        <form onSubmit={save} className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-dark-text text-xs mb-1 block">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={fieldClass}>
                <option value="work">Work</option>
                <option value="education">Education</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-dark-text text-xs mb-1 block">Order (sorting)</label>
              <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: +e.target.value })} className={fieldClass} />
            </div>
          </div>
          {[['title', 'Title (e.g. Frontend Engineer)'], ['organization', 'Organization (e.g. Google)'], ['location', 'Location (e.g. Remote / Addis Ababa)'], ['skills', 'Tech Stack / Skills (comma-separated)']].map(([key, label]) => (
            <div key={key}>
              <label className="text-dark-text text-xs mb-1 block">{label}</label>
              <input value={form[key] || ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className={fieldClass} />
            </div>
          ))}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-dark-text text-xs mb-1 block">Start Date</label>
              <input type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className={fieldClass} />
            </div>
            <div className="flex-1">
              <label className="text-dark-text text-xs mb-1 block">End Date</label>
              <input type="date" disabled={form.current} value={form.endDate || ''} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className={fieldClass} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-dark-text text-sm cursor-pointer mt-1">
            <input type="checkbox" checked={form.current} onChange={(e) => setForm({ ...form, current: e.target.checked })} className="accent-primary-500" />
            Current (Present)
          </label>
          <div>
            <label className="text-dark-text text-xs mb-1 block">Description</label>
            <textarea rows={3} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${fieldClass} resize-none`} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="flex-1 py-2.5 glass rounded-xl text-dark-text hover:text-dark-title text-sm transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-semibold transition-colors">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ─── Reviews moderation ────────────────────────────────
function ReviewsTab() {
  const [projects, setProjects] = useState([]);

  const load = () => api.get('/projects').then(({ data }) => setProjects(data));
  useEffect(() => { load(); }, []);

  const toggle = async (projectId, reviewId) => {
    await api.patch(`/projects/${projectId}/reviews/${reviewId}/toggle`);
    load();
  };
  const del = async (projectId, reviewId) => {
    if (!confirm('Delete review?')) return;
    await api.delete(`/projects/${projectId}/reviews/${reviewId}`);
    toast.success('Review deleted'); load();
  };

  const allReviews = projects.flatMap((p) => p.reviews.map((r) => ({ ...r, projectTitle: p.title, projectId: p._id })));

  return (
    <div>
      <h3 className="font-display text-xl font-bold text-dark-title mb-6">Reviews ({allReviews.length})</h3>
      <div className="space-y-3">
        {allReviews.map((r) => (
          <motion.div key={r._id} layout className="glass rounded-xl p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-dark-title font-medium text-sm">{r.reviewerName}</span>
                  <div className="flex">
                    {[1,2,3,4,5].map((s) => <FiStar key={s} size={11} className={s <= r.rating ? 'text-yellow-400' : 'text-dark-text'} />)}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${r.isApproved ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                    {r.isApproved ? 'Approved' : 'Hidden'}
                  </span>
                </div>
                <p className="text-dark-text text-sm">{r.comment}</p>
                <p className="text-dark-text/50 text-xs mt-1 font-mono">on "{r.projectTitle}"</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => toggle(r.projectId, r._id)} className="p-2 glass rounded-lg text-dark-text hover:text-primary-400 transition-colors">
                  {r.isApproved ? <FiToggleRight size={16} /> : <FiToggleLeft size={16} />}
                </button>
                <button onClick={() => del(r.projectId, r._id)} className="p-2 glass rounded-lg text-dark-text hover:text-red-400 transition-colors">
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        {allReviews.length === 0 && <p className="text-dark-text italic">No reviews yet.</p>}
      </div>
    </div>
  );
}

// ─── Admins CRUD ──────────────────────────────────────
function AdminsTab() {
  const { admin: currentAdmin } = useAuth();
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ username: '', email: '', password: '', profileImage: '' });

  const load = () => api.get('/auth/admins').then(({ data }) => setItems(data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    const toastId = toast.loading('Uploading image...');
    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setForm((prev) => ({ ...prev, profileImage: data.url }));
      toast.success('Uploaded successfully!', { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed', { id: toastId });
    }
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ username: item.username, email: item.email, password: '', profileImage: item.profileImage || '' });
    setModal(true);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ username: '', email: '', password: '', profileImage: '' });
    setModal(true);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || (!editing && !form.password)) {
      toast.error('Please fill in all required fields');
      return;
    }
    const payload = { username: form.username, email: form.email, profileImage: form.profileImage };
    if (form.password) payload.password = form.password;

    try {
      if (editing) {
        await api.put(`/auth/admins/${editing._id}`, payload);
        toast.success('Admin updated');
      } else {
        await api.post('/auth/admins', payload);
        toast.success('Admin created');
      }
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    }
  };

  const del = async (id) => {
    if (id === currentAdmin?.id || id === currentAdmin?._id) {
      toast.error('You cannot delete your own admin account');
      return;
    }
    if (!confirm('Are you sure you want to delete this admin account?')) return;
    try {
      await api.delete(`/auth/admins/${id}`);
      toast.success('Admin deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const fieldClass = "w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-dark-title text-sm focus:outline-none focus:border-primary-500";

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-display text-xl font-bold text-dark-title">Admin Accounts ({items.length})</h3>
        <motion.button whileTap={{ scale: 0.95 }} onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm rounded-xl transition-colors">
          <FiPlus size={16} /> Add Admin
        </motion.button>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const isSelf = item._id === currentAdmin?.id || item._id === currentAdmin?._id;
          return (
            <motion.div key={item._id} layout className="glass rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xl shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-dark-bg border border-dark-border text-primary-500 overflow-hidden">
                  {item.profileImage ? (
                    <img src={resolveImageUrl(item.profileImage)} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <FiUser size={18} />
                  )}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-dark-title font-medium truncate">{item.username}</p>
                    {isSelf && <span className="text-[10px] px-1.5 py-0.5 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-full font-semibold">You</span>}
                  </div>
                  <p className="text-dark-text text-xs truncate">{item.email}</p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(item)} className="p-2 glass rounded-lg text-dark-text hover:text-primary-600 dark:hover:text-primary-400 transition-colors" title="Edit Admin"><FiEdit2 size={15} /></button>
                {!isSelf && (
                  <button onClick={() => del(item._id)} className="p-2 glass rounded-lg text-dark-text hover:text-red-400 transition-colors" title="Delete Admin"><FiTrash2 size={15} /></button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Admin Profile' : 'New Admin Account'}>
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="text-dark-text text-xs mb-1 block">Username</label>
            <input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className={fieldClass} />
          </div>
          <div>
            <label className="text-dark-text text-xs mb-1 block">Email Address</label>
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={fieldClass} />
          </div>
          <div>
            <label className="text-dark-text text-xs mb-1 block">Profile Image</label>
            <div className="flex gap-3 items-center mb-2">
              {form.profileImage && (
                <img src={resolveImageUrl(form.profileImage)} alt="" className="w-12 h-12 rounded-xl object-cover bg-dark-bg border border-dark-border" />
              )}
              <div className="flex-1">
                <input placeholder="Image URL (or choose file below)" value={form.profileImage} onChange={(e) => setForm({ ...form, profileImage: e.target.value })} className={fieldClass} />
              </div>
            </div>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="text-xs text-dark-text file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary-600 file:text-white hover:file:bg-primary-500 file:cursor-pointer cursor-pointer" />
          </div>
          <div>
            <label className="text-dark-text text-xs mb-1 block">
              Password {editing && <span className="text-dark-text/60 italic">(leave blank to keep current)</span>}
            </label>
            <input type="password" required={!editing} minLength={6} placeholder={editing ? '••••••••' : ''} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={fieldClass} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="flex-1 py-2.5 glass rounded-xl text-dark-text text-sm">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ─── Main dashboard ────────────────────────────────────
export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('Projects');

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen pt-6 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-5 mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-dark-title text-xl">Admin Dashboard</h1>
            <p className="text-dark-text text-sm">Logged in as <span className="text-primary-600 dark:text-primary-400">{admin?.email}</span></p>
          </div>
          <div className="flex gap-3">
            <a href="/" target="_blank" className="px-4 py-2 glass rounded-xl text-sm text-dark-text hover:text-dark-title transition-colors">
              View Site
            </a>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-sm text-dark-text hover:text-red-400 transition-colors">
              <FiLogOut size={15} /> Logout
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {TABS.map((t) => (
            <motion.button key={t} whileTap={{ scale: 0.95 }} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-xl font-medium text-sm transition-all ${tab === t ? 'bg-primary-600 text-white' : 'glass text-dark-text hover:text-dark-title'}`}>
              {t}
            </motion.button>
          ))}
        </div>

        {/* Tab content */}
        <motion.div key={tab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }} className="glass rounded-2xl p-6">
          {tab === 'Projects' && <ProjectsTab />}
          {tab === 'Skills' && <SkillsTab />}
          {tab === 'Experience' && <ExperienceTab />}
          {tab === 'Reviews' && <ReviewsTab />}
          {tab === 'Admins' && <AdminsTab />}
        </motion.div>
      </div>
    </div>
  );
}
