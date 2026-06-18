const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export const uploadFile = async (file, onProgress) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', 'bos-documents')

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const percent = Math.round(
          (e.loaded / e.total) * 100
        )
        onProgress(percent)
      }
    })
    
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText)
        resolve({
          url: data.secure_url,
          publicId: data.public_id,
          error: null
        })
      } else {
        const error = JSON.parse(xhr.responseText)
        reject(new Error(error.error?.message || 'Upload failed'))
      }
    })
    
    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'))
    })
    
    xhr.open(
      'POST',
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`
    )
    xhr.send(formData)
  })
}
