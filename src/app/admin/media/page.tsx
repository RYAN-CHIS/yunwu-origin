"use client";

import { useEffect, useState, useCallback } from "react";
import { getMedia, saveMedia, deleteMedia } from "@/lib/actions/admin-actions";

type MediaItem = {
  id: string; filename: string; url: string; category: string;
  altText: string | null; size: number; mimeType: string; createdAt: Date;
};

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [filterCat, setFilterCat] = useState("");

  async function load() { const data = await getMedia(); setItems(data); }
  useEffect(() => { load(); }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadMsg("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", filterCat || "BRAND");

      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const json = await res.json();

      if (res.ok) {
        await saveMedia({
          filename: file.name, url: json.url, category: (filterCat || "BRAND") as any,
          altText: file.name, size: file.size, mimeType: file.type,
        });
        await load();
        setUploadMsg("上传成功");
      } else {
        setUploadMsg(json.error || "上传失败");
      }
    } catch {
      setUploadMsg("上传失败");
    }
    setUploading(false);
    e.target.value = "";
  }

  async function handleCopy(url: string) {
    await navigator.clipboard.writeText(url);
    setUploadMsg("链接已复制");
    setTimeout(() => setUploadMsg(""), 1500);
  }

  async function handleDelete(id: string) {
    if (!confirm("确定删除？")) return;
    await deleteMedia(id);
    await load();
  }

  const textStyle = { color: "var(--yun-text)" };
  const subStyle = { color: "var(--yun-subtext)" };
  const lineStyle = { borderColor: "var(--yun-line)" };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium tracking-[0.1em]" style={textStyle}>图片资产库</h1>
          <p className="text-xs mt-1" style={subStyle}>Vercel Blob 存储</p>
        </div>
      </div>

      {/* Upload */}
      <div className="bg-white border rounded p-6 mb-6 text-center" style={lineStyle}>
        <div className="flex items-center justify-center gap-3 mb-3">
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
            className="px-3 py-1.5 border text-sm bg-white" style={lineStyle}>
            <option value="">全部类别</option>
            <option value="PRODUCT">作品图</option>
            <option value="MATERIAL">材料图</option>
            <option value="BRAND">品牌图</option>
            <option value="CRAFT">工艺图</option>
            <option value="ARTICLE">文章图</option>
          </select>
          <label className="px-4 py-1.5 text-sm text-white rounded cursor-pointer tracking-wider" style={{ background: "var(--yun-accent)" }}>
            {uploading ? "上传中..." : "选择图片上传"}
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
          </label>
        </div>
        {uploadMsg && <p className="text-xs" style={{ color: uploadMsg.includes("失败") ? "#E24B4A" : "#639922" }}>{uploadMsg}</p>}
        <p className="text-xs mt-2" style={subStyle}>支持 JPG / PNG / WebP，单文件最大 4.5MB</p>
      </div>

      {/* Gallery */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {items.filter((m) => !filterCat || m.category === filterCat).map((m) => (
          <div key={m.id} className="bg-white border rounded overflow-hidden" style={lineStyle}>
            <div className="aspect-square bg-gray-50 relative group">
              <img src={m.url} alt={m.altText || m.filename} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => handleCopy(m.url)}
                  className="px-2 py-1 text-xs text-white bg-white/20 rounded">复制链接</button>
                <button onClick={() => window.open(m.url, "_blank")}
                  className="px-2 py-1 text-xs text-white bg-white/20 rounded">查看</button>
              </div>
            </div>
            <div className="p-2">
              <p className="text-xs truncate" style={textStyle}>{m.filename}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px]" style={subStyle}>{m.category}</span>
                <button onClick={() => handleDelete(m.id)} className="text-[10px]" style={{ color: "#E24B4A" }}>删除</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && (
        <p className="text-sm text-center py-8" style={subStyle}>暂无图片，请上传</p>
      )}
    </div>
  );
}
