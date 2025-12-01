/**
 * Componentes Alpine.js para validación en tiempo real
 * Importar en las páginas que necesiten validación del lado cliente
 */

// ============================================
// INICIALIZACIÓN DE VALIDADORES ALPINE
// ============================================

export function initValidators() {
  document.addEventListener('alpine:init', () => {
    // @ts-ignore
    const Alpine = window.Alpine;

    // ========================================
    // Validador de RUT
    // ========================================
    Alpine.data('rutValidator', () => ({
      value: '',
      error: '',
      isValid: false,
      touched: false,

      formatRut(rut: string): string {
        let value = rut.replace(/\./g, '').replace(/-/g, '');
        value = value.replace(/[^0-9kK]/g, '');
        if (value.length === 0) return '';
        const dv = value.slice(-1).toUpperCase();
        let body = value.slice(0, -1);
        let formatted = '';
        while (body.length > 3) {
          formatted = '.' + body.slice(-3) + formatted;
          body = body.slice(0, -3);
        }
        formatted = body + formatted;
        return formatted + '-' + dv;
      },

      calculateDV(rutBody: string): string {
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
      },

      validate() {
        this.touched = true;
        const cleanRut = this.value.replace(/\./g, '').replace(/-/g, '').toUpperCase();
        
        if (!cleanRut || cleanRut.length < 8 || cleanRut.length > 9) {
          this.error = 'El RUT debe tener entre 8 y 9 caracteres';
          this.isValid = false;
          return false;
        }

        const body = cleanRut.slice(0, -1);
        const dv = cleanRut.slice(-1);

        if (!/^\d+$/.test(body)) {
          this.error = 'El RUT contiene caracteres inválidos';
          this.isValid = false;
          return false;
        }

        const calculatedDV = this.calculateDV(body);
        if (dv !== calculatedDV) {
          this.error = 'RUT inválido (dígito verificador incorrecto)';
          this.isValid = false;
          return false;
        }

        this.error = '';
        this.isValid = true;
        return true;
      },

      onInput(event: Event) {
        const input = event.target as HTMLInputElement;
        this.value = this.formatRut(input.value);
        input.value = this.value;
        if (this.touched) this.validate();
      },

      onBlur() {
        this.validate();
      }
    }));

    // ========================================
    // Validador de Email
    // ========================================
    Alpine.data('emailValidator', () => ({
      value: '',
      error: '',
      isValid: false,
      touched: false,

      validate() {
        this.touched = true;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        if (!this.value || !this.value.trim()) {
          this.error = 'El email es obligatorio';
          this.isValid = false;
          return false;
        }

        if (!emailRegex.test(this.value)) {
          this.error = 'El formato del email no es válido';
          this.isValid = false;
          return false;
        }

        this.error = '';
        this.isValid = true;
        return true;
      },

      onInput() {
        if (this.touched) this.validate();
      },

      onBlur() {
        this.validate();
      }
    }));

    // ========================================
    // Validador de Teléfono
    // ========================================
    Alpine.data('phoneValidator', () => ({
      value: '',
      error: '',
      isValid: false,
      touched: false,

      formatPhone(phone: string): string {
        let value = phone.replace(/[^\d+]/g, '');
        if (value.startsWith('+56') && value.length > 3) {
          const rest = value.slice(3);
          if (rest.length >= 9) {
            return `+56 9 ${rest.slice(1, 5)} ${rest.slice(5, 9)}`;
          }
        }
        return value;
      },

      validate() {
        this.touched = true;
        const cleanPhone = this.value.replace(/[^\d]/g, '');
        
        if (!cleanPhone) {
          this.error = 'El teléfono es obligatorio';
          this.isValid = false;
          return false;
        }

        if (cleanPhone.length === 9) {
          if (!cleanPhone.startsWith('9')) {
            this.error = 'Los celulares deben comenzar con 9';
            this.isValid = false;
            return false;
          }
          this.error = '';
          this.isValid = true;
          return true;
        }

        if (cleanPhone.length === 11 && cleanPhone.startsWith('56')) {
          if (!cleanPhone.startsWith('569')) {
            this.error = 'Formato de teléfono inválido';
            this.isValid = false;
            return false;
          }
          this.error = '';
          this.isValid = true;
          return true;
        }

        this.error = 'El teléfono debe tener 9 dígitos (ej: 912345678)';
        this.isValid = false;
        return false;
      },

      onInput(event: Event) {
        const input = event.target as HTMLInputElement;
        if (this.touched) this.validate();
      },

      onBlur() {
        this.validate();
      }
    }));

    // ========================================
    // Validador de Patente
    // ========================================
    Alpine.data('patenteValidator', () => ({
      value: '',
      error: '',
      isValid: false,
      touched: false,

      formatPatente(patente: string): string {
        return patente.toUpperCase().replace(/[^A-Z0-9]/g, '');
      },

      validate() {
        this.touched = true;
        const cleanPatente = this.formatPatente(this.value);

        if (!cleanPatente) {
          this.error = 'La patente es obligatoria';
          this.isValid = false;
          return false;
        }

        const formatoNuevo = /^[A-Z]{4}\d{2}$/;
        const formatoAntiguo = /^[A-Z]{2}\d{4}$/;
        const formatoIntermedio = /^[A-Z]{3}\d{3}$/;

        if (!formatoNuevo.test(cleanPatente) && !formatoAntiguo.test(cleanPatente) && !formatoIntermedio.test(cleanPatente)) {
          this.error = 'Formato inválido. Use: ABCD12, AB1234 o ABC123';
          this.isValid = false;
          return false;
        }

        this.error = '';
        this.isValid = true;
        return true;
      },

      onInput(event: Event) {
        const input = event.target as HTMLInputElement;
        this.value = this.formatPatente(input.value);
        input.value = this.value;
        if (this.touched) this.validate();
      },

      onBlur() {
        this.validate();
      }
    }));

    // ========================================
    // Validador de Año de Vehículo
    // ========================================
    Alpine.data('yearValidator', () => ({
      value: '',
      error: '',
      isValid: false,
      touched: false,

      validate() {
        this.touched = true;
        const currentYear = new Date().getFullYear();
        const yearNum = parseInt(this.value);

        if (isNaN(yearNum)) {
          this.error = 'El año debe ser un número';
          this.isValid = false;
          return false;
        }

        if (yearNum < 1900) {
          this.error = 'El año no puede ser anterior a 1900';
          this.isValid = false;
          return false;
        }

        if (yearNum > currentYear + 1) {
          this.error = `El año no puede ser mayor a ${currentYear + 1}`;
          this.isValid = false;
          return false;
        }

        this.error = '';
        this.isValid = true;
        return true;
      },

      onInput() {
        if (this.touched) this.validate();
      },

      onBlur() {
        this.validate();
      }
    }));

    // ========================================
    // Validador de Número Positivo
    // ========================================
    Alpine.data('positiveNumberValidator', (fieldName = 'El valor') => ({
      value: '',
      error: '',
      isValid: false,
      touched: false,
      fieldName,

      validate() {
        this.touched = true;
        const num = parseFloat(this.value);

        if (isNaN(num)) {
          this.error = `${this.fieldName} debe ser un número`;
          this.isValid = false;
          return false;
        }

        if (num < 0) {
          this.error = `${this.fieldName} no puede ser negativo`;
          this.isValid = false;
          return false;
        }

        this.error = '';
        this.isValid = true;
        return true;
      },

      onInput() {
        if (this.touched) this.validate();
      },

      onBlur() {
        this.validate();
      }
    }));

    // ========================================
    // Validador de Stock
    // ========================================
    Alpine.data('stockValidator', (stockActual = 0) => ({
      value: '',
      error: '',
      isValid: false,
      touched: false,
      stockActual,

      validate() {
        this.touched = true;
        const cantidad = parseInt(this.value);

        if (isNaN(cantidad) || cantidad <= 0) {
          this.error = 'La cantidad debe ser mayor a 0';
          this.isValid = false;
          return false;
        }

        if (cantidad > this.stockActual) {
          this.error = `Stock insuficiente. Disponible: ${this.stockActual}`;
          this.isValid = false;
          return false;
        }

        this.error = '';
        this.isValid = true;
        return true;
      },

      onInput() {
        if (this.touched) this.validate();
      },

      onBlur() {
        this.validate();
      }
    }));

    // ========================================
    // Validador de Campo Requerido
    // ========================================
    Alpine.data('requiredValidator', (fieldName = 'Este campo') => ({
      value: '',
      error: '',
      isValid: false,
      touched: false,
      fieldName,

      validate() {
        this.touched = true;

        if (!this.value || !this.value.toString().trim()) {
          this.error = `${this.fieldName} es obligatorio`;
          this.isValid = false;
          return false;
        }

        this.error = '';
        this.isValid = true;
        return true;
      },

      onInput() {
        if (this.touched) this.validate();
      },

      onBlur() {
        this.validate();
      }
    }));

    // ========================================
    // Formulario de Cliente Completo
    // ========================================
    Alpine.data('clienteFormValidator', (initialData = {}) => ({
      nombre: (initialData as any).nombre || '',
      apellido: (initialData as any).apellido || '',
      rut: (initialData as any).rut || '',
      email: (initialData as any).email || '',
      telefono: (initialData as any).telefono || '',
      errors: {} as Record<string, string>,
      touched: {} as Record<string, boolean>,
      isSubmitting: false,

      // Formateo de RUT
      formatRut(rut: string): string {
        let value = rut.replace(/\./g, '').replace(/-/g, '');
        value = value.replace(/[^0-9kK]/g, '');
        if (value.length === 0) return '';
        const dv = value.slice(-1).toUpperCase();
        let body = value.slice(0, -1);
        let formatted = '';
        while (body.length > 3) {
          formatted = '.' + body.slice(-3) + formatted;
          body = body.slice(0, -3);
        }
        formatted = body + formatted;
        return formatted + '-' + dv;
      },

      calculateDV(rutBody: string): string {
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
      },

      onRutInput(event: Event) {
        const input = event.target as HTMLInputElement;
        this.rut = this.formatRut(input.value);
        input.value = this.rut;
        if (this.touched.rut) this.validateField('rut');
      },

      validateField(field: string) {
        this.touched[field] = true;
        delete this.errors[field];

        switch (field) {
          case 'nombre':
            if (!this.nombre.trim()) {
              this.errors.nombre = 'El nombre es obligatorio';
            } else if (this.nombre.length < 2) {
              this.errors.nombre = 'El nombre debe tener al menos 2 caracteres';
            }
            break;

          case 'apellido':
            if (!this.apellido.trim()) {
              this.errors.apellido = 'El apellido es obligatorio';
            } else if (this.apellido.length < 2) {
              this.errors.apellido = 'El apellido debe tener al menos 2 caracteres';
            }
            break;

          case 'rut':
            const cleanRut = this.rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();
            if (!cleanRut || cleanRut.length < 8 || cleanRut.length > 9) {
              this.errors.rut = 'El RUT debe tener entre 8 y 9 caracteres';
            } else {
              const body = cleanRut.slice(0, -1);
              const dv = cleanRut.slice(-1);
              if (!/^\d+$/.test(body)) {
                this.errors.rut = 'El RUT contiene caracteres inválidos';
              } else if (dv !== this.calculateDV(body)) {
                this.errors.rut = 'RUT inválido (dígito verificador incorrecto)';
              }
            }
            break;

          case 'email':
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!this.email.trim()) {
              this.errors.email = 'El email es obligatorio';
            } else if (!emailRegex.test(this.email)) {
              this.errors.email = 'El formato del email no es válido';
            }
            break;

          case 'telefono':
            const cleanPhone = this.telefono.replace(/[^\d]/g, '');
            if (!cleanPhone) {
              this.errors.telefono = 'El teléfono es obligatorio';
            } else if (cleanPhone.length !== 9 && cleanPhone.length !== 11) {
              this.errors.telefono = 'El teléfono debe tener 9 dígitos';
            } else if (cleanPhone.length === 9 && !cleanPhone.startsWith('9')) {
              this.errors.telefono = 'Los celulares deben comenzar con 9';
            }
            break;
        }

        return !this.errors[field];
      },

      validateAll() {
        ['nombre', 'apellido', 'rut', 'email', 'telefono'].forEach(field => {
          this.validateField(field);
        });
        return Object.keys(this.errors).length === 0;
      },

      get isValid() {
        return Object.keys(this.errors).length === 0 && 
               this.nombre && this.apellido && this.rut && this.email && this.telefono;
      },

      async submitForm(event: Event) {
        event.preventDefault();
        
        if (!this.validateAll()) {
          return false;
        }

        this.isSubmitting = true;
        // Permitir submit nativo
        (event.target as HTMLFormElement).submit();
      }
    }));

    // ========================================
    // Formulario de Vehículo Completo
    // ========================================
    Alpine.data('vehiculoFormValidator', (initialData = {}) => ({
      cliente: (initialData as any).cliente || '',
      patente: (initialData as any).patente || '',
      marca: (initialData as any).marca || '',
      modelo: (initialData as any).modelo || '',
      anio: (initialData as any).anio || '',
      vin: (initialData as any).vin || '',
      errors: {} as Record<string, string>,
      touched: {} as Record<string, boolean>,
      isSubmitting: false,

      formatPatente(patente: string): string {
        return patente.toUpperCase().replace(/[^A-Z0-9]/g, '');
      },

      onPatenteInput(event: Event) {
        const input = event.target as HTMLInputElement;
        this.patente = this.formatPatente(input.value);
        input.value = this.patente;
        if (this.touched.patente) this.validateField('patente');
      },

      validateField(field: string) {
        this.touched[field] = true;
        delete this.errors[field];

        switch (field) {
          case 'cliente':
            if (!this.cliente) {
              this.errors.cliente = 'Debe seleccionar un cliente';
            }
            break;

          case 'patente':
            const cleanPatente = this.formatPatente(this.patente);
            if (!cleanPatente) {
              this.errors.patente = 'La patente es obligatoria';
            } else {
              const formatoNuevo = /^[A-Z]{4}\d{2}$/;
              const formatoAntiguo = /^[A-Z]{2}\d{4}$/;
              const formatoIntermedio = /^[A-Z]{3}\d{3}$/;
              if (!formatoNuevo.test(cleanPatente) && !formatoAntiguo.test(cleanPatente) && !formatoIntermedio.test(cleanPatente)) {
                this.errors.patente = 'Formato inválido. Use: ABCD12, AB1234 o ABC123';
              }
            }
            break;

          case 'marca':
            if (!this.marca.trim()) {
              this.errors.marca = 'La marca es obligatoria';
            }
            break;

          case 'modelo':
            if (!this.modelo.trim()) {
              this.errors.modelo = 'El modelo es obligatorio';
            }
            break;

          case 'anio':
            const currentYear = new Date().getFullYear();
            const yearNum = parseInt(this.anio);
            if (isNaN(yearNum)) {
              this.errors.anio = 'El año debe ser un número';
            } else if (yearNum < 1900) {
              this.errors.anio = 'El año no puede ser anterior a 1900';
            } else if (yearNum > currentYear + 1) {
              this.errors.anio = `El año no puede ser mayor a ${currentYear + 1}`;
            }
            break;
        }

        return !this.errors[field];
      },

      validateAll() {
        ['cliente', 'patente', 'marca', 'modelo', 'anio'].forEach(field => {
          this.validateField(field);
        });
        return Object.keys(this.errors).length === 0;
      },

      get isValid() {
        return Object.keys(this.errors).length === 0 && 
               this.cliente && this.patente && this.marca && this.modelo && this.anio;
      },

      async submitForm(event: Event) {
        event.preventDefault();
        
        if (!this.validateAll()) {
          return false;
        }

        this.isSubmitting = true;
        (event.target as HTMLFormElement).submit();
      }
    }));

    // ========================================
    // Formulario de Repuesto/Inventario
    // ========================================
    Alpine.data('repuestoFormValidator', (initialData = {}) => ({
      nombre: (initialData as any).nombre || '',
      sku: (initialData as any).sku || '',
      stock: (initialData as any).stock || '',
      stockMinimo: (initialData as any).stock_minimo || '5',
      precio: (initialData as any).precio || '',
      descripcion: (initialData as any).descripcion || '',
      errors: {} as Record<string, string>,
      touched: {} as Record<string, boolean>,
      isSubmitting: false,

      formatSku(sku: string): string {
        return sku.toUpperCase().replace(/[^A-Z0-9\-]/g, '');
      },

      onSkuInput(event: Event) {
        const input = event.target as HTMLInputElement;
        this.sku = this.formatSku(input.value);
        input.value = this.sku;
        if (this.touched.sku) this.validateField('sku');
      },

      validateField(field: string) {
        this.touched[field] = true;
        delete this.errors[field];

        switch (field) {
          case 'nombre':
            if (!this.nombre.trim()) {
              this.errors.nombre = 'El nombre es obligatorio';
            } else if (this.nombre.length < 3) {
              this.errors.nombre = 'El nombre debe tener al menos 3 caracteres';
            }
            break;

          case 'sku':
            const cleanSku = this.formatSku(this.sku);
            if (!cleanSku) {
              this.errors.sku = 'El SKU es obligatorio';
            } else if (cleanSku.length < 3 || cleanSku.length > 20) {
              this.errors.sku = 'El SKU debe tener entre 3 y 20 caracteres';
            }
            break;

          case 'stock':
            const stockNum = parseInt(this.stock);
            if (isNaN(stockNum)) {
              this.errors.stock = 'El stock debe ser un número';
            } else if (stockNum < 0) {
              this.errors.stock = 'El stock no puede ser negativo';
            }
            break;

          case 'stockMinimo':
            const minNum = parseInt(this.stockMinimo);
            if (isNaN(minNum)) {
              this.errors.stockMinimo = 'El stock mínimo debe ser un número';
            } else if (minNum < 0) {
              this.errors.stockMinimo = 'El stock mínimo no puede ser negativo';
            }
            break;

          case 'precio':
            const precioNum = parseFloat(this.precio);
            if (isNaN(precioNum)) {
              this.errors.precio = 'El precio debe ser un número';
            } else if (precioNum < 0) {
              this.errors.precio = 'El precio no puede ser negativo';
            }
            break;
        }

        return !this.errors[field];
      },

      validateAll() {
        ['nombre', 'sku', 'stock', 'precio'].forEach(field => {
          this.validateField(field);
        });
        return Object.keys(this.errors).length === 0;
      },

      get isValid() {
        return Object.keys(this.errors).length === 0 && 
               this.nombre && this.sku && this.stock !== '' && this.precio !== '';
      },

      async submitForm(event: Event) {
        event.preventDefault();
        
        if (!this.validateAll()) {
          return false;
        }

        this.isSubmitting = true;
        (event.target as HTMLFormElement).submit();
      }
    }));

  });
}

// Auto-inicializar si está en el navegador
if (typeof window !== 'undefined') {
  initValidators();
}
