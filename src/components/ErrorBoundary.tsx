import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || 'An unexpected error occurred.',
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Application ErrorBoundary caught:', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#081428] text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-2xl bg-[#0F2342]/90 border border-[#60B5FF]/30 p-8 text-center shadow-2xl">
            <h2 className="font-display text-2xl text-[#BCE3FF] mb-3">
              Something paused for a moment
            </h2>
            <p className="text-sm text-[#DBEAFE]/80 mb-6 leading-relaxed">
              We hit a small hiccup while loading this scene. Refreshing should bring everything right back.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 rounded-xl bg-[#60B5FF] text-[#081428] font-semibold text-sm hover:bg-[#8CCCFF] transition-colors cursor-pointer"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
