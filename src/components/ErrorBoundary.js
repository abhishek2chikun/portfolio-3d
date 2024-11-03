'use client'
import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-white text-center p-4">
          {this.props.fallback || 'Something went wrong.'}
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary 