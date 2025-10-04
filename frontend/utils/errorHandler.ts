"use client"
import { useRouter } from 'next/navigation'

export interface ApiError {
  status: number
  message: string
  code?: string
}

export class ErrorHandler {
  private router: any

  constructor(router: any) {
    this.router = router
  }

  handleError(error: any): void {
    console.error('Error handled:', error)

    // Network errors
    if (!navigator.onLine) {
      this.router.push('/offline')
      return
    }

    // API errors
    if (error?.response) {
      const status = error.response.status
      
      switch (status) {
        case 404:
          this.router.push('/not-found')
          break
        case 500:
        case 502:
        case 503:
        case 504:
          this.router.push('/server-error')
          break
        case 401:
          // Handle unauthorized - redirect to login
          this.router.push('/auth/login')
          break
        case 403:
          // Handle forbidden - show access denied
          this.router.push('/access-denied')
          break
        default:
          // For other errors, show a generic error page
          this.router.push('/error')
      }
    } else if (error?.message) {
      // Client-side errors
      if (error.message.includes('Network Error') || error.message.includes('fetch')) {
        this.router.push('/offline')
      } else {
        this.router.push('/error')
      }
    } else {
      // Unknown errors
      this.router.push('/error')
    }
  }

  static createErrorHandler(router: any): ErrorHandler {
    return new ErrorHandler(router)
  }
}

// Hook for using error handler
export function useErrorHandler() {
  const router = useRouter()
  return ErrorHandler.createErrorHandler(router)
}

// Utility function to check if error is retryable
export function isRetryableError(error: any): boolean {
  if (!navigator.onLine) return true
  
  if (error?.response) {
    const status = error.response.status
    // Retry on server errors and timeouts
    return status >= 500 || status === 408 || status === 429
  }
  
  // Retry on network errors
  return error?.message?.includes('Network Error') || error?.message?.includes('fetch')
}

// Utility function to get user-friendly error message
export function getErrorMessage(error: any): string {
  if (!navigator.onLine) {
    return 'No internet connection. Please check your network and try again.'
  }

  if (error?.response) {
    const status = error.response.status
    const message = error.response.data?.message || error.response.statusText

    switch (status) {
      case 400:
        return 'Invalid request. Please check your input and try again.'
      case 401:
        return 'You are not authorized to perform this action.'
      case 403:
        return 'Access denied. You do not have permission to access this resource.'
      case 404:
        return 'The requested resource was not found.'
      case 408:
        return 'Request timeout. Please try again.'
      case 429:
        return 'Too many requests. Please wait a moment and try again.'
      case 500:
        return 'Internal server error. Please try again later.'
      case 502:
        return 'Bad gateway. The server is temporarily unavailable.'
      case 503:
        return 'Service unavailable. Please try again later.'
      case 504:
        return 'Gateway timeout. The server is taking too long to respond.'
      default:
        return message || 'An unexpected error occurred.'
    }
  }

  if (error?.message) {
    if (error.message.includes('Network Error')) {
      return 'Network error. Please check your connection and try again.'
    }
    return error.message
  }

  return 'An unexpected error occurred. Please try again.'
}
