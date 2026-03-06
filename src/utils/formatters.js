export function formatPhone(phone) {
    if (!phone) return '';
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
}

export function formatEIN(ein) {
    if (!ein) return '';
    const cleaned = ('' + ein).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{7})$/);
    if (match) {
        return `${match[1]}-${match[2]}`;
    }
    return ein;
}

export function formatSSN(ssn) {
    if (!ssn) return '';
    const cleaned = ('' + ssn).replace(/\D/g, '');
    if (cleaned.length === 9) {
        return `•••-••-${cleaned.slice(-4)}`;
    }
    return `•••-••-${ssn.slice(-4) || '****'}`;
}

export function formatDate(dateString) {
    if (!dateString) return '';
    // Expected input: YYYY-MM-DD
    const [year, month, day] = dateString.split('-');
    if (year && month && day) {
        return `${month}/${day}/${year}`;
    }
    return dateString;
}

export function formatCurrency(amount) {
    if (amount === null || amount === undefined || isNaN(amount)) return '';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/* ── Input Masking Helpers (for forms) ── */

export function parseNumber(value) {
    if (typeof value === 'number') return value;
    if (!value) return null;
    const stripped = value.replace(/[^\d.]/g, '');
    const num = parseFloat(stripped);
    return isNaN(num) ? null : num;
}

export function maskCurrencyInput(value) {
    if (value === null || value === undefined) return '';
    const stringValue = String(value);
    const number = stringValue.replace(/\D/g, '');
    if (!number) return '';
    return parseInt(number, 10).toLocaleString('en-US');
}

export function maskPhoneInput(e) {
    let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    e.target.value = !x[2] ? x[1] : `(${x[1]}) ${x[2]}` + (x[3] ? `-${x[3]}` : '');
    return e;
}

export function maskEINInput(e) {
    let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,7})/);
    e.target.value = !x[2] ? x[1] : `${x[1]}-${x[2]}`;
    return e;
}

export function maskSSNInput(e) {
    let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,2})(\d{0,4})/);
    e.target.value = !x[2] ? x[1] : `${x[1]}-${x[2]}` + (x[3] ? `-${x[3]}` : '');
    return e;
}
