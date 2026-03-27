'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

type Skill = {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  iconUrl?: string | null;
  color?: string | null;
  order: number;
};

type Achievement = {
  id: string;
  title: string;
  description: string;
  date: string;
  issuer?: string | null;
  imageUrl?: string | null;
  link?: string | null;
  order: number;
};

type Project = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  demoUrl?: string | null;
  githubUrl?: string | null;
  techStack: string;
  order: number;
};

type Tab = 'skills' | 'certificates' | 'projects' | 'uploads';

const initialSkill = {
  name: '',
  category: '',
  proficiency: 80,
  iconUrl: '',
  color: '',
};

const initialAchievement = {
  title: '',
  description: '',
  date: '',
  issuer: '',
  imageUrl: '',
  link: '',
};

const initialProject = {
  title: '',
  description: '',
  imageUrl: '',
  demoUrl: '',
  githubUrl: '',
  techStack: '',
};

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : ({} as T);
}

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<Tab>('skills');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authError, setAuthError] = useState('');

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  const [skills, setSkills] = useState<Skill[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [skillForm, setSkillForm] = useState(initialSkill);
  const [achievementForm, setAchievementForm] = useState(initialAchievement);
  const [projectForm, setProjectForm] = useState(initialProject);

  const [editingSkillId, setEditingSkillId] = useState('');
  const [editingAchievementId, setEditingAchievementId] = useState('');
  const [editingProjectId, setEditingProjectId] = useState('');

  const [uploading, setUploading] = useState(false);
  const [uploadAlt, setUploadAlt] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [lastUploadedUrl, setLastUploadedUrl] = useState('');

  const [message, setMessage] = useState('');

  const loginHint = useMemo(() => {
    return 'If you forgot password, run: npm run admin:reset -- --username=admin --password=YourNewPass123';
  }, []);

  async function checkAuth() {
    setIsCheckingAuth(true);
    try {
      const res = await fetch('/api/auth/me');
      const data = await parseJson<{ authenticated?: boolean }>(res);
      setIsLoggedIn(Boolean(data.authenticated));
    } catch {
      setIsLoggedIn(false);
    } finally {
      setIsCheckingAuth(false);
    }
  }

  async function loadAll() {
    const [skillsRes, achievementsRes, projectsRes] = await Promise.all([
      fetch('/api/skills'),
      fetch('/api/achievements'),
      fetch('/api/projects'),
    ]);

    if (!skillsRes.ok || !achievementsRes.ok || !projectsRes.ok) {
      throw new Error('Failed to load dashboard data.');
    }

    const fetchedSkills = await parseJson<Skill[]>(skillsRes);
    const fetchedAchievements = await parseJson<Achievement[]>(achievementsRes);
    const rawProjects = await parseJson<Array<Project & { techStack?: string }>>(projectsRes);

    setSkills(fetchedSkills);
    setAchievements(fetchedAchievements);
    setProjects(
      rawProjects.map((item) => ({
        ...item,
        techStack: typeof item.techStack === 'string' ? item.techStack : '[]',
      }))
    );
  }

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadAll().catch(() => setMessage('Failed to load some data.'));
    }
  }, [isLoggedIn]);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setAuthError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });

      const data = await parseJson<{ error?: string }>(res);
      if (!res.ok) {
        setAuthError(data.error || 'Login failed.');
        return;
      }

      setIsLoggedIn(true);
      setMessage('Logged in successfully.');
    } catch {
      setAuthError('Login failed.');
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setIsLoggedIn(false);
    setMessage('Logged out.');
  }

  async function submitSkill(event: FormEvent) {
    event.preventDefault();
    const payload = {
      ...skillForm,
      proficiency: Number(skillForm.proficiency),
      order: skills.length,
      ...(editingSkillId ? { id: editingSkillId } : {}),
    };

    const res = await fetch('/api/skills', {
      method: editingSkillId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      setMessage('Failed to save skill.');
      return;
    }

    setSkillForm(initialSkill);
    setEditingSkillId('');
    await loadAll();
    setMessage('Skill saved.');
  }

  async function deleteSkill(id: string) {
    if (!window.confirm('Delete this skill?')) return;
    const res = await fetch(`/api/skills?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (!res.ok) {
      setMessage('Failed to delete skill.');
      return;
    }
    await loadAll();
    setMessage('Skill deleted.');
  }

  async function submitAchievement(event: FormEvent) {
    event.preventDefault();
    const payload = {
      ...achievementForm,
      order: achievements.length,
      ...(editingAchievementId ? { id: editingAchievementId } : {}),
    };

    const res = await fetch('/api/achievements', {
      method: editingAchievementId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      setMessage('Failed to save certificate/achievement.');
      return;
    }

    setAchievementForm(initialAchievement);
    setEditingAchievementId('');
    await loadAll();
    setMessage('Certificate saved.');
  }

  async function deleteAchievement(id: string) {
    if (!window.confirm('Delete this certificate/achievement?')) return;
    const res = await fetch(`/api/achievements?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (!res.ok) {
      setMessage('Failed to delete certificate/achievement.');
      return;
    }
    await loadAll();
    setMessage('Certificate deleted.');
  }

  async function submitProject(event: FormEvent) {
    event.preventDefault();
    const payload = {
      ...projectForm,
      techStack: projectForm.techStack
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      order: projects.length,
      status: 'completed',
      ...(editingProjectId ? { id: editingProjectId } : {}),
    };

    const res = await fetch('/api/projects', {
      method: editingProjectId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      setMessage('Failed to save project.');
      return;
    }

    setProjectForm(initialProject);
    setEditingProjectId('');
    await loadAll();
    setMessage('Project saved.');
  }

  async function deleteProject(id: string) {
    if (!window.confirm('Delete this project?')) return;
    const res = await fetch(`/api/projects?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (!res.ok) {
      setMessage('Failed to delete project.');
      return;
    }
    await loadAll();
    setMessage('Project deleted.');
  }

  async function handleUpload(event: FormEvent) {
    event.preventDefault();

    if (!uploadFile) {
      setMessage('Choose a file first.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('alt', uploadAlt);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await parseJson<{ error?: string }>(res);
        setMessage(data.error || 'Upload failed.');
        return;
      }

      const data = await parseJson<{ url?: string }>(res);
      setLastUploadedUrl(data.url || '');
      setUploadAlt('');
      setUploadFile(null);
      setMessage('Upload successful. You can paste the URL into image fields.');
    } finally {
      setUploading(false);
    }
  }

  if (isCheckingAuth) {
    return <main className="min-h-screen bg-slate-950 text-white p-8">Checking admin session...</main>;
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-slate-950 text-white grid place-items-center p-6">
        <form onSubmit={handleLogin} className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6 space-y-4">
          <h1 className="text-2xl font-bold">Portfolio Admin Login</h1>
          <p className="text-sm text-slate-300">Use your admin credentials to access content manager.</p>

          <label className="block text-sm">
            Username
            <input
              className="mt-1 w-full rounded bg-slate-800 border border-slate-700 px-3 py-2"
              value={loginForm.username}
              onChange={(e) => setLoginForm((prev) => ({ ...prev, username: e.target.value }))}
            />
          </label>

          <label className="block text-sm">
            Password
            <input
              type="password"
              className="mt-1 w-full rounded bg-slate-800 border border-slate-700 px-3 py-2"
              value={loginForm.password}
              onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
            />
          </label>

          {authError ? <p className="text-sm text-red-400">{authError}</p> : null}

          <button type="submit" className="w-full rounded bg-blue-600 hover:bg-blue-500 px-4 py-2">
            Login
          </button>

          <p className="text-xs text-slate-400">{loginHint}</p>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Portfolio Admin Dashboard</h1>
            <p className="text-slate-300">Manage skills, certificates, projects, and media uploads in one place.</p>
          </div>
          <button onClick={handleLogout} className="rounded border border-slate-600 px-4 py-2 hover:bg-slate-800">
            Logout
          </button>
        </header>

        {message ? (
          <div className="rounded border border-slate-700 bg-slate-900 px-4 py-3 text-sm">{message}</div>
        ) : null}

        <nav className="flex flex-wrap gap-2">
          {(['skills', 'certificates', 'projects', 'uploads'] as Tab[]).map((tabName) => (
            <button
              key={tabName}
              onClick={() => setTab(tabName)}
              className={`rounded px-3 py-2 text-sm capitalize ${
                tab === tabName ? 'bg-blue-600' : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              {tabName}
            </button>
          ))}
        </nav>

        {tab === 'skills' ? (
          <section className="grid gap-6 lg:grid-cols-2">
            <form onSubmit={submitSkill} className="rounded-xl border border-slate-700 bg-slate-900 p-5 space-y-3">
              <h2 className="text-xl font-semibold">{editingSkillId ? 'Edit Skill' : 'Add Skill'}</h2>
              <input className="w-full rounded bg-slate-800 border border-slate-700 px-3 py-2" placeholder="Name" value={skillForm.name} onChange={(e) => setSkillForm((p) => ({ ...p, name: e.target.value }))} />
              <input className="w-full rounded bg-slate-800 border border-slate-700 px-3 py-2" placeholder="Category (Frontend, AI, etc.)" value={skillForm.category} onChange={(e) => setSkillForm((p) => ({ ...p, category: e.target.value }))} />
              <input type="number" min={0} max={100} className="w-full rounded bg-slate-800 border border-slate-700 px-3 py-2" placeholder="Proficiency 0-100" value={skillForm.proficiency} onChange={(e) => setSkillForm((p) => ({ ...p, proficiency: Number(e.target.value) }))} />
              <input className="w-full rounded bg-slate-800 border border-slate-700 px-3 py-2" placeholder="Icon URL" value={skillForm.iconUrl} onChange={(e) => setSkillForm((p) => ({ ...p, iconUrl: e.target.value }))} />
              <input className="w-full rounded bg-slate-800 border border-slate-700 px-3 py-2" placeholder="Color (optional)" value={skillForm.color} onChange={(e) => setSkillForm((p) => ({ ...p, color: e.target.value }))} />
              <div className="flex gap-2">
                <button type="submit" className="rounded bg-blue-600 px-4 py-2 hover:bg-blue-500">Save Skill</button>
                <button type="button" onClick={() => { setSkillForm(initialSkill); setEditingSkillId(''); }} className="rounded border border-slate-600 px-4 py-2 hover:bg-slate-800">Clear</button>
              </div>
            </form>

            <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
              <h2 className="text-xl font-semibold mb-3">Existing Skills</h2>
              <div className="space-y-2 max-h-[560px] overflow-auto pr-1">
                {skills.map((item) => (
                  <div key={item.id} className="rounded border border-slate-700 p-3">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-slate-300">{item.category} • {item.proficiency}%</p>
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => { setEditingSkillId(item.id); setSkillForm({ name: item.name, category: item.category, proficiency: item.proficiency, iconUrl: item.iconUrl || '', color: item.color || '' }); }} className="rounded bg-slate-700 px-3 py-1 text-sm">Edit</button>
                      <button onClick={() => deleteSkill(item.id)} className="rounded bg-red-700 px-3 py-1 text-sm">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {tab === 'certificates' ? (
          <section className="grid gap-6 lg:grid-cols-2">
            <form onSubmit={submitAchievement} className="rounded-xl border border-slate-700 bg-slate-900 p-5 space-y-3">
              <h2 className="text-xl font-semibold">{editingAchievementId ? 'Edit Certificate' : 'Add Certificate'}</h2>
              <input className="w-full rounded bg-slate-800 border border-slate-700 px-3 py-2" placeholder="Title" value={achievementForm.title} onChange={(e) => setAchievementForm((p) => ({ ...p, title: e.target.value }))} />
              <textarea className="w-full rounded bg-slate-800 border border-slate-700 px-3 py-2 min-h-28" placeholder="Description" value={achievementForm.description} onChange={(e) => setAchievementForm((p) => ({ ...p, description: e.target.value }))} />
              <input className="w-full rounded bg-slate-800 border border-slate-700 px-3 py-2" placeholder="Date (e.g. 2026 or Mar 2026)" value={achievementForm.date} onChange={(e) => setAchievementForm((p) => ({ ...p, date: e.target.value }))} />
              <input className="w-full rounded bg-slate-800 border border-slate-700 px-3 py-2" placeholder="Issuer" value={achievementForm.issuer} onChange={(e) => setAchievementForm((p) => ({ ...p, issuer: e.target.value }))} />
              <input className="w-full rounded bg-slate-800 border border-slate-700 px-3 py-2" placeholder="Image URL" value={achievementForm.imageUrl} onChange={(e) => setAchievementForm((p) => ({ ...p, imageUrl: e.target.value }))} />
              <input className="w-full rounded bg-slate-800 border border-slate-700 px-3 py-2" placeholder="Certificate Link URL" value={achievementForm.link} onChange={(e) => setAchievementForm((p) => ({ ...p, link: e.target.value }))} />
              <div className="flex gap-2">
                <button type="submit" className="rounded bg-blue-600 px-4 py-2 hover:bg-blue-500">Save Certificate</button>
                <button type="button" onClick={() => { setAchievementForm(initialAchievement); setEditingAchievementId(''); }} className="rounded border border-slate-600 px-4 py-2 hover:bg-slate-800">Clear</button>
              </div>
            </form>

            <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
              <h2 className="text-xl font-semibold mb-3">Existing Certificates</h2>
              <div className="space-y-2 max-h-[560px] overflow-auto pr-1">
                {achievements.map((item) => (
                  <div key={item.id} className="rounded border border-slate-700 p-3">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-slate-300">{item.date}{item.issuer ? ` • ${item.issuer}` : ''}</p>
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => { setEditingAchievementId(item.id); setAchievementForm({ title: item.title, description: item.description, date: item.date, issuer: item.issuer || '', imageUrl: item.imageUrl || '', link: item.link || '' }); }} className="rounded bg-slate-700 px-3 py-1 text-sm">Edit</button>
                      <button onClick={() => deleteAchievement(item.id)} className="rounded bg-red-700 px-3 py-1 text-sm">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {tab === 'projects' ? (
          <section className="grid gap-6 lg:grid-cols-2">
            <form onSubmit={submitProject} className="rounded-xl border border-slate-700 bg-slate-900 p-5 space-y-3">
              <h2 className="text-xl font-semibold">{editingProjectId ? 'Edit Project' : 'Add Project'}</h2>
              <input className="w-full rounded bg-slate-800 border border-slate-700 px-3 py-2" placeholder="Project Title" value={projectForm.title} onChange={(e) => setProjectForm((p) => ({ ...p, title: e.target.value }))} />
              <textarea className="w-full rounded bg-slate-800 border border-slate-700 px-3 py-2 min-h-28" placeholder="Project Description" value={projectForm.description} onChange={(e) => setProjectForm((p) => ({ ...p, description: e.target.value }))} />
              <input className="w-full rounded bg-slate-800 border border-slate-700 px-3 py-2" placeholder="Image URL" value={projectForm.imageUrl} onChange={(e) => setProjectForm((p) => ({ ...p, imageUrl: e.target.value }))} />
              <input className="w-full rounded bg-slate-800 border border-slate-700 px-3 py-2" placeholder="Demo URL" value={projectForm.demoUrl} onChange={(e) => setProjectForm((p) => ({ ...p, demoUrl: e.target.value }))} />
              <input className="w-full rounded bg-slate-800 border border-slate-700 px-3 py-2" placeholder="GitHub URL" value={projectForm.githubUrl} onChange={(e) => setProjectForm((p) => ({ ...p, githubUrl: e.target.value }))} />
              <input className="w-full rounded bg-slate-800 border border-slate-700 px-3 py-2" placeholder="Tech Stack (comma separated)" value={projectForm.techStack} onChange={(e) => setProjectForm((p) => ({ ...p, techStack: e.target.value }))} />
              <div className="flex gap-2">
                <button type="submit" className="rounded bg-blue-600 px-4 py-2 hover:bg-blue-500">Save Project</button>
                <button type="button" onClick={() => { setProjectForm(initialProject); setEditingProjectId(''); }} className="rounded border border-slate-600 px-4 py-2 hover:bg-slate-800">Clear</button>
              </div>
            </form>

            <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
              <h2 className="text-xl font-semibold mb-3">Existing Projects</h2>
              <div className="space-y-2 max-h-[560px] overflow-auto pr-1">
                {projects.map((item) => (
                  <div key={item.id} className="rounded border border-slate-700 p-3">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-slate-300 line-clamp-2">{item.description}</p>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => {
                          setEditingProjectId(item.id);
                          const parsedTech = (() => {
                            try {
                              return JSON.parse(item.techStack);
                            } catch {
                              return [];
                            }
                          })();

                          setProjectForm({
                            title: item.title,
                            description: item.description,
                            imageUrl: item.imageUrl || '',
                            demoUrl: item.demoUrl || '',
                            githubUrl: item.githubUrl || '',
                            techStack: Array.isArray(parsedTech) ? parsedTech.join(', ') : '',
                          });
                        }}
                        className="rounded bg-slate-700 px-3 py-1 text-sm"
                      >
                        Edit
                      </button>
                      <button onClick={() => deleteProject(item.id)} className="rounded bg-red-700 px-3 py-1 text-sm">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {tab === 'uploads' ? (
          <section className="rounded-xl border border-slate-700 bg-slate-900 p-5 space-y-4">
            <h2 className="text-xl font-semibold">Upload Images or Certificates</h2>
            <p className="text-slate-300 text-sm">Upload file and reuse the generated URL in skills/certificates/projects forms.</p>
            <form onSubmit={handleUpload} className="space-y-3 max-w-xl">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="w-full rounded bg-slate-800 border border-slate-700 px-3 py-2"
              />
              <input
                className="w-full rounded bg-slate-800 border border-slate-700 px-3 py-2"
                placeholder="Alt text"
                value={uploadAlt}
                onChange={(e) => setUploadAlt(e.target.value)}
              />
              <button type="submit" disabled={uploading} className="rounded bg-blue-600 px-4 py-2 hover:bg-blue-500 disabled:opacity-60">
                {uploading ? 'Uploading...' : 'Upload File'}
              </button>
            </form>
            {lastUploadedUrl ? (
              <div className="rounded border border-slate-700 bg-slate-950 p-3 text-sm break-all">
                Last Uploaded URL: {lastUploadedUrl}
              </div>
            ) : null}
          </section>
        ) : null}
      </div>
    </main>
  );
}
