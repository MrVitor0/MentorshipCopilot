import { createContext, useState, useCallback } from 'react'
import ConfirmDialog from '../components/ConfirmDialog'

export const ConfirmDialogContext = createContext()

export function ConfirmDialogProvider({ children }) {
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    confirmText: 'OK',
    cancelText: 'Cancel',
    showCancel: false,
    onConfirm: null,
    onCancel: null
  })

  const showDialog = useCallback(({
    type = 'info',
    title,
    message,
    confirmText = 'OK',
    cancelText = 'Cancel',
    showCancel = false
  }) => {
    return new Promise((resolve) => {
      setDialogState({
        isOpen: true,
        type,
        title,
        message,
        confirmText,
        cancelText,
        showCancel,
        onConfirm: () => {
          resolve(true)
        },
        onCancel: () => {
          resolve(false)
        }
      })
    })
  }, [])

  const alert = useCallback((message, title = 'Alert', type = 'info') => {
    return showDialog({
      type,
      title,
      message,
      confirmText: 'OK',
      showCancel: false
    })
  }, [showDialog])

  const confirm = useCallback((message, title = 'Confirm', type = 'warning') => {
    return showDialog({
      type,
      title,
      message,
      confirmText: 'Yes',
      cancelText: 'No',
      showCancel: true
    })
  }, [showDialog])

  const success = useCallback((message, title = 'Success') => {
    return showDialog({
      type: 'success',
      title,
      message,
      confirmText: 'OK',
      showCancel: false
    })
  }, [showDialog])

  const error = useCallback((message, title = 'Error') => {
    return showDialog({
      type: 'error',
      title,
      message,
      confirmText: 'OK',
      showCancel: false
    })
  }, [showDialog])

  const warning = useCallback((message, title = 'Warning') => {
    return showDialog({
      type: 'warning',
      title,
      message,
      confirmText: 'OK',
      showCancel: false
    })
  }, [showDialog])

  const info = useCallback((message, title = 'Information') => {
    return showDialog({
      type: 'info',
      title,
      message,
      confirmText: 'OK',
      showCancel: false
    })
  }, [showDialog])

  const closeDialog = useCallback(() => {
    setDialogState(prev => ({ ...prev, isOpen: false }))
  }, [])

  const value = {
    showDialog,
    alert,
    confirm,
    success,
    error,
    warning,
    info
  }

  return (
    <ConfirmDialogContext.Provider value={value}>
      {children}
      <ConfirmDialog
        isOpen={dialogState.isOpen}
        type={dialogState.type}
        title={dialogState.title}
        message={dialogState.message}
        confirmText={dialogState.confirmText}
        cancelText={dialogState.cancelText}
        showCancel={dialogState.showCancel}
        onConfirm={dialogState.onConfirm}
        onCancel={dialogState.onCancel}
        onClose={closeDialog}
      />
    </ConfirmDialogContext.Provider>
  )
}
