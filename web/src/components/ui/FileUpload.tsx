import type { DragEvent, ChangeEvent } from 'react'
import { useRef, useState } from 'react'

interface FileUploadProps {
  label?: string
  accept?: string
  maxSizeMb?: number
  onFileSelect: (file: File) => void
}

export function FileUpload({
  label = 'Glisse-dépose un fichier ou clique pour parcourir',
  accept = '.pdf,.doc,.docx',
  maxSizeMb = 5,
  onFileSelect,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFile = (file: File) => {
    const maxBytes = maxSizeMb * 1024 * 1024
    if (file.size > maxBytes) {
      setError(`Le fichier dépasse ${maxSizeMb} Mo`)
      setFileName(null)
      return
    }
    setError(null)
    setFileName(file.name)
    onFileSelect(file)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed
          px-6 py-8 text-center cursor-pointer transition-colors
          ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-surface-border bg-surface-subtle'}`}
      >
        <span className="text-sm text-ink-muted">
          {fileName ? `📄 ${fileName}` : label}
        </span>
        <span className="text-xs text-ink-faint">
          Formats acceptés : {accept} — max {maxSizeMb} Mo
        </span>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}