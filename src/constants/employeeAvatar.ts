type Listener = () => void

let photoUrl: string | null = null
const listeners = new Set<Listener>()

function emit() {
  listeners.forEach((listener) => listener())
}

export function getEmployeePhotoUrl() {
  return photoUrl
}

export function setEmployeePhotoUrl(next: string | null) {
  if (photoUrl && photoUrl.startsWith('blob:') && photoUrl !== next) {
    URL.revokeObjectURL(photoUrl)
  }
  photoUrl = next
  emit()
}

export function subscribeEmployeePhoto(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
