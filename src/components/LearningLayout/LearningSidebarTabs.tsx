import { useState, type ReactNode } from 'react';

import './LearningSidebarTabs.css';

type TabId = 'progress' | 'notes';

interface LearningSidebarTabsProps {
  progressContent: ReactNode;
  notesContent: ReactNode;
}

export default function LearningSidebarTabs({
  progressContent,
  notesContent,
}: LearningSidebarTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('progress');

  const renderPanel = (tabId: TabId, content: ReactNode) => {
    const isActive = activeTab === tabId;
    return (
      <div
        role="tabpanel"
        id={`learning-tabpanel-${tabId}`}
        aria-labelledby={`learning-tab-${tabId}`}
        hidden={!isActive}
        className="learning-sidebar-tabpanel"
      >
        {isActive ? content : null}
      </div>
    );
  };

  return (
    <section className="learning-sidebar-tabs" aria-label="Learning resources">
      <div role="tablist" aria-label="Learning sidebar tabs" className="learning-sidebar-tablist">
        <button
          type="button"
          id="learning-tab-progress"
          role="tab"
          aria-selected={activeTab === 'progress'}
          aria-controls="learning-tabpanel-progress"
          className={`learning-sidebar-tab ${activeTab === 'progress' ? 'learning-sidebar-tab--active' : ''}`}
          onClick={() => setActiveTab('progress')}
        >
          Progress
        </button>
        <button
          type="button"
          id="learning-tab-notes"
          role="tab"
          aria-selected={activeTab === 'notes'}
          aria-controls="learning-tabpanel-notes"
          className={`learning-sidebar-tab ${activeTab === 'notes' ? 'learning-sidebar-tab--active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          Notes
        </button>
      </div>

      {renderPanel('progress', progressContent)}
      {renderPanel('notes', notesContent)}
    </section>
  );
}
