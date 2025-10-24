import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePdfs } from '@/hooks/usePdfs'
import { DocumentCard } from '@/components/documents/DocumentCard'
import { Alert } from '@/components/common/Alert'
import { Toast } from '@/components/common/Toast'
import { useRecoilValue } from 'recoil'
import { documentsErrorAtom } from '@/atoms/documentsAtom'

export const DocumentsPage: React.FC = () => {
  const { pdfs, isLoading, uploadAsync, isUploading } = usePdfs()
  const error = useRecoilValue(documentsErrorAtom)
  const [uploadError, setUploadError] = useState('')
  const [toast, setToast] = useState<{
    message: string
    type: 'success' | 'error' | 'info'
  } | null>(null)
  const navigate = useNavigate()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      setUploadError('Please upload a PDF file')
      setToast({ message: 'Vui lòng chọn file PDF', type: 'error' })
      return
    }

    setUploadError('')
    try {
      const pdf = await uploadAsync(file)
      setToast({ message: `Tài liệu "${pdf.name}" đã được tải lên thành công!`, type: 'success' })
      navigate(`/documents/${pdf.id}`)
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed')
      setToast({ message: 'Tải lên thất bại. Vui lòng thử lại.', type: 'error' })
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Documents</h1>
        <div>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            disabled={isUploading}
          />
          <label
            htmlFor="file-upload"
            className={`inline-flex items-center justify-center px-4 py-2 text-base font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 cursor-pointer ${
              isUploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isUploading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Uploading...
              </span>
            ) : (
              'Upload PDF'
            )}
          </label>
        </div>
      </div>

      {(error || uploadError) && (
        <div className="mb-6">
          <Alert type="error">{error || uploadError}</Alert>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : pdfs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
          <p className="text-gray-600 mb-6">Upload your first PDF to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pdfs.map((pdf) => (
            <DocumentCard key={pdf.id} pdf={pdf} />
          ))}
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={!!toast}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
