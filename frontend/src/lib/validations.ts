/**
 * Sistema de Validaciones para Taller Mecánico
 * Incluye validaciones para: RUT, Email, Teléfono, Patente, Stock, etc.
 */

// ============================================
// VALIDACIÓN DE RUT CHILENO
// ============================================

/**
 * Formatea un RUT chileno al formato XX.XXX.XXX-X
 */
export function formatRut(rut: string): string {
  // Eliminar puntos y guiones
  let value = rut.replace(/\./g, '').replace(/-/g, '');
  
  // Eliminar caracteres no válidos
  value = value.replace(/[^0-9kK]/g, '');
  
  if (value.length === 0) return '';
  
  // Separar cuerpo y dígito verificador
  const dv = value.slice(-1).toUpperCase();
  let body = value.slice(0, -1);
  
  // Formatear con puntos
  let formatted = '';
  while (body.length > 3) {
    formatted = '.' + body.slice(-3) + formatted;
    body = body.slice(0, -3);
  }
  formatted = body + formatted;
  
  return formatted + '-' + dv;
}

/**
 * Limpia el RUT de caracteres especiales
 */
export function cleanRut(rut: string): string {
  return rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();
}

/**
 * Calcula el dígito verificador de un RUT
 */
export function calculateDV(rutBody: string): string {
  let sum = 0;
  let multiplier = 2;
  
  for (let i = rutBody.length - 1; i >= 0; i--) {
    sum += parseInt(rutBody[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const remainder = 11 - (sum % 11);
  
  if (remainder === 11) return '0';
  if (remainder === 10) return 'K';
  return remainder.toString();
}

/**
 * Valida un RUT chileno completo
 */
export function validateRut(rut: string): { valid: boolean; message: string } {
  if (!rut || rut.trim() === '') {
    return { valid: false, message: 'El RUT es obligatorio' };
  }
  
  const cleanedRut = cleanRut(rut);
  
  if (cleanedRut.length < 8 || cleanedRut.length > 9) {
    return { valid: false, message: 'El RUT debe tener entre 8 y 9 caracteres' };
  }
  
  const body = cleanedRut.slice(0, -1);
  const dv = cleanedRut.slice(-1);
  
  // Verificar que el cuerpo sea numérico
  if (!/^\d+$/.test(body)) {
    return { valid: false, message: 'El RUT contiene caracteres inválidos' };
  }
  
  // Calcular y comparar dígito verificador
  const calculatedDV = calculateDV(body);
  
  if (dv !== calculatedDV) {
    return { valid: false, message: 'El RUT ingresado no es válido (dígito verificador incorrecto)' };
  }
  
  return { valid: true, message: '' };
}

// ============================================
// VALIDACIÓN DE EMAIL
// ============================================

/**
 * Valida formato de email
 */
export function validateEmail(email: string): { valid: boolean; message: string } {
  if (!email || email.trim() === '') {
    return { valid: false, message: 'El email es obligatorio' };
  }
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'El formato del email no es válido' };
  }
  
  return { valid: true, message: '' };
}

// ============================================
// VALIDACIÓN DE TELÉFONO CHILENO
// ============================================

/**
 * Formatea teléfono chileno
 */
export function formatPhone(phone: string): string {
  // Eliminar caracteres no numéricos excepto +
  let value = phone.replace(/[^\d+]/g, '');
  
  // Si empieza con +56, formatear
  if (value.startsWith('+56')) {
    const rest = value.slice(3);
    if (rest.length === 9) {
      return `+56 9 ${rest.slice(1, 5)} ${rest.slice(5)}`;
    }
  }
  
  // Si empieza con 9 y tiene 9 dígitos
  if (value.startsWith('9') && value.length === 9) {
    return `+56 9 ${value.slice(1, 5)} ${value.slice(5)}`;
  }
  
  return value;
}

/**
 * Valida teléfono chileno
 */
export function validatePhone(phone: string): { valid: boolean; message: string } {
  if (!phone || phone.trim() === '') {
    return { valid: false, message: 'El teléfono es obligatorio' };
  }
  
  // Limpiar número
  const cleanPhone = phone.replace(/[^\d]/g, '');
  
  // Validar longitud (9 dígitos sin código país, o 11 con +56)
  if (cleanPhone.length === 9) {
    if (!cleanPhone.startsWith('9')) {
      return { valid: false, message: 'Los celulares deben comenzar con 9' };
    }
    return { valid: true, message: '' };
  }
  
  if (cleanPhone.length === 11 && cleanPhone.startsWith('56')) {
    if (!cleanPhone.startsWith('569')) {
      return { valid: false, message: 'Formato de teléfono inválido' };
    }
    return { valid: true, message: '' };
  }
  
  return { valid: false, message: 'El teléfono debe tener 9 dígitos (ej: 912345678)' };
}

// ============================================
// VALIDACIÓN DE PATENTE CHILENA
// ============================================

/**
 * Formatea patente chilena a mayúsculas
 */
export function formatPatente(patente: string): string {
  return patente.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

/**
 * Valida patente chilena (formatos: LLLL99 o LL9999)
 */
export function validatePatente(patente: string): { valid: boolean; message: string } {
  if (!patente || patente.trim() === '') {
    return { valid: false, message: 'La patente es obligatoria' };
  }
  
  const cleanPatente = formatPatente(patente);
  
  // Formato nuevo: LLLL99 (4 letras + 2 números)
  const formatoNuevo = /^[A-Z]{4}\d{2}$/;
  
  // Formato antiguo: LL9999 (2 letras + 4 números)
  const formatoAntiguo = /^[A-Z]{2}\d{4}$/;
  
  // Formato intermedio: LLL999 (3 letras + 3 números)
  const formatoIntermedio = /^[A-Z]{3}\d{3}$/;
  
  if (!formatoNuevo.test(cleanPatente) && !formatoAntiguo.test(cleanPatente) && !formatoIntermedio.test(cleanPatente)) {
    return { 
      valid: false, 
      message: 'Formato de patente inválido. Use: ABCD12 (nuevo), AB1234 (antiguo) o ABC123' 
    };
  }
  
  return { valid: true, message: '' };
}

// ============================================
// VALIDACIÓN DE CAMPOS NUMÉRICOS
// ============================================

/**
 * Valida número entero positivo
 */
export function validatePositiveInteger(value: string | number, fieldName: string = 'El valor'): { valid: boolean; message: string } {
  const num = typeof value === 'string' ? parseInt(value) : value;
  
  if (isNaN(num)) {
    return { valid: false, message: `${fieldName} debe ser un número` };
  }
  
  if (num < 0) {
    return { valid: false, message: `${fieldName} no puede ser negativo` };
  }
  
  if (!Number.isInteger(num)) {
    return { valid: false, message: `${fieldName} debe ser un número entero` };
  }
  
  return { valid: true, message: '' };
}

/**
 * Valida decimal positivo (para precios)
 */
export function validatePositiveDecimal(value: string | number, fieldName: string = 'El valor'): { valid: boolean; message: string } {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) {
    return { valid: false, message: `${fieldName} debe ser un número` };
  }
  
  if (num < 0) {
    return { valid: false, message: `${fieldName} no puede ser negativo` };
  }
  
  return { valid: true, message: '' };
}

/**
 * Valida stock (cantidad disponible vs requerida)
 */
export function validateStock(stockActual: number, cantidadRequerida: number): { valid: boolean; message: string } {
  if (cantidadRequerida <= 0) {
    return { valid: false, message: 'La cantidad debe ser mayor a 0' };
  }
  
  if (stockActual < cantidadRequerida) {
    return { 
      valid: false, 
      message: `Stock insuficiente. Disponible: ${stockActual}, Requerido: ${cantidadRequerida}` 
    };
  }
  
  return { valid: true, message: '' };
}

// ============================================
// VALIDACIÓN DE AÑO DE VEHÍCULO
// ============================================

/**
 * Valida año del vehículo
 */
export function validateVehicleYear(year: string | number): { valid: boolean; message: string } {
  const currentYear = new Date().getFullYear();
  const yearNum = typeof year === 'string' ? parseInt(year) : year;
  
  if (isNaN(yearNum)) {
    return { valid: false, message: 'El año debe ser un número' };
  }
  
  if (yearNum < 1900) {
    return { valid: false, message: 'El año del vehículo no puede ser anterior a 1900' };
  }
  
  if (yearNum > currentYear + 1) {
    return { valid: false, message: `El año no puede ser mayor a ${currentYear + 1}` };
  }
  
  return { valid: true, message: '' };
}

// ============================================
// VALIDACIÓN DE TEXTO REQUERIDO
// ============================================

/**
 * Valida que un campo de texto no esté vacío
 */
export function validateRequired(value: string, fieldName: string): { valid: boolean; message: string } {
  if (!value || value.trim() === '') {
    return { valid: false, message: `${fieldName} es obligatorio` };
  }
  return { valid: true, message: '' };
}

/**
 * Valida longitud mínima y máxima
 */
export function validateLength(
  value: string, 
  fieldName: string, 
  min: number = 0, 
  max: number = 255
): { valid: boolean; message: string } {
  if (value.length < min) {
    return { valid: false, message: `${fieldName} debe tener al menos ${min} caracteres` };
  }
  
  if (value.length > max) {
    return { valid: false, message: `${fieldName} no puede exceder ${max} caracteres` };
  }
  
  return { valid: true, message: '' };
}

// ============================================
// VALIDACIÓN DE FECHA
// ============================================

/**
 * Valida que una fecha no sea anterior a hoy
 */
export function validateFutureDate(dateStr: string, fieldName: string = 'La fecha'): { valid: boolean; message: string } {
  if (!dateStr) {
    return { valid: false, message: `${fieldName} es obligatoria` };
  }
  
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (date < today) {
    return { valid: false, message: `${fieldName} no puede ser anterior a hoy` };
  }
  
  return { valid: true, message: '' };
}

/**
 * Valida que una fecha no sea futura
 */
export function validatePastDate(dateStr: string, fieldName: string = 'La fecha'): { valid: boolean; message: string } {
  if (!dateStr) {
    return { valid: false, message: `${fieldName} es obligatoria` };
  }
  
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  if (date > today) {
    return { valid: false, message: `${fieldName} no puede ser futura` };
  }
  
  return { valid: true, message: '' };
}

// ============================================
// VALIDACIÓN DE SKU
// ============================================

/**
 * Valida formato de SKU (código de producto)
 */
export function validateSku(sku: string): { valid: boolean; message: string } {
  if (!sku || sku.trim() === '') {
    return { valid: false, message: 'El SKU es obligatorio' };
  }
  
  // SKU debe ser alfanumérico y puede incluir guiones
  const skuRegex = /^[A-Za-z0-9\-]+$/;
  
  if (!skuRegex.test(sku)) {
    return { valid: false, message: 'El SKU solo puede contener letras, números y guiones' };
  }
  
  if (sku.length < 3 || sku.length > 20) {
    return { valid: false, message: 'El SKU debe tener entre 3 y 20 caracteres' };
  }
  
  return { valid: true, message: '' };
}

// ============================================
// VALIDACIÓN DE NÚMERO DE FACTURA
// ============================================

/**
 * Valida formato de número de factura
 */
export function validateInvoiceNumber(numero: string): { valid: boolean; message: string } {
  if (!numero || numero.trim() === '') {
    return { valid: false, message: 'El número de factura es obligatorio' };
  }
  
  // Debe comenzar con letras seguidas de guión y números
  const invoiceRegex = /^[A-Z]{2,4}-\d{4,10}$/;
  
  if (!invoiceRegex.test(numero.toUpperCase())) {
    return { valid: false, message: 'Formato de factura inválido. Use: FACT-12345' };
  }
  
  return { valid: true, message: '' };
}

// ============================================
// VALIDADOR COMBINADO PARA FORMULARIOS
// ============================================

export interface ValidationRule {
  field: string;
  value: any;
  rules: Array<{
    type: 'required' | 'email' | 'rut' | 'phone' | 'patente' | 'year' | 'positive' | 'decimal' | 'sku' | 'minLength' | 'maxLength';
    message?: string;
    params?: any;
  }>;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

/**
 * Valida múltiples campos con múltiples reglas
 */
export function validateForm(rules: ValidationRule[]): ValidationResult {
  const errors: Record<string, string> = {};
  
  for (const rule of rules) {
    for (const validation of rule.rules) {
      let result: { valid: boolean; message: string };
      
      switch (validation.type) {
        case 'required':
          result = validateRequired(rule.value, validation.message || rule.field);
          break;
        case 'email':
          result = validateEmail(rule.value);
          break;
        case 'rut':
          result = validateRut(rule.value);
          break;
        case 'phone':
          result = validatePhone(rule.value);
          break;
        case 'patente':
          result = validatePatente(rule.value);
          break;
        case 'year':
          result = validateVehicleYear(rule.value);
          break;
        case 'positive':
          result = validatePositiveInteger(rule.value, rule.field);
          break;
        case 'decimal':
          result = validatePositiveDecimal(rule.value, rule.field);
          break;
        case 'sku':
          result = validateSku(rule.value);
          break;
        case 'minLength':
          result = validateLength(rule.value, rule.field, validation.params?.min || 0, 9999);
          break;
        case 'maxLength':
          result = validateLength(rule.value, rule.field, 0, validation.params?.max || 255);
          break;
        default:
          result = { valid: true, message: '' };
      }
      
      if (!result.valid) {
        errors[rule.field] = validation.message || result.message;
        break; // Solo un error por campo
      }
    }
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

// ============================================
// VALIDACIONES DE NEGOCIO
// ============================================

/**
 * Valida que una orden pueda cambiar de estado
 */
export function validateOrderStateChange(
  currentState: string, 
  newState: string
): { valid: boolean; message: string } {
  const validTransitions: Record<string, string[]> = {
    'ingresado': ['en_diagnostico'],
    'en_diagnostico': ['en_reparacion', 'ingresado'],
    'en_reparacion': ['finalizado', 'en_diagnostico'],
    'finalizado': ['facturado'],
    'facturado': ['entregado'],
    'entregado': [] // Estado final
  };
  
  const allowed = validTransitions[currentState] || [];
  
  if (!allowed.includes(newState)) {
    return { 
      valid: false, 
      message: `No se puede cambiar de "${currentState}" a "${newState}". Transiciones válidas: ${allowed.join(', ') || 'ninguna'}` 
    };
  }
  
  return { valid: true, message: '' };
}

/**
 * Valida que se pueda generar una factura
 */
export function validateCanGenerateInvoice(orderState: string, hasInvoice: boolean): { valid: boolean; message: string } {
  if (hasInvoice) {
    return { valid: false, message: 'Esta orden ya tiene una factura generada' };
  }
  
  if (orderState !== 'finalizado') {
    return { valid: false, message: 'Solo se pueden facturar órdenes finalizadas' };
  }
  
  return { valid: true, message: '' };
}

/**
 * Valida que se pueda entregar un vehículo
 */
export function validateCanDeliverVehicle(
  orderState: string, 
  invoiceState: string | null
): { valid: boolean; message: string } {
  if (orderState !== 'facturado') {
    return { valid: false, message: 'La orden debe estar facturada para entregar el vehículo' };
  }
  
  if (invoiceState !== 'pagado') {
    return { valid: false, message: 'La factura debe estar pagada para entregar el vehículo' };
  }
  
  return { valid: true, message: '' };
}

/**
 * Valida que se pueda aprobar una solicitud de repuesto
 */
export function validateCanApprovePart(
  stockActual: number, 
  cantidadSolicitada: number
): { valid: boolean; message: string } {
  if (stockActual < cantidadSolicitada) {
    return { 
      valid: false, 
      message: `Stock insuficiente. Disponible: ${stockActual}, Solicitado: ${cantidadSolicitada}` 
    };
  }
  
  return { valid: true, message: '' };
}
