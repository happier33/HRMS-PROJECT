import React from 'react';
import { useStore } from '@/app/store';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const iconMap = {
  success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
  error: <AlertCircle className="w-5 h-5 text-red-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
};

const bgMap = {
  success: 'border-emerald-200 bg-emerald-50',
  error: 'border-red-200 bg-red-50',
  info: 'border-blue-200 bg-blue-50',
  warning: 'border-amber-200 bg-amber-50',
};

const ToastContainer: React.FC = () => {
  const { state, dispatch } = useStore();
  const { toasts } = state.ui;

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2" style={{ zIndex: 700 }}>
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-slide-in-right min-w-[300px] ${bgMap[toast.type]}`}
        >
          {iconMap[toast.type]}
          <p className="text-sm font-medium text-foreground flex-1">{toast.message}</p>
          <button
            onClick={() => dispatch({ type: 'UI_REMOVE_TOAST', payload: toast.id })}
            className="p-1 rounded hover:bg-black/5 transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
