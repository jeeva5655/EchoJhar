import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  showError?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="m-4">
          <CardContent className="p-6">
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-red-800">Something went wrong</h3>
                    <p className="text-red-700 text-sm mt-1">
                      An error occurred while rendering this component. This might be due to a missing API key or network issue.
                    </p>
                  </div>

                  {this.props.showError && this.state.error && (
                    <div className="p-3 bg-red-100 border border-red-200 rounded text-xs">
                      <details>
                        <summary className="cursor-pointer font-medium text-red-800 mb-2">
                          Error Details (Click to expand)
                        </summary>
                        <div className="space-y-2">
                          <div>
                            <strong>Error:</strong> {this.state.error.message}
                          </div>
                          <div>
                            <strong>Stack:</strong>
                            <pre className="whitespace-pre-wrap text-xs mt-1 max-h-32 overflow-y-auto">
                              {this.state.error.stack}
                            </pre>
                          </div>
                        </div>
                      </details>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={this.handleReset}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={this.handleReload}
                    >
                      Reload Page
                    </Button>
                  </div>

                  <div className="text-xs text-red-600">
                    <p>
                      <strong>Common causes:</strong> Missing API keys, network connectivity issues, 
                      or browser compatibility problems. Check the console for detailed error information.
                    </p>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

// Simple error boundary for inline use
export const SimpleErrorBoundary: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback = <div className="p-4 text-red-600">Something went wrong. Please try refreshing the page.</div> 
}) => {
  return (
    <ErrorBoundary fallback={fallback}>
      {children}
    </ErrorBoundary>
  );
};