"use client"

import { useState } from "react"

const StudentDocuments = () => {
  const [documents, setDocuments] = useState([
    { id: 1, name: "CV/Resume", required: true, uploaded: false, type: "PDF" },
    { id: 2, name: "Cover Letter", required: true, uploaded: false, type: "PDF" },
    { id: 3, name: "Academic Transcript", required: true, uploaded: true, type: "PDF" },
    { id: 4, name: "Recommendation Letter", required: false, uploaded: false, type: "PDF" },
    { id: 5, name: "Portfolio", required: false, uploaded: false, type: "ZIP" },
  ])

  const [uploadingDoc, setUploadingDoc] = useState(null)

  const handleDocumentUpload = (docId) => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".pdf,.doc,.docx,.jpg,.png"
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          // 10MB limit
          alert("File size must be less than 10MB")
          return
        }

        setUploadingDoc(docId)
        // Simulate upload delay
        setTimeout(() => {
          setDocuments((prev) =>
            prev.map((doc) => (doc.id === docId ? { ...doc, uploaded: true, fileName: file.name } : doc)),
          )
          setUploadingDoc(null)
          alert(`${file.name} uploaded successfully!`)
        }, 2000)
      }
    }
    input.click()
  }

  const handleReplaceDocument = (docId) => {
    if (window.confirm("Are you sure you want to replace this document?")) {
      handleDocumentUpload(docId)
    }
  }

  const completedDocs = documents.filter((doc) => doc.uploaded).length
  const totalRequiredDocs = documents.filter((doc) => doc.required).length
  const documentProgress = Math.round((completedDocs / documents.length) * 100)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Documents</h1>
        <p className="text-gray-600 text-lg">Upload and manage your required documents</p>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Upload Progress</h2>
          <span className="text-2xl font-bold text-blue-600">{documentProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${documentProgress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600">
          {completedDocs} of {documents.length} documents uploaded (
          {totalRequiredDocs - documents.filter((doc) => doc.required && doc.uploaded).length} required remaining)
        </p>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Document List</h2>

        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📄</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{doc.name}</h3>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        doc.required ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {doc.required ? "Required" : "Optional"}
                    </span>
                    <span className="text-sm text-gray-500">Format: {doc.type}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {doc.uploaded ? (
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <span className="mr-1">✓</span>
                      Uploaded
                    </span>
                    <button
                      onClick={() => handleReplaceDocument(doc.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Replace
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleDocumentUpload(doc.id)}
                    disabled={uploadingDoc === doc.id}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <span className="mr-2">📤</span>
                    {uploadingDoc === doc.id ? "Uploading..." : "Upload"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Upload Instructions */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Upload Instructions</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Maximum file size: 10MB per document</li>
            <li>• Accepted formats: PDF, DOC, DOCX, JPG, PNG</li>
            <li>• Ensure all documents are clearly readable</li>
            <li>• Required documents must be uploaded to access full functionality</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default StudentDocuments
