"use client";
export const dynamic = 'force-dynamic'


import { useEffect, useState } from "react";
import { getObjectCategories, createObjectCategory, updateObjectCategory, deleteObjectCategory } from "@/lib/actions/admin-actions";

type Category = {
  id: string; name: string; slug: string; description: string | null;
  coverImage: string | null; sortOrder: number;
};

export default function AdminObjectsPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", description: "", coverImage: "", sortOrder: 0 });
  const [loading, setLoading] = useState(false);

  async function load() { const data = await getObjectCategories(); setItems(data); }
  useEffect(() => { load(); }, []);

  function resetForm() {
    setForm({ name: "", slug: "", description: "", coverImage: "", sortOrder: items.length + 1 });
    setEditingId(null); setShowForm(false);
  }

  function editItem(c: Category) {
    setForm({ name: c.name, slug: c.slug, description: c.description || "", coverImage: c.coverImage || "", sortOrder: c.sortOrder });
    setEditingId(c.id); setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    editingId ? await updateObjectCategory(editingId, form) : await createObjectCategory(form);
    resetForm(); await load(); setLoading(false);
  }

  async function handleDelete(id: string) { if (!confirm("确定删除？")) return; await deleteObjectCategory(id); await load(); }

  const textStyle = { color: "var(--yun-text)" };
  const subStyle = { color: "var(--yun-subtext)" };
  const lineStyle = { borderColor: "var(--yun-line)" };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium tracking-[0.1em]" style={textStyle}>器物体系</h1>
          <p className="text-xs mt-1" style={subStyle}>核心产品架构</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }}
          className="px-4 py-1.5 text-sm text-white rounded tracking-wider" style={{ background: "var(--yun-accent)" }}>
          新增分类
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border rounded p-4 mb-6 space-y-3" style={lineStyle}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs mb-1" style={subStyle}>名称</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                required className="w-full px-3 py-1.5 border text-sm bg-white" style={lineStyle} />
            </div>
            <div>
              <label className="block text-xs mb-1" style={subStyle}>Slug</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                required className="w-full px-3 py-1.5 border text-sm bg-white" style={lineStyle} />
            </div>
          </div>
          <div>
            <label className="block text-xs mb-1" style={subStyle}>描述</label>
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-1.5 border text-sm bg-white" style={lineStyle} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs mb-1" style={subStyle}>封面图 URL</label>
              <input value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                className="w-full px-3 py-1.5 border text-sm bg-white" style={lineStyle} />
            </div>
            <div>
              <label className="block text-xs mb-1" style={subStyle}>排序</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-1.5 border text-sm bg-white" style={lineStyle} />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={loading} className="px-4 py-1.5 text-sm text-white rounded" style={{ background: "var(--yun-accent)" }}>
              {editingId ? "保存" : "创建"}
            </button>
            <button type="button" onClick={resetForm} className="px-4 py-1.5 text-sm border rounded" style={lineStyle}>取消</button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {items.map((c) => (
          <div key={c.id} className="bg-white border rounded p-4 flex items-center justify-between" style={lineStyle}>
            <div className="flex-1">
              <span className="text-sm font-medium" style={textStyle}>{c.name}</span>
              {c.description && <p className="text-xs mt-1" style={subStyle}>{c.description}</p>}
              <p className="text-[11px] mt-0.5" style={subStyle}>/{c.slug} · 排序 {c.sortOrder}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => editItem(c)} className="px-3 py-1 text-xs border rounded" style={{ ...lineStyle, color: "var(--yun-text)" }}>编辑</button>
              <button onClick={() => handleDelete(c.id)} className="px-3 py-1 text-xs border rounded" style={{ borderColor: "#E24B4A", color: "#E24B4A" }}>删除</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
