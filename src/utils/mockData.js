import { v4 as uuidv4 } from 'uuid'
import { addDays, subDays, format, addHours } from 'date-fns'

const FIELD_NAMES = ['5v5 #1', '5v5 #2', '11v11 #1']
const CUSTOMER_NAMES = [
  'Ahmed Hassan', 'Mohamed Ali', 'Sara Ibrahim', 'Fatima Ahmed',
  'Omar Khalil', 'Layla Mohamed', 'Youssef Samir', 'Nour Hassan',
  'Karim Zayed', 'Yasmin Nabil', 'Hassan Omar', 'Mariam Fathi',
  'Ali Rahman', 'Hana Saleh', 'Tariq Mansour', 'Dina Youssef'
]
const STATUSES = ['confirmed', 'pending', 'completed', 'cancelled']
const PAYMENT_METHODS = ['cash', 'card', 'bank_transfer', 'wallet']

// Helper function to check if two bookings overlap
// Returns true if bookings conflict (same field, same date, overlapping times)
function bookingsOverlap(booking1, booking2) {
  // Different fields or different dates = no conflict
  if (booking1.fieldId !== booking2.fieldId || booking1.date !== booking2.date) {
    return false
  }

  // Calculate start and end times
  const start1 = parseInt(booking1.startTime.split(':')[0])
  const end1 = start1 + booking1.duration
  const start2 = parseInt(booking2.startTime.split(':')[0])
  const end2 = start2 + booking2.duration

  // Check if time ranges overlap
  // Example: 5-7PM overlaps with 6-8PM (5 < 8 && 6 < 7 = true)
  // Example: 5-7PM does NOT overlap with 7-9PM (5 < 9 but 7 < 7 = false)
  return start1 < end2 && start2 < end1
}

export function generateMockBookings(count = 250) {
  const bookings = []
  let attempts = 0
  const maxAttempts = count * 3 // Try up to 3x the target count

  while (bookings.length < count && attempts < maxAttempts) {
    attempts++

    // 70% of bookings within ±7 days of today (busier near current date)
    // 30% spread across ±30 days
    let date
    if (Math.random() < 0.7) {
      // Concentrate bookings around today
      date = addDays(new Date(), Math.floor(Math.random() * 14) - 7) // -7 to +7 days
    } else {
      // Some bookings further out
      date = addDays(new Date(), Math.floor(Math.random() * 60) - 30) // -30 to +30 days
    }

    // Peak hours: 5 PM - 9 PM (17:00 - 21:00) are busier
    let hour
    if (Math.random() < 0.6) {
      // 60% of bookings in peak hours
      hour = Math.floor(Math.random() * 5) + 17 // 5 PM to 9 PM
    } else {
      // 40% spread throughout the day
      hour = Math.floor(Math.random() * 12) + 8 // 8 AM to 8 PM
    }

    const duration = [1, 2][Math.floor(Math.random() * 2)] // Only 1 or 2 hours

    // Make sure booking doesn't extend past 10 PM (22:00)
    if (hour + duration > 22) {
      continue // Skip this attempt and try again
    }

    const fieldId = `FLD-${Math.floor(Math.random() * 3) + 1}`
    const fieldIndex = parseInt(fieldId.split('-')[1]) - 1
    const hourlyRate = fieldId === 'FLD-3' ? 500 : 350 // 11v11 is 500 DH, 5v5 fields are 350 DH
    const dateStr = format(date, 'yyyy-MM-dd')

    // 25% chance this is a subscription booking
    const isSubscription = Math.random() < 0.25

    // Create potential booking
    const newBooking = {
      id: `BK-${1000 + bookings.length}`,
      customerId: `CUS-${Math.floor(Math.random() * 50) + 1}`,
      customerName: CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)],
      customerPhone: `+212 6 ${Math.floor(Math.random() * 9000000) + 1000000}`,
      fieldId,
      fieldName: FIELD_NAMES[fieldIndex],
      date: dateStr,
      startTime: `${hour.toString().padStart(2, '0')}:00`,
      endTime: `${(hour + duration).toString().padStart(2, '0')}:00`,
      duration,
      price: duration * hourlyRate,
      status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
      paymentStatus: Math.random() > 0.2 ? 'paid' : 'pending',
      paymentMethod: PAYMENT_METHODS[Math.floor(Math.random() * PAYMENT_METHODS.length)],
      createdAt: subDays(date, Math.floor(Math.random() * 10)).toISOString(),
      notes: Math.random() > 0.7 ? 'Special equipment requested' : '',
      isSubscription,
      subscriptionId: isSubscription ? `SUB-${Math.floor(Math.random() * 20) + 100}` : null
    }

    // Check for conflicts
    const hasConflict = bookings.some(existingBooking =>
      bookingsOverlap(newBooking, existingBooking)
    )

    // Only add if no conflict
    if (!hasConflict) {
      bookings.push(newBooking)
    }
  }

  return bookings.sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function generateMockFields() {
  return [
    {
      id: 'FLD-1',
      name: '5v5 #1',
      type: '5v5',
      size: '30x20m',
      hourlyRate: 350,
      surfaceType: 'Artificial Grass',
      lighting: true,
      covered: false,
      status: 'available',
      amenities: ['Changing Rooms', 'Parking', 'WiFi'],
      maintenanceSchedule: []
    },
    {
      id: 'FLD-2',
      name: '5v5 #2',
      type: '5v5',
      size: '30x20m',
      hourlyRate: 350,
      surfaceType: 'Artificial Grass',
      lighting: true,
      covered: false,
      status: 'available',
      amenities: ['Changing Rooms', 'Parking', 'WiFi'],
      maintenanceSchedule: []
    },
    {
      id: 'FLD-3',
      name: '11v11 #1',
      type: '11v11',
      size: '100x64m',
      hourlyRate: 500,
      surfaceType: 'Artificial Grass',
      lighting: true,
      covered: false,
      status: 'available',
      amenities: ['Changing Rooms', 'Parking', 'WiFi', 'Seating Area'],
      maintenanceSchedule: []
    }
  ]
}

export function generateMockCustomers(count = 50) {
  const customers = []

  for (let i = 0; i < count; i++) {
    const joinedDate = subDays(new Date(), Math.floor(Math.random() * 365))
    const totalBookings = Math.floor(Math.random() * 50) + 1
    const avgBookingPrice = 150

    customers.push({
      id: `CUS-${i + 1}`,
      name: CUSTOMER_NAMES[i % CUSTOMER_NAMES.length] + (i >= CUSTOMER_NAMES.length ? ` ${Math.floor(i / CUSTOMER_NAMES.length) + 1}` : ''),
      email: `customer${i + 1}@example.com`,
      phone: `+212 6 ${Math.floor(Math.random() * 9000000) + 1000000}`,
      joinedDate: format(joinedDate, 'yyyy-MM-dd'),
      totalBookings,
      totalRevenue: totalBookings * avgBookingPrice * (0.8 + Math.random() * 0.4), // Some variation
      status: Math.random() > 0.1 ? 'active' : 'inactive',
      subscriptionStatus: Math.random() > 0.7 ? 'subscribed' : 'none',
      notes: ''
    })
  }

  return customers
}

export function generateMockSubscriptions(count = 15) {
  const subscriptions = []
  const frequencies = ['weekly', 'bi-weekly', 'monthly']
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const statuses = ['active', 'paused', 'cancelled']

  for (let i = 0; i < count; i++) {
    const frequency = frequencies[Math.floor(Math.random() * frequencies.length)]
    const dayOfWeek = daysOfWeek[Math.floor(Math.random() * daysOfWeek.length)]
    const duration = 2
    const hourlyRate = [100, 120, 150][Math.floor(Math.random() * 3)]
    const sessionsPerMonth = frequency === 'weekly' ? 4 : frequency === 'bi-weekly' ? 2 : 1
    const monthlyRate = sessionsPerMonth * duration * hourlyRate

    subscriptions.push({
      id: `SUB-${100 + i}`,
      customerId: `CUS-${Math.floor(Math.random() * 50) + 1}`,
      customerName: CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)],
      fieldId: `FLD-${Math.floor(Math.random() * 3) + 1}`,
      fieldName: FIELD_NAMES[Math.floor(Math.random() * FIELD_NAMES.length)],
      frequency,
      dayOfWeek,
      startTime: '18:00',
      duration,
      monthlyRate,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      status: statuses[Math.floor(Math.random() * statuses.length)],
      nextBooking: addDays(new Date(), Math.floor(Math.random() * 14)).toISOString(),
      createdAt: subDays(new Date(), Math.floor(Math.random() * 60)).toISOString()
    })
  }

  return subscriptions
}

export function generateMockRevenue() {
  const dailyRevenue = []
  const monthlyRevenue = []

  // Last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = subDays(new Date(), i)
    const isWeekend = date.getDay() === 5 || date.getDay() === 6 // Friday or Saturday
    const baseAmount = isWeekend ? 2500 : 1500
    const variance = Math.random() * 500

    dailyRevenue.push({
      date: format(date, 'yyyy-MM-dd'),
      amount: Math.floor(baseAmount + variance),
      bookings: Math.floor((baseAmount + variance) / 150)
    })
  }

  // Last 12 months
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  for (let i = 11; i >= 0; i--) {
    const date = subDays(new Date(), i * 30)
    const monthIndex = date.getMonth()
    const baseAmount = 45000
    const variance = Math.random() * 15000

    monthlyRevenue.push({
      month: `${monthNames[monthIndex]} ${date.getFullYear()}`,
      amount: Math.floor(baseAmount + variance),
      bookings: Math.floor((baseAmount + variance) / 150),
      subscriptionRevenue: Math.floor((baseAmount + variance) * 0.3)
    })
  }

  return { dailyRevenue, monthlyRevenue }
}

export function generatePaymentMethods() {
  return [
    { method: 'Cash', percentage: 35, amount: 21000 },
    { method: 'Card', percentage: 45, amount: 27000 },
    { method: 'Bank Transfer', percentage: 15, amount: 9000 },
    { method: 'Wallet', percentage: 5, amount: 3000 }
  ]
}

export function getRecentPayments(bookings, limit = 20) {
  return bookings
    .filter(b => b.paymentStatus === 'paid')
    .slice(0, limit)
    .map(b => ({
      id: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      bookingId: b.id,
      date: b.date,
      customerName: b.customerName,
      amount: b.price,
      method: b.paymentMethod,
      status: 'completed'
    }))
}
