"use client";

import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteMeetingButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    if (!confirm("Are you sure you want to completely delete this meeting and all its extracted decisions and tasks?")) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/transcript/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete meeting.");
        setIsDeleting(false);
      }
    } catch {
      alert("Network error.");
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 transition-colors rounded-lg flex items-center justify-center hover:opacity-100 opacity-70"
      style={{ 
        background: 'rgba(239, 68, 68, 0.15)', 
        border: '1px solid rgba(239, 68, 68, 0.3)',
        cursor: 'pointer'
      }}
      title="Delete Meeting"
    >
      {isDeleting ? <Loader2 size={18} className="animate-spin text-red-500" /> : <Trash2 size={18} color="var(--error-color)" />}
    </button>
  );
}
