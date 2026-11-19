import Swal from 'sweetalert2'

export const showSuccess = (text) =>
  Swal.fire({ icon: 'success', title: 'Berhasil', text, timer: 1800, showConfirmButton: false })

export const showError = (text) => Swal.fire({ icon: 'error', title: 'Gagal', text })

export const confirmDialog = async (text, confirmText = 'Ya, lanjutkan') => {
  const res = await Swal.fire({
    icon: 'warning', title: 'Konfirmasi', text,
    showCancelButton: true, confirmButtonText: confirmText, cancelButtonText: 'Batal',
  })
  return res.isConfirmed
}

export const formatDate = (iso) => {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}
