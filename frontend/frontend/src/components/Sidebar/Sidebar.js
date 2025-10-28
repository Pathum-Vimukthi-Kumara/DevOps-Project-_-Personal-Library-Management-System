import React from 'react';

const items = [
  { label: 'Library', icon: '📚' },
  { label: 'Add Items', icon: '➕' },
  { label: 'Add Collection', icon: '🗂️' },
  { label: 'Publish', icon: '📤' },
  { label: 'Lending', icon: '🔄' },
  { label: 'Managers', icon: '👥' },
  { label: 'Barcodes', icon: '🏷️' },
  { label: 'Dashboards', icon: '📊' }
];

export default function Sidebar({ onAddItem }) {
  return (
    <aside className="hidden md:flex md:flex-col w-60 shrink-0 border-r bg-white">
      <div className="px-4 py-5 border-b">
        <div className="text-2xl font-semibold tracking-wide flex items-center gap-2">
          <span className="inline-block">libib</span>
          <span className="text-gray-400">📚</span>
        </div>
      </div>
      <nav className="p-2 space-y-1">
        {items.map((it) => (
          <button
            key={it.label}
            type="button"
            onClick={it.label === 'Add Items' ? onAddItem : undefined}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
          >
            <span className="text-lg">{it.icon}</span>
            <span>{it.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
