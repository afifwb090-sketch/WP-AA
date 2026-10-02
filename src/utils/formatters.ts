export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatShortRupiah = (amount: number): string => {
  if (amount >= 1_000_000_000) {
    return `Rp ${(amount / 1_000_000_000).toFixed(1)} M`;
  }
  if (amount >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(1)} Jt`;
  }
  if (amount >= 1_000) {
    return `Rp ${(amount / 1_000).toFixed(0)} Rb`;
  }
  return `Rp ${amount}`;
};

export const formatDateIndo = (dateStr: string): string => {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateStr;
  }
};

export const calculateDaysRemaining = (targetDateStr: string): {
  days: number;
  isPast: boolean;
  statusText: string;
} => {
  if (!targetDateStr) {
    return { days: 0, isPast: false, statusText: 'Tanggal belum ditentukan' };
  }
  const target = new Date(targetDateStr).getTime();
  const now = new Date().getTime();
  const diffTime = target - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      days: Math.abs(diffDays),
      isPast: true,
      statusText: `${Math.abs(diffDays)} Hari yang lalu (Selesai)`
    };
  } else if (diffDays === 0) {
    return {
      days: 0,
      isPast: false,
      statusText: 'Hari ini acara berlangsung!'
    };
  } else {
    return {
      days: diffDays,
      isPast: false,
      statusText: `${diffDays} Hari Menuju Acara`
    };
  }
};
