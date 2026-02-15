// Status translations
export const statusLabels = {
  // Booking statuses
  confirmed: 'Confirmé',
  pending: 'En attente',
  completed: 'Terminé',
  cancelled: 'Annulé',

  // Payment statuses
  paid: 'Payé',
  unpaid: 'Impayé',

  // General statuses
  active: 'Actif',
  inactive: 'Inactif',
  paused: 'En pause',

  // Subscription statuses
  subscribed: 'Abonné',
  regular: 'Régulier',

  // Field statuses
  available: 'Disponible',
  unavailable: 'Indisponible',
  maintenance: 'Maintenance'
}

// Translate status to French
export const translateStatus = (status) => {
  return statusLabels[status] || status
}

// Get status variant for badges
export const getStatusVariant = (status) => {
  const variants = {
    confirmed: 'success',
    confirmé: 'success',
    pending: 'warning',
    'en attente': 'warning',
    completed: 'info',
    terminé: 'info',
    cancelled: 'danger',
    annulé: 'danger',
    paid: 'success',
    payé: 'success',
    unpaid: 'warning',
    impayé: 'warning',
    active: 'success',
    actif: 'success',
    inactive: 'gray',
    inactif: 'gray',
    paused: 'warning',
    'en pause': 'warning',
    subscribed: 'info',
    abonné: 'info',
    available: 'success',
    disponible: 'success'
  }
  return variants[status?.toLowerCase()] || 'gray'
}
