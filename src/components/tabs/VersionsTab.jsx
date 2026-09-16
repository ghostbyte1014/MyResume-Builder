import React, { useState, useEffect } from "react";
import { Save, FolderOpen, Trash2, Download, Upload } from "lucide-react";
import { storage } from "../../utils/storage";
import { exportResumeJSON, parseResumeJSON } from "../../utils/jsonExporter";
import { TabInfoBanner } from "../common/TabInfoBanner";

export function VersionsTab({
  resume, setResume,
  layoutId, setLayoutId,
  colorId, setColorId,
  fontId, setFontId,
  categoryId, setCategoryId,
  documentStyle, setDocumentStyle,
  pageSize, setPageSize,
  setTab
}) {
  const [savedVersions, setSavedVersions] = useState([]);
  const [versionsLoading, setVersionsLoading] = useState(true);
  const [versionsError, setVersionsError] = useState("");
  const [newVersionName, setNewVersionName] = useState("");
  const [savingVersion, setSavingVersion] = useState(false);
  const [versionBusyId, setVersionBusyId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [jsonImportError, setJsonImportError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const item = await storage.get("resume-versions-index", false);
        const parsed = item ? JSON.parse(item.value) : [];
        if (!cancelled) setSavedVersions(Array.isArray(parsed) ? parsed : []);
      } catch (err) {
        if (!cancelled) setSavedVersions([]);
      } finally {
        if (!cancelled) setVersionsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  async function handleSaveVersion() {
    const trimmed = newVersionName.trim();
    if (!trimmed) return;
    setVersionsError("");
    setSavingVersion(true);
    const id = `v${Date.now()}`;
    const versionMeta = { id, name: trimmed, savedAt: new Date().toISOString() };
    const versionData = {
      ...versionMeta,
      resume,
      layoutId,
      colorId,
      fontId,
      categoryId,
      documentStyle,
      pageSize
    };

    try {
      const ok = await storage.set(`resume-version:${id}`, JSON.stringify(versionData), false);
      if (!ok) throw new Error("save failed");

      const updated = [...savedVersions, versionMeta];
      const indexOk = await storage.set("resume-versions-index", JSON.stringify(updated), false);
      if (!indexOk) throw new Error("index save failed");

      setSavedVersions(updated);
      setNewVersionName("");
    } catch (err) {
      setVersionsError("Couldn't save this version — check your storage connection and try again.");
    } finally {
      setSavingVersion(false);
    }
  }

  async function handleLoadVersion(id) {
    setVersionBusyId(id);
    setVersionsError("");
    try {
      const item = await storage.get(`resume-version:${id}`, false);
      if (!item) throw new Error("not found");

      const data = JSON.parse(item.value);
      setResume(data.resume);
      if (data.layoutId) setLayoutId(data.layoutId);
      if (data.colorId) setColorId(data.colorId);
      if (data.fontId) setFontId(data.fontId);
      if (data.categoryId) setCategoryId(data.categoryId);
      if (data.documentStyle) setDocumentStyle(data.documentStyle);
      if (data.pageSize) setPageSize(data.pageSize);

      setTab("build");
    } catch (err) {
      setVersionsError("Couldn't load that version — it may have been deleted.");
    } finally {
      setVersionBusyId(null);
    }
  }

  async function handleDeleteVersion(id) {
    setVersionBusyId(id);
    setVersionsError("");
    try {
      await storage.delete(`resume-version:${id}`, false);
      const updated = savedVersions.filter(v => v.id !== id);
      await storage.set("resume-versions-index", JSON.stringify(updated), false);
      setSavedVersions(updated);
      setConfirmDeleteId(null);
    } catch (err) {
      setVersionsError("Couldn't delete that version — try again.");
    } finally {
      setVersionBusyId(null);
    }
  }

  function handleExportJSON() {
    const fullData = {
      resume,
      layoutId,
      colorId,
      fontId,
      categoryId,
      documentStyle,
      pageSize,
      exportedAt: new Date().toISOString()
    };
    const filename = `${(resume.name || "resume").trim().replace(/\s+/g, "_").toLowerCase()}_backup.json`;
    exportResumeJSON(fullData, filename);
  }

  function handleJSONFileUpload(file) {
    if (!file) return;
    setJsonImportError("");
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = parseResumeJSON(reader.result);
        setResume(parsed.resume);
        if (parsed.layoutId) setLayoutId(parsed.layoutId);
        if (parsed.colorId) setColorId(parsed.colorId);
        if (parsed.fontId) setFontId(parsed.fontId);
        if (parsed.categoryId) setCategoryId(parsed.categoryId);
        if (parsed.documentStyle) setDocumentStyle(parsed.documentStyle);
        if (parsed.pageSize) setPageSize(parsed.pageSize);
        setTab("build");
      } catch (err) {
        setJsonImportError(err.message);
      }
    };
    reader.onerror = () => setJsonImportError("Error reading JSON file.");
    reader.readAsText(file);
  }

  return (
    <div>
      <TabInfoBanner
        title="Versions & Backup Purpose"
        description="Save named snapshots of your resume state to browser storage, or export/import complete .json backup files for easy portability and safety."
      />
      <h3 style={{ marginTop: 0, fontSize: 15 }}>Saved versions & JSON Backup</h3>
      <p style={{ fontSize: 12, color: "#6b7280", marginTop: 0, marginBottom: 16 }}>
        Save named snapshots of your resume state (including layout, colors, and bullet toggles) to your browser storage, or export/import complete backup files as `.json`.
      </p>

      {/* JSON BACKUP & RESTORE BANNER */}
      <div style={{ background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 8, padding: 12, marginBottom: 18, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#1f2937" }}>JSON Backup & Restore</div>
          <div style={{ fontSize: 11.5, color: "#6b7280" }}>Export master resume data as JSON or restore a previously saved backup file.</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" onClick={handleExportJSON}
            style={{ display: "flex", alignItems: "center", gap: 5, background: "#fff", color: "#1e3a5f", border: "1px solid #1e3a5f", borderRadius: 6, padding: "7px 12px", fontSize: 12.5, cursor: "pointer", fontWeight: 500 }}>
            <Download size={14} aria-hidden="true" /> Backup to .json
          </button>
          <label style={{ display: "flex", alignItems: "center", gap: 5, background: "#1e3a5f", color: "#fff", border: "none", borderRadius: 6, padding: "7px 12px", fontSize: 12.5, cursor: "pointer", fontWeight: 500 }}>
            <Upload size={14} aria-hidden="true" /> Restore from .json
            <input type="file" accept=".json" onChange={ev => handleJSONFileUpload(ev.target.files && ev.target.files[0])}
              style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }} />
          </label>
        </div>
        {jsonImportError && <div style={{ width: "100%", fontSize: 12, color: "#b0392f", marginTop: 4 }}>{jsonImportError}</div>}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input value={newVersionName} onChange={e => setNewVersionName(e.target.value)} placeholder="Version name, e.g. 'Google application'"
          style={{ flex: 1, padding: "8px 10px", border: "1px solid #d7dbe0", borderRadius: 6, fontSize: 13.5, fontFamily: "inherit" }} />
        <button type="button" onClick={handleSaveVersion} disabled={!newVersionName.trim() || savingVersion}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "#1e3a5f", color: "#fff", border: "none", borderRadius: 7, padding: "8px 14px", fontSize: 13.5, cursor: newVersionName.trim() ? "pointer" : "default", opacity: newVersionName.trim() ? 1 : 0.5 }}>
          <Save size={14} aria-hidden="true" /> {savingVersion ? "Saving…" : "Save current"}
        </button>
      </div>

      {versionsError && <div style={{ fontSize: 12, color: "#b0392f", marginBottom: 10 }}>{versionsError}</div>}

      {versionsLoading ? (
        <div style={{ fontSize: 13, color: "#6b7280", marginTop: 16 }}>Loading your saved versions…</div>
      ) : savedVersions.length === 0 ? (
        <div style={{ fontSize: 13, color: "#6b7280", marginTop: 16 }}>No saved versions yet — save your first one above.</div>
      ) : (
        <div style={{ marginTop: 12 }}>
          {savedVersions.slice().sort((a, b) => b.savedAt.localeCompare(a.savedAt)).map(v => (
            <div key={v.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, border: "1px solid #eee", borderRadius: 8, padding: "10px 12px", marginBottom: 8 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500, overflowWrap: "anywhere" }}>{v.name}</div>
                <div style={{ fontSize: 11.5, color: "#6b7280" }}>Saved {new Date(v.savedAt).toLocaleDateString()}</div>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                {confirmDeleteId === v.id ? (
                  <>
                    <button type="button" onClick={() => handleDeleteVersion(v.id)} disabled={versionBusyId === v.id}
                      style={{ fontSize: 12, color: "#fff", background: "#b0392f", border: "none", borderRadius: 6, padding: "6px 10px", cursor: "pointer" }}>
                      {versionBusyId === v.id ? "Deleting…" : "Confirm delete"}
                    </button>
                    <button type="button" onClick={() => setConfirmDeleteId(null)} style={{ fontSize: 12, background: "none", border: "1px solid #e5e7eb", borderRadius: 6, padding: "6px 10px", cursor: "pointer" }}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button type="button" onClick={() => handleLoadVersion(v.id)} disabled={versionBusyId === v.id}
                      style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12.5, background: "#eef1f4", border: "none", borderRadius: 6, padding: "6px 10px", cursor: "pointer" }}>
                      <FolderOpen size={13} aria-hidden="true" /> {versionBusyId === v.id ? "Loading…" : "Load"}
                    </button>
                    <button type="button" onClick={() => setConfirmDeleteId(v.id)} aria-label={`Delete version ${v.name}`}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#b0392f", padding: 6 }}><Trash2 size={14} /></button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
