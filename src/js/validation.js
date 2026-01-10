class PhoneMask {
    constructor(input) {
        this.input = input;
        this.lastValue = '';
        this.init();
    }
    
    init() {

        if (!this.input.value.trim()) {
            this.input.value = '+7 (';
        }
    
        this.input.addEventListener('input', (e) => this.handleInput(e));
        this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.input.addEventListener('focus', () => this.handleFocus());
        this.input.addEventListener('blur', () => this.handleBlur());
        this.input.addEventListener('paste', (e) => this.handlePaste(e));

        this.input.addEventListener('keypress', (e) => this.restrictInput(e));
        
        this.handleInput();
    }
    
    restrictInput(e) {
        const key = e.key;
        const allowedKeys = [
            'Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight',
            'ArrowUp', 'ArrowDown', 'Home', 'End'
        ];

        if (!/\d/.test(key) && !allowedKeys.includes(key) && 
            !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            return false;
        }
        
        return true;
    }
    
    handleInput(e) {
        let value = this.input.value;

        const cursorPos = this.input.selectionStart;

        let digits = value.replace(/[^\d+]/g, '');

        if (digits.startsWith('8')) {
            digits = '7' + digits.substring(1);
        }

        else if (!digits.startsWith('+7') && !digits.startsWith('7')) {
            digits = '7' + digits;
        }

        else if (digits.startsWith('7') && !digits.startsWith('+7')) {
            digits = '+7' + digits.substring(1);
        }
        
        digits = digits.substring(0, 12); 
        
        this.input.value = this.formatPhone(digits);

        this.adjustCursorPosition(cursorPos, value, this.input.value);

        this.input.dispatchEvent(new Event('change'));
    }
    
    formatPhone(digits) {
        if (!digits || digits === '+') return '+7 (';
        
        let formatted = '';
        let digitIndex = 0;
        
        for (let char of digits) {
            if (char === '+') {
                formatted += '+';
            } else if (/\d/.test(char)) {
                digitIndex++;
                if (digitIndex === 1) {
                    formatted += char + ' (';
                } else if (digitIndex === 4) {
                    formatted += char + ') ';
                } else if (digitIndex === 7) {
                    formatted += char + '-';
                } else if (digitIndex === 9) {
                    formatted += char + '-';
                } else {
                    formatted += char;
                }
            }
        }
        
        const template = '+7 (___) ___-__-__';
        if (formatted.length < template.length) {
            formatted += template.substring(formatted.length).replace(/_/g, '_');
        }
        
        return formatted;
    }
    
    adjustCursorPosition(oldPos, oldValue, newValue) {
        setTimeout(() => {
            let newPos = oldPos;

            if (oldValue.length > newValue.length) {
                while (newPos > 0 && !/\d/.test(newValue.charAt(newPos - 1))) {
                    newPos--;
                }
            } 

            else if (oldValue.length < newValue.length) {
                while (newPos < newValue.length && !/[\d_]/.test(newValue.charAt(newPos))) {
                    newPos++;
                }
            }

            this.input.setSelectionRange(newPos, newPos);
        }, 0);
    }
    
    handleKeydown(e) {
        const cursorPos = this.input.selectionStart;
        const value = this.input.value;
    
        if ((e.key === 'Backspace' || e.key === 'Delete') && 
            cursorPos <= 4 && !/\d/.test(value.charAt(cursorPos))) {
            e.preventDefault();
            return;
        }
        
        if (e.key === 'Backspace') {
            if (cursorPos > 0 && /[)\s\-]/.test(value.charAt(cursorPos - 1))) {
                e.preventDefault();
                let newPos = cursorPos - 1;
                while (newPos > 0 && !/\d/.test(value.charAt(newPos - 1))) {
                    newPos--;
                }
                this.input.setSelectionRange(newPos, newPos);
            }
        }
    }
    
    handleFocus() {
        if (!this.input.value || this.input.value === '+7 (') {
            this.input.value = '+7 (';
        }

        setTimeout(() => {
            let cursorPos = 4; // После "+7 ("
            while (cursorPos < this.input.value.length && 
                   !/[_]/.test(this.input.value.charAt(cursorPos))) {
                cursorPos++;
            }
            this.input.setSelectionRange(cursorPos, cursorPos);
        }, 0);

        this.input.classList.add('phone-focused');
    }
    
    handleBlur() {
        this.input.classList.remove('phone-focused');
        
        const value = this.input.value;
        const digits = this.getCleanPhone();

        if (digits.length < 11 && digits.length > 1) {
            this.showIncompleteWarning();
        }

        if (value === '+7 (' || digits.length <= 1) {
            this.input.value = '';
        }
    }
    
    showIncompleteWarning() {
        this.input.classList.add('phone-incomplete');
        setTimeout(() => {
            this.input.classList.remove('phone-incomplete');
        }, 2000);
    }
    
    handlePaste(e) {
        e.preventDefault();

        const pastedText = (e.clipboardData || window.clipboardData).getData('text');

        let digits = pastedText.replace(/\D/g, '');
        
        if (digits.startsWith('8')) {
            digits = '7' + digits.substring(1);
        } else if (!digits.startsWith('7')) {
            digits = '7' + digits;
        }

        digits = digits.substring(0, 11);
        
        this.input.value = this.formatPhone('+' + digits);
        
        setTimeout(() => {
            this.input.setSelectionRange(this.input.value.length, this.input.value.length);
        }, 0);
    }
    
    getCleanPhone() {
        return this.input.value.replace(/\D/g, '');
    }
    
    isValid() {
        const cleanPhone = this.getCleanPhone();
        return cleanPhone.length === 11 && cleanPhone.startsWith('7');
    }
    
    getFormattedPhone() {
        return this.input.value;
    }
    
    destroy() {
        this.input.removeEventListener('input', this.handleInput);
        this.input.removeEventListener('keydown', this.handleKeydown);
        this.input.removeEventListener('focus', this.handleFocus);
        this.input.removeEventListener('blur', this.handleBlur);
        this.input.removeEventListener('paste', this.handlePaste);
        this.input.removeEventListener('keypress', this.restrictInput);
    }
}

export class FormValidator {
    constructor(formId, options = {}) {
        this.form = document.getElementById(formId);
        if (!this.form) {
            console.warn(`Форма с ID "${formId}" не найдена`);
            return;
        }
        
        this.options = {
            showSuccessMessage: true,
            showErrorMessage: true,
            validateOnInput: true,
            validateOnBlur: true,
            usePhoneMask: true,
            animationDuration: 300,
            ...options
        };
        
        this.phoneMask = null;
        this.isSubmitting = false;
        this.debounceTimer = null;
        
        this.init();
    }
    
    init() {
        this.inputs = this.form.querySelectorAll('[required], [pattern], [min], [max], [minlength], [maxlength]');
        this.textareas = this.form.querySelectorAll('textarea[maxlength]');
        this.submitBtn = this.form.querySelector('button[type="submit"]');
        this.successMessage = this.form.querySelector('.reservation-form__message--success');
        this.errorMessage = this.form.querySelector('.reservation-form__message--error');

        if (this.options.usePhoneMask) {
            this.initPhoneMask();
        }
        
        this.setupEventListeners();
        this.setupCharacterCounter();
        this.setupRealTimeValidation();

        setTimeout(() => this.updateSubmitButton(), 100);
    }
    
    initPhoneMask() {
        const phoneInput = this.form.querySelector('#phone');
        if (phoneInput) {
            this.phoneMask = new PhoneMask(phoneInput);

            phoneInput.addEventListener('input', () => {
                this.updatePhoneInputState(phoneInput);
            });
        }
    }
    
    updatePhoneInputState(phoneInput) {
        const cleanPhone = this.phoneMask.getCleanPhone();
        
        phoneInput.classList.remove('phone-valid', 'phone-invalid', 'phone-complete');
        
        if (cleanPhone.length === 11 && this.phoneMask.isValid()) {
            phoneInput.classList.add('phone-valid', 'phone-complete');
        } else if (cleanPhone.length > 1 && cleanPhone.length < 11) {
            phoneInput.classList.add('phone-invalid');
        }
    }
    
    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        this.inputs.forEach(input => {
            input.addEventListener('input', () => {
                clearTimeout(this.debounceTimer);
                this.debounceTimer = setTimeout(() => {
                    if (input.id === 'phone' && this.phoneMask) {
                        this.validatePhoneField(input);
                    } else {
                        this.validateField(input);
                    }
                    this.updateSubmitButton();
                }, 300);
            });

            if (this.options.validateOnBlur) {
                input.addEventListener('blur', () => {
                    if (input.id === 'phone' && this.phoneMask) {
                        this.validatePhoneField(input);
                    } else {
                        this.validateField(input);
                    }
                    this.updateSubmitButton();
                });
            }

            input.addEventListener('focus', () => {
                this.clearFieldError(input);
                input.classList.remove('input-error-animation');
            });

            input.addEventListener('change', () => {
                if (input.id === 'phone' && this.phoneMask) {
                    this.validatePhoneField(input);
                } else {
                    this.validateField(input);
                }
                this.updateSubmitButton();
            });
        });
    }
    
    setupCharacterCounter() {
        this.textareas.forEach(textarea => {
            const counter = textarea.parentElement.querySelector('.reservation-form__counter');
            if (!counter) return;
            
            const charCount = counter.querySelector('#charCount') || counter;
            
            textarea.addEventListener('input', (e) => {
                const length = e.target.value.length;
                const maxLength = parseInt(textarea.getAttribute('maxlength')) || 500;
                
                if (charCount.id !== 'charCount') {
                    charCount.innerHTML = `<span id="charCount">${length}</span>/${maxLength}`;
                } else {
                    charCount.textContent = length;
                }

                this.updateCounterStyle(length, maxLength, charCount.parentElement);
            });
            
            const initialLength = textarea.value.length;
            const maxLength = parseInt(textarea.getAttribute('maxlength')) || 500;
            if (charCount.id !== 'charCount') {
                charCount.innerHTML = `<span id="charCount">${initialLength}</span>/${maxLength}`;
            }
            this.updateCounterStyle(initialLength, maxLength, charCount.parentElement);
        });
    }
    
    updateCounterStyle(length, maxLength, counterElement) {
        const percentage = (length / maxLength) * 100;
        
        if (percentage >= 90) {
            counterElement.style.color = '#ff4444';
            counterElement.style.fontWeight = 'bold';
        } else if (percentage >= 75) {
            counterElement.style.color = '#ff9800';
            counterElement.style.fontWeight = '600';
        } else {
            counterElement.style.color = '#666';
            counterElement.style.fontWeight = 'normal';
        }
    }
    
    setupRealTimeValidation() {
        this.form.addEventListener('input', () => {
            this.updateSubmitButton();
        });
    }
    
    validatePhoneField(field) {
        const errorContainer = this.form.querySelector(`[data-error="${field.id}"]`);
        
        if (!this.phoneMask) {
            return this.validateField(field);
        }
        
        const cleanPhone = this.phoneMask.getCleanPhone();

        if (!cleanPhone || cleanPhone.length <= 1) {
            this.showError(field, errorContainer, 'Введите номер телефона');
            return false;
        }

        if (cleanPhone.length < 11) {
            this.showError(field, errorContainer, 'Введите полный номер телефона');
            return false;
        }
        
        if (!this.phoneMask.isValid()) {
            this.showError(field, errorContainer, 'Неверный формат номера телефона');
            return false;
        }
        
        if (!this.validatePhoneNumber(cleanPhone)) {
            this.showError(field, errorContainer, 'Введите корректный номер телефона');
            return false;
        }
        
        this.clearError(field, errorContainer);
        this.showSuccess(field);
        return true;
    }
    
    validatePhoneNumber(phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        
        if (cleanPhone.length !== 11) return false;
        
        if (!cleanPhone.startsWith('7')) return false;

        const operatorFirstDigit = cleanPhone.charAt(1);
        const validFirstDigits = ['9', '8', '7', '6', '5', '4', '3'];
        
        if (!validFirstDigits.includes(operatorFirstDigit)) {
            return false;
        }
        
        return true;
    }
    
    validateField(field) {
        const errorContainer = this.form.querySelector(`[data-error="${field.id}"]`);

        if (field.hasAttribute('required') && !field.value.trim()) {
            this.showError(field, errorContainer, 'Это поле обязательно для заполнения');
            return false;
        }

        if (field.hasAttribute('minlength')) {
            const minLength = parseInt(field.getAttribute('minlength'));
            if (field.value.length < minLength && field.value.length > 0) {
                this.showError(field, errorContainer, `Минимальная длина: ${minLength} символов`);
                return false;
            }
        }

        if (field.hasAttribute('maxlength')) {
            const maxLength = parseInt(field.getAttribute('maxlength'));
            if (field.value.length > maxLength) {
                this.showError(field, errorContainer, `Максимальная длина: ${maxLength} символов`);
                return false;
            }
        }
        
        if (field.hasAttribute('pattern')) {
            const pattern = new RegExp(field.getAttribute('pattern'));
            if (!pattern.test(field.value) && field.value.trim()) {
                let message = 'Неверный формат';
                
                if (field.id === 'name') {
                    message = 'Имя может содержать только буквы, пробелы и дефисы';
                } else if (field.id === 'email') {
                    message = 'Введите корректный email адрес';
                }
                
                this.showError(field, errorContainer, message);
                return false;
            }
        }
        
        if (field.type === 'date' && field.hasAttribute('min')) {
            const selectedDate = new Date(field.value);
            const minDate = new Date(field.getAttribute('min'));
            
            if (selectedDate < minDate && field.value) {
                this.showError(field, errorContainer, 'Выберите дату не ранее завтрашнего дня');
                return false;
            }
        }
        
        if (field.id === 'name' && field.value.trim()) {
            if (!this.validateName(field.value)) {
                this.showError(field, errorContainer, 'Имя должно содержать только буквы и быть не короче 2 символов');
                return false;
            }
        }

        if (field.id === 'date' && field.value) {
            if (!this.validateDate(field.value)) {
                this.showError(field, errorContainer, 'Выберите корректную дату (не ранее завтра и не позднее года вперед)');
                return false;
            }
        }

        if (field.tagName === 'SELECT' && field.hasAttribute('required')) {
            if (!field.value) {
                this.showError(field, errorContainer, 'Пожалуйста, выберите значение');
                return false;
            }
        }
        
        this.clearError(field, errorContainer);
        this.showSuccess(field);
        return true;
    }
    
    validateName(name) {
        const trimmedName = name.trim();
        if (trimmedName.length < 2) return false;
        
        const nameRegex = /^[A-Za-zА-Яа-яЁё\s\-']+$/;
        return nameRegex.test(trimmedName);
    }
    
    validateDate(dateString) {
        const selectedDate = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const maxDate = new Date(today);
        maxDate.setFullYear(maxDate.getFullYear() + 1);
        
        return selectedDate >= tomorrow && selectedDate <= maxDate;
    }
    
    showError(field, container, message) {
        field.classList.add('reservation-form__input--error');
        field.classList.remove('reservation-form__input--success');
        
        field.classList.add('input-error-animation');
        setTimeout(() => {
            field.classList.remove('input-error-animation');
        }, 600);
        
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <span>${message}</span>
                </div>
            `;
            container.style.display = 'block';
            container.classList.add('error-visible');
        }

        field.setAttribute('aria-invalid', 'true');
        if (container) {
            field.setAttribute('aria-describedby', `${field.id}-error`);
            container.id = `${field.id}-error`;
        }
    }
    
    showSuccess(field) {
        field.classList.remove('reservation-form__input--error');
        field.classList.add('reservation-form__input--success');
        field.setAttribute('aria-invalid', 'false');
    }
    
    clearError(field, container) {
        field.classList.remove('reservation-form__input--error');
        
        if (container) {
            container.style.display = 'none';
            container.innerHTML = '';
            container.classList.remove('error-visible');
            container.removeAttribute('id');
        }
        
        field.removeAttribute('aria-describedby');
    }
    
    clearFieldError(field) {
        const container = this.form.querySelector(`[data-error="${field.id}"]`);
        this.clearError(field, container);
    }
    
    updateSubmitButton() {
        if (!this.submitBtn) return;
        
        const isValid = this.isFormValid();
        this.submitBtn.disabled = !isValid || this.isSubmitting;
        this.submitBtn.classList.toggle('button--disabled', !isValid);
        
        // Обновляем состояние кнопки
        if (this.isSubmitting) {
            this.setLoading(true);
        }
    }
    
    isFormValid() {
        let isValid = true;
        
        this.inputs.forEach(input => {
            if (input.id === 'phone' && this.phoneMask) {
                if (!this.validatePhoneField(input)) {
                    isValid = false;
                }
            } else {
                if (!this.validateField(input)) {
                    isValid = false;
                }
            }
        });
        
        return isValid;
    }
    
    highlightAllErrors() {
        this.inputs.forEach(input => {
            if (input.id === 'phone' && this.phoneMask) {
                this.validatePhoneField(input);
            } else {
                this.validateField(input);
            }
        });
    }
    
    showSuccessMessage(text = null) {
        if (!this.options.showSuccessMessage || !this.successMessage) return;
        
        if (text) {
            const messageText = this.successMessage.querySelector('span');
            if (messageText) {
                messageText.textContent = text;
            }
        }
        
        this.successMessage.style.display = 'flex';
        this.successMessage.classList.add('message-visible');

        setTimeout(() => {
            this.hideSuccessMessage();
        }, 5000);
    }
    
    hideSuccessMessage() {
        if (this.successMessage) {
            this.successMessage.classList.remove('message-visible');
            setTimeout(() => {
                this.successMessage.style.display = 'none';
            }, this.options.animationDuration);
        }
    }
    
    showErrorMessage(text = null) {
        if (!this.options.showErrorMessage || !this.errorMessage) return;
        
        if (text) {
            const messageText = this.errorMessage.querySelector('span');
            if (messageText) {
                messageText.textContent = text;
            }
        }
        
        this.errorMessage.style.display = 'flex';
        this.errorMessage.classList.add('message-visible');
    }
    
    hideErrorMessage() {
        if (this.errorMessage) {
            this.errorMessage.classList.remove('message-visible');
            setTimeout(() => {
                this.errorMessage.style.display = 'none';
            }, this.options.animationDuration);
        }
    }
    
    hideAllMessages() {
        this.hideSuccessMessage();
        this.hideErrorMessage();
    }
    
    setLoading(isLoading) {
        this.isSubmitting = isLoading;
        
        if (!this.submitBtn) return;
        
        const submitText = this.submitBtn.querySelector('.reservation-form__submit-text');
        const loader = this.submitBtn.querySelector('.reservation-form__loader');
        
        if (isLoading) {
            this.submitBtn.disabled = true;
            if (submitText) submitText.style.opacity = '0.5';
            if (loader) loader.style.display = 'flex';
            this.submitBtn.classList.add('button--loading');
        } else {
            this.submitBtn.disabled = !this.isFormValid();
            if (submitText) submitText.style.opacity = '1';
            if (loader) loader.style.display = 'none';
            this.submitBtn.classList.remove('button--loading');
        }
    }
    
    resetForm() {
        this.form.reset();
        if (this.phoneMask) {
            const phoneInput = this.form.querySelector('#phone');
            if (phoneInput) {
                phoneInput.value = '+7 (';
            }
        }
        this.textareas.forEach(textarea => {
            const counter = textarea.parentElement.querySelector('.reservation-form__counter');
            if (counter) {
                const charCount = counter.querySelector('#charCount') || counter;
                if (charCount.id === 'charCount') {
                    charCount.textContent = '0';
                } else {
                    charCount.innerHTML = '<span id="charCount">0</span>/500';
                }
                this.updateCounterStyle(0, 500, charCount.parentElement);
            }
        });

        this.inputs.forEach(input => {
            this.clearFieldError(input);
            input.classList.remove('reservation-form__input--success');
        });
        
        this.hideAllMessages();
        this.updateSubmitButton();
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        if (!this.isFormValid()) {
            this.highlightAllErrors();
            const firstError = this.form.querySelector('.reservation-form__input--error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            
            return;
        }
        this.setLoading(true);
        this.hideAllMessages();
        
        try {
            const formData = new FormData(this.form);
            formData.append('_timestamp', new Date().toISOString());
            formData.append('_page_url', window.location.href);
            formData.append('_user_agent', navigator.userAgent);
            const response = await fetch(this.form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                const successText = 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.';
                this.showSuccessMessage(successText);
                setTimeout(() => {
                    this.resetForm();
                    const modal = this.form.closest('.modal--reservation');
                    if (modal) {
                        setTimeout(() => {
                            if (modal.classList.contains('modal--active')) {
                                modal.classList.remove('modal--active');
                                document.body.classList.remove('no-scroll');
                            }
                        }, 3000);
                    }
                }, 1000);
                
                window.dispatchEvent(new CustomEvent('formSubmitted', {
                    detail: { formId: this.form.id, status: 'success' }
                }));
                
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            const errorText = 'Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз или свяжитесь с нами по телефону.';
            this.showErrorMessage(errorText);
            
            window.dispatchEvent(new CustomEvent('formSubmitted', {
                detail: { formId: this.form.id, status: 'error', error: error.message }
            }));
            
        } finally {
            this.setLoading(false);
        }
    }
    
    destroy() {
        this.form.removeEventListener('submit', this.handleSubmit);
        
        this.inputs.forEach(input => {
            const events = ['input', 'blur', 'focus', 'change'];
            events.forEach(event => {
                input.removeEventListener(event, () => {});
            });
        });
        
        if (this.phoneMask) {
            this.phoneMask.destroy();
        }
        
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
    }
}

export function initPhoneMasks() {
    const phoneInputs = document.querySelectorAll('input[data-phone-mask], input[type="tel"]');
    const masks = [];
    
    phoneInputs.forEach(input => {
        if (!input.hasAttribute('data-phone-initialized')) {
            const mask = new PhoneMask(input);
            input.setAttribute('data-phone-initialized', 'true');
            masks.push(mask);
        }
    });
    
    return masks;
}

export function initReservationForm() {
    const reservationForm = document.getElementById('reservationForm');
    if (!reservationForm) {
        console.warn('Форма бронирования не найдена');
        return null;
    }
    
    initPhoneMasks();
    const validator = new FormValidator('reservationForm', {
        showSuccessMessage: true,
        showErrorMessage: true,
        validateOnInput: true,
        validateOnBlur: true,
        usePhoneMask: true,
        animationDuration: 300
    });
    
    if (typeof window !== 'undefined') {
        window.reservationFormValidator = validator;
    }
    
    return validator;
}

export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function validateRequired(value) {
    return value !== null && value !== undefined && value.toString().trim() !== '';
}

export function validateMinLength(value, minLength) {
    return value.toString().length >= minLength;
}

export function validateMaxLength(value, maxLength) {
    return value.toString().length <= maxLength;
}

export function validateRange(value, min, max) {
    const num = parseFloat(value);
    return !isNaN(num) && num >= min && num <= max;
}

export default {
    FormValidator,
    PhoneMask,
    initPhoneMasks,
    initReservationForm,
    validateEmail,
    validateRequired,
    validateMinLength,
    validateMaxLength,
    validateRange
};