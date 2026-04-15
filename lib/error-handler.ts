"use client"

import { useToast } from "@/hooks/use-toast"

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ValidationError"
  }
}

export const useErrorHandler = () => {
  const { toast } = useToast()

  return {
    /**
     * Handle general errors with logging and user notification
     */
    handle: (error: Error | unknown, context: string = "An error occurred") => {
      const errorMessage = error instanceof Error ? error.message : String(error)
      
      // Log in development
      if (process.env.NODE_ENV === "development") {
        console.error(`[${context}]`, error)
      }

      toast({
        title: "Error",
        description: errorMessage || context,
        variant: "destructive",
      })
    },

    /**
     * Handle validation errors with specific messaging
     */
    handleValidation: (error: unknown, defaultMessage: string = "Validation failed") => {
      if (error instanceof ValidationError) {
        toast({
          title: "Validation Error",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Validation Error",
          description: defaultMessage,
          variant: "destructive",
        })
      }
    },

    /**
     * Handle file-related errors
     */
    handleFileError: (error: unknown, context: string = "File operation failed") => {
      let description = "An error occurred while processing the file"

      if (error instanceof Error) {
        if (error.name === "NotReadableError") {
          description = "Failed to read the file. Please try again."
        } else if (error.message.includes("JSON")) {
          description = "Invalid file format. Please check and try again."
        } else {
          description = error.message
        }
      }

      toast({
        title: "File Error",
        description,
        variant: "destructive",
      })

      if (process.env.NODE_ENV === "development") {
        console.error(`[${context}]`, error)
      }
    },

    /**
     * Show success message
     */
    success: (title: string, description?: string) => {
      toast({
        title,
        description,
      })
    },

    /**
     * Show info message
     */
    info: (title: string, description?: string) => {
      toast({
        title,
        description,
      })
    },

    /**
     * Show warning message
     */
    warning: (title: string, description?: string) => {
      toast({
        title,
        description,
        variant: "destructive",
      })
    },
  }
}
