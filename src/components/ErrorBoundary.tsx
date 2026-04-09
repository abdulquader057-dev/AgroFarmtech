import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl text-center space-y-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="text-red-600 w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
              <p className="text-muted-foreground">
                The application encountered an unexpected error. Don't worry, your data is safe.
              </p>
            </div>
            {this.state.error && (
              <div className="p-4 bg-muted/50 rounded-2xl text-left overflow-auto max-h-32">
                <code className="text-xs text-red-500">{this.state.error.message}</code>
              </div>
            )}
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full rounded-2xl py-6 h-auto font-bold"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Reload Application
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
