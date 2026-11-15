import { Component, ReactNode, ErrorInfo } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  errorMessage: string
}

/**
 * Catches render errors so a bug shows a friendly retro screen instead of a
 * blank page.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, errorMessage: '' }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message || 'An unexpected error occurred' }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  private handleReload = (): void => {
    window.location.reload()
  }

  private handleHome = (): void => {
    window.location.href = '/'
  }

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-slate-800 border-4 border-red-600 shadow-[8px_8px_0_0_#991B1B] p-8 text-center">
          <h1 className="text-2xl font-retro text-red-400 mb-4">⚠️ ERROR</h1>

          <p className="text-slate-300 font-retro text-sm mb-6 leading-relaxed">
            Something went wrong. Reloading usually fixes it.
          </p>

          <details className="mb-6 text-left">
            <summary className="text-slate-400 font-retro text-xs cursor-pointer hover:text-slate-300 mb-2">
              Error Details
            </summary>
            <p className="text-red-400 font-mono text-xs bg-black p-2 border border-red-600 rounded break-words">
              {this.state.errorMessage}
            </p>
          </details>

          <button
            onClick={this.handleReload}
            className="w-full bg-red-600 hover:bg-red-500 active:translate-y-1 text-white px-6 py-3 border-4 border-black font-retro text-sm uppercase shadow-[4px_4px_0_0_#000] tracking-widest"
          >
            Try Again
          </button>

          <button
            onClick={this.handleHome}
            className="w-full mt-3 bg-slate-700 hover:bg-slate-600 active:translate-y-1 text-white px-6 py-3 border-4 border-black font-retro text-sm uppercase shadow-[4px_4px_0_0_#000] tracking-widest"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }
}
