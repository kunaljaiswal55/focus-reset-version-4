"use client";
import { useState, useEffect } from "react";

export default function ActiveReflections() {
  const [notes, setNotes] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newText, setNewText] = useState("");
  const [newTag, setNewTag] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("yt_reflections");
    if (saved) setNotes(JSON.parse(saved));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem("yt_reflections", JSON.stringify(notes));
  }, [notes, isLoaded]);

  const addNote = () => {
    if (!newText.trim()) return;
    const note = {
      id: Date.now(),
      text: newText.trim(),
      tag: newTag.trim() || "General",
      createdAt: new Date().toISOString(),
    };
    setNotes(prev => [note, ...prev]);
    setNewText("");
    setNewTag("");
    setIsAdding(false);
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const startEdit = (note) => {
    setEditingId(note.id);
    setEditText(note.text);
  };

  const saveEdit = () => {
    if (!editText.trim()) return;
    setNotes(prev => prev.map(n => n.id === editingId ? { ...n, text: editText.trim() } : n));
    setEditingId(null);
    setEditText("");
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="bg-surface-container-high p-6 rounded-[2rem] border border-outline-variant/5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-headline font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-tertiary">edit_note</span>
          Active Reflections
        </h3>
        <button onClick={() => setIsAdding(true)}
          className="text-xs font-label uppercase tracking-widest text-primary font-bold hover:tracking-[0.2em] transition-all">
          New Entry
        </button>
      </div>

      {/* Add new note */}
      {isAdding && (
        <div className="mb-4 bg-surface-container-low rounded-2xl p-4 border border-primary/10">
          <textarea
            value={newText}
            onChange={e => setNewText(e.target.value)}
            autoFocus
            rows={3}
            className="w-full bg-transparent text-sm font-body text-on-surface resize-none focus:outline-none placeholder:text-on-surface-variant/50"
            placeholder="Write your reflection, insight, or key takeaway..."
          />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-outline-variant/10">
            <input
              type="text"
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              className="bg-transparent text-[10px] font-label text-on-surface-variant uppercase tracking-widest focus:outline-none w-28"
              placeholder="Tag (optional)"
              onKeyDown={e => { if (e.key === "Enter") addNote(); }}
            />
            <div className="flex items-center gap-2">
              <button onClick={() => { setIsAdding(false); setNewText(""); setNewTag(""); }}
                className="text-xs font-label font-bold text-on-surface-variant hover:text-on-surface transition-colors px-3 py-1.5 rounded-full">
                Cancel
              </button>
              <button onClick={addNote} disabled={!newText.trim()}
                className="text-xs font-label font-bold text-primary bg-primary/10 hover:bg-primary/20 px-4 py-1.5 rounded-full transition-colors disabled:opacity-30">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes list */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-none">
        {notes.map(note => (
          <div key={note.id} className="bg-surface-container-low p-4 rounded-2xl border-b-2 border-outline-variant/10 group">
            {editingId === note.id ? (
              <>
                <textarea
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  autoFocus
                  rows={3}
                  className="w-full bg-transparent text-sm font-body text-on-surface resize-none focus:outline-none italic"
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button onClick={() => setEditingId(null)} className="text-xs text-on-surface-variant px-3 py-1 rounded-full hover:bg-surface-container transition-colors">Cancel</button>
                  <button onClick={saveEdit} className="text-xs text-primary font-bold px-3 py-1 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">Save</button>
                </div>
              </>
            ) : (
              <>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed italic">
                  "{note.text}"
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-label text-outline uppercase tracking-widest">{note.tag}</span>
                    <span className="text-[10px] text-outline">•</span>
                    <span className="text-[10px] text-outline">{formatDate(note.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(note)}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[14px]">edit</span>
                    </button>
                    <button onClick={() => deleteNote(note.id)}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-on-surface-variant hover:text-error transition-colors">
                      <span className="material-symbols-outlined text-[14px]">delete</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}

        {notes.length === 0 && !isAdding && (
          <div className="text-center py-6 text-on-surface-variant">
            <span className="material-symbols-outlined text-2xl text-tertiary/20 mb-1 block">lightbulb</span>
            <p className="text-xs font-label">Capture key insights from your lectures here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
