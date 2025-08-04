import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Logged error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: 'red' }}>
          <h2 className='bg-red'>Something went wrong!</h2>
          <pre>{this.state.error?.toString()}</pre>
        <div></div>
        
        </div>

      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
