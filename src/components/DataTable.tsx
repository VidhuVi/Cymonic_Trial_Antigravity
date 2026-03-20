"use client";

import { useState } from "react";
import { Download, ListChecks, CheckCircle, Circle, Calendar, User } from "lucide-react";

export default function DataTable({ transcripts }: { transcripts: any[] }) {
  const [activeTab, setActiveTab] = useState<"actions" | "decisions">("actions");

  const allActionItems = transcripts.flatMap(t => 
    t.actionItems.map((a: any) => ({ ...a, meetingTitle: t.title, meetingDate: t.createdAt }))
  );
  
  const allDecisions = transcripts.flatMap(t => 
    t.decisions.map((d: any) => ({ ...d, meetingTitle: t.title, meetingDate: t.createdAt }))
  );

  const exportCSV = () => {
    let csvContent = "";
    if (activeTab === "actions") {
      csvContent = "Meeting,Task,Assignee,Due Date,Status\n" + 
        allActionItems.map(a => `"${a.meetingTitle}","${a.task}","${a.assignee || ''}","${a.dueDate || ''}","${a.isCompleted ? 'Done' : 'Pending'}"`).join("\n");
    } else {
      csvContent = "Meeting,Decision,Date\n" + 
        allDecisions.map(d => `"${d.meetingTitle}","${d.content}","${new Date(d.meetingDate).toLocaleDateString()}"`).join("\n");
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `extracted_${activeTab}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-panel w-full overflow-hidden mt-6">
      {/* Header Tabs */}
      <div className="flex border-b" style={{borderColor: 'var(--surface-border)'}}>
        <button 
          className={`flex items-center justify-center gap-2 flex-1 p-4 transition-colors ${activeTab === "actions" ? "" : "text-secondary hover:bg-white hover:bg-opacity-5"}`}
          style={{
            background: activeTab === "actions" ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
            borderBottom: activeTab === "actions" ? '2px solid var(--primary-color)' : '2px solid transparent',
            fontWeight: activeTab === "actions" ? 600 : 400,
            borderTop: 'none', borderLeft: 'none', borderRight: 'none', cursor: 'pointer', outline: 'none'
          }}
          onClick={() => setActiveTab("actions")}
        >
          <ListChecks size={20} /> Action Items ({allActionItems.length})
        </button>
        <button 
          className={`flex items-center justify-center gap-2 flex-1 p-4 transition-colors ${activeTab === "decisions" ? "" : "text-secondary hover:bg-white hover:bg-opacity-5"}`}
          style={{
            background: activeTab === "decisions" ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
            borderBottom: activeTab === "decisions" ? '2px solid var(--primary-color)' : '2px solid transparent',
            fontWeight: activeTab === "decisions" ? 600 : 400,
            borderTop: 'none', borderLeft: 'none', borderRight: 'none', cursor: 'pointer', outline: 'none'
          }}
          onClick={() => setActiveTab("decisions")}
        >
          <CheckCircle size={20} /> Decisions ({allDecisions.length})
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center p-4" style={{borderBottom: '1px solid var(--surface-border)'}}>
        <div style={{fontWeight: 500}}>
          {activeTab === 'actions' ? 'Track task assignments and status' : 'Review key decisions across meetings'}
        </div>
        <button className="btn btn-secondary" onClick={exportCSV} style={{padding: '0.5rem 1rem', fontSize: '0.9rem'}}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Table Area */}
      <div style={{overflowX: 'auto'}}>
        <table className="w-full text-left" style={{minWidth: '100%', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid var(--surface-border)'}}>
              <th className="p-4 font-semibold text-secondary">Meeting</th>
              {activeTab === 'actions' ? (
                <>
                  <th className="p-4 font-semibold text-secondary">Task</th>
                  <th className="p-4 font-semibold text-secondary">Assignee</th>
                  <th className="p-4 font-semibold text-secondary">Due Date</th>
                  <th className="p-4 font-semibold text-secondary">Status</th>
                </>
              ) : (
                <>
                  <th className="p-4 font-semibold text-secondary">Decision</th>
                  <th className="p-4 font-semibold text-secondary">Date</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {activeTab === 'actions' ? (
               allActionItems.length === 0 ? (
                 <tr><td colSpan={5} className="p-8 text-center text-secondary">No action items found via transcript processing yet.</td></tr>
               ) : (
                 allActionItems.map((a, i) => (
                   <tr key={a.id || i} style={{borderBottom: '1px solid var(--surface-border)', borderTop: 'none', transition: 'background 0.2s'}}>
                     <td className="p-4" style={{color: 'var(--primary-color)', whiteSpace: 'nowrap'}}>{a.meetingTitle}</td>
                     <td className="p-4 font-medium" style={{minWidth: '200px'}}>{a.task}</td>
                     <td className="p-4">
                       <span className="flex items-center gap-2" style={{whiteSpace: 'nowrap'}}><User size={14} className="text-secondary"/> {a.assignee || 'Unassigned'}</span>
                     </td>
                     <td className="p-4">
                       <span className="flex items-center gap-2" style={{whiteSpace: 'nowrap'}}><Calendar size={14} className="text-secondary"/> {a.dueDate || 'None'}</span>
                     </td>
                     <td className="p-4">
                       {a.isCompleted ? 
                         <span className="flex items-center gap-2" style={{color: 'var(--success-color)'}}><CheckCircle size={16}/> Done</span> : 
                         <span className="flex items-center gap-2 text-secondary"><Circle size={16}/> Pending</span>
                       }
                     </td>
                   </tr>
                 ))
               )
            ) : (
              allDecisions.length === 0 ? (
                 <tr><td colSpan={3} className="p-8 text-center text-secondary">No decisions found via transcript processing yet.</td></tr>
               ) : (
                 allDecisions.map((d, i) => (
                   <tr key={d.id || i} style={{borderBottom: '1px solid var(--surface-border)', borderTop: 'none'}}>
                     <td className="p-4" style={{color: 'var(--primary-color)', whiteSpace: 'nowrap', width: '200px'}}>{d.meetingTitle}</td>
                     <td className="p-4" style={{minWidth: '300px'}}>{d.content}</td>
                     <td className="p-4 text-secondary" style={{whiteSpace: 'nowrap', width: '150px'}}>{new Date(d.meetingDate).toLocaleDateString()}</td>
                   </tr>
                 ))
               )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
