import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Dumbbell,
  UtensilsCrossed,
  BookOpen,
  Activity,
  Plus,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { adminApi } from '../api/adminApi';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { Skeleton } from '../components/common/Skeleton';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [knowledgeDocs, setKnowledgeDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Doc Modal
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState('NUTRITION');
  const [docContent, setDocContent] = useState('');
  const [docTags, setDocTags] = useState('');
  const [docSource, setDocSource] = useState('');

  const toast = useToast();

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, docsRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getUsers(0, 20),
        adminApi.getKnowledgeDocs({ size: 20 }),
      ]);

      if (statsRes?.data) setStats(statsRes.data);
      if (usersRes?.data?.content) setUsers(usersRes.data.content);
      if (docsRes?.data?.content) setKnowledgeDocs(docsRes.data.content);
    } catch {
      toast.error('Failed to load administrator data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleToggleRole = async (userId) => {
    try {
      await adminApi.toggleUserRole(userId);
      toast.success('User authorization role updated');
      loadAdminData();
    } catch (err) {
      toast.error(err.message || 'Cannot alter own administrator role');
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await adminApi.toggleUserStatus(userId);
      toast.success('User account access status updated');
      loadAdminData();
    } catch (err) {
      toast.error(err.message || 'Cannot disable own account');
    }
  };

  const handleCreateDoc = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createKnowledgeDoc({
        title: docTitle,
        category: docCategory,
        content: docContent,
        tags: docTags,
        keywords: docTags.replace(/,/g, ' '),
        source: docSource,
      });
      toast.success('New scientific reference added to RAG knowledge base!');
      setIsDocModalOpen(false);
      setDocTitle('');
      setDocContent('');
      setDocTags('');
      setDocSource('');
      loadAdminData();
    } catch (err) {
      toast.error(err.message || 'Failed to create document');
    }
  };

  const handleDeleteDoc = async (id) => {
    if (!window.confirm('Delete this knowledge document from RAG index?')) return;
    try {
      await adminApi.deleteKnowledgeDoc(id);
      toast.success('Document removed');
      loadAdminData();
    } catch {
      toast.error('Failed to delete document');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Metrics Banner */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem',
      }}>
        <Card padding="1.25rem">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Total Users</span>
            <Users size={18} color="var(--color-primary)" />
          </div>
          <p style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0.4rem 0 0' }}>{stats?.totalUsers ?? 0}</p>
        </Card>

        <Card padding="1.25rem">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Workouts Logged</span>
            <Dumbbell size={18} color="var(--color-primary-light)" />
          </div>
          <p style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0.4rem 0 0' }}>{stats?.totalWorkoutsLogged ?? 0}</p>
        </Card>

        <Card padding="1.25rem">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Meals Logged</span>
            <UtensilsCrossed size={18} color="var(--color-accent-teal)" />
          </div>
          <p style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0.4rem 0 0' }}>{stats?.totalMealsLogged ?? 0}</p>
        </Card>

        <Card padding="1.25rem">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>RAG Documents</span>
            <BookOpen size={18} color="var(--color-accent-coral)" />
          </div>
          <p style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0.4rem 0 0' }}>{stats?.totalKnowledgeDocs ?? 0}</p>
        </Card>
      </div>

      {/* User Governance Table */}
      <Card
        title="Registered Users Governance"
        subtitle="Manage authorization roles and account activation states"
        action={
          <Button variant="ghost" size="sm" onClick={loadAdminData} icon={RefreshCw}>
            Refresh
          </Button>
        }
      >
        {loading ? (
          <Skeleton height="160px" />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>ID</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Name</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Email</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Role</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #F0F4F1' }}>
                    <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>#{u.id}</td>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{u.fullName}</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>{u.email}</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <Badge variant={u.role === 'ROLE_ADMIN' ? 'coral' : 'sage'}>
                        {u.role}
                      </Badge>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <Badge variant={u.enabled ? 'teal' : 'coral'}>
                        {u.enabled ? 'Active' : 'Disabled'}
                      </Badge>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <Button variant="outline" size="sm" onClick={() => handleToggleRole(u.id)}>
                          Toggle Role
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(u.id)}>
                          {u.enabled ? 'Disable' : 'Enable'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* RAG Knowledge Base Manager */}
      <Card
        title="RAG Scientific Knowledge Base Documents"
        subtitle="Curated articles indexed by the vector cosine similarity retrieval engine"
        action={
          <Button variant="primary" size="sm" onClick={() => setIsDocModalOpen(true)} icon={Plus}>
            Add Document
          </Button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {knowledgeDocs.map((doc) => (
            <div
              key={doc.id}
              style={{
                padding: '1rem',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-surface-subtle)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>{doc.title}</h4>
                  <Badge variant="sage">{doc.category}</Badge>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 0.35rem', lineHeight: 1.5 }}>
                  {doc.content.length > 160 ? doc.content.substring(0, 155) + '...' : doc.content}
                </p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                  Source: <em>{doc.source}</em>
                </span>
              </div>
              <button
                onClick={() => handleDeleteDoc(doc.id)}
                style={{ background: 'transparent', border: 'none', color: 'var(--color-accent-coral)', cursor: 'pointer', padding: '0.2rem' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Modal: Add Document */}
      <Modal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        title="Add Scientific Knowledge Document"
        subtitle="Expands FitAI RAG vector search corpus"
      >
        <form onSubmit={handleCreateDoc} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <Input
            label="Document Title"
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
            required
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Category</label>
            <select
              value={docCategory}
              onChange={(e) => setDocCategory(e.target.value)}
              style={{ padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--border-light)' }}
            >
              <option value="EXERCISE_SCIENCE">Exercise Science</option>
              <option value="NUTRITION">Nutrition & Macronutrients</option>
              <option value="RECOVERY">Recovery & Sleep</option>
              <option value="SUPPLEMENTATION">Supplementation</option>
              <option value="INJURY_PREVENTION">Injury Prevention</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Scientific Summary / Content *</label>
            <textarea
              rows={4}
              value={docContent}
              onChange={(e) => setDocContent(e.target.value)}
              style={{ padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--border-light)', fontFamily: 'inherit' }}
              required
            />
          </div>

          <Input
            label="Keywords & Tags (comma separated)"
            placeholder="hypertrophy, progressive overload, volume"
            value={docTags}
            onChange={(e) => setDocTags(e.target.value)}
          />

          <Input
            label="Scientific Publication / Source"
            placeholder="e.g. Journal of Applied Physiology"
            value={docSource}
            onChange={(e) => setDocSource(e.target.value)}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button variant="outline" onClick={() => setIsDocModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Index Document
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
