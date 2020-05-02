namespace App {
    export interface Validatable {
        value: string | number
        required?: boolean
        minLength?: number
        maxLength?: number
        min?: number
        max?: number
    }

    export const validate = (inputToValidation: Validatable) => {
        let isValid = true
        if (inputToValidation.required) {
            isValid = isValid && inputToValidation.value.toString().trim().length !== 0
        }

        if (inputToValidation.minLength) {
            if (typeof inputToValidation.value === 'string') {
                isValid = isValid && inputToValidation.value.length > inputToValidation.minLength
            }
        }

        if (inputToValidation.maxLength) {
            if (typeof inputToValidation.value === 'string') {
                isValid = isValid && inputToValidation.value.length < inputToValidation.maxLength
            }
        }

        if (inputToValidation.min) {
            if (typeof inputToValidation.value === 'number') {
                isValid = isValid && inputToValidation.value > inputToValidation.min
            }
        }

        if (inputToValidation.max) {
            if (typeof inputToValidation.value === 'number') {
                isValid = isValid && inputToValidation.value < inputToValidation.max
            }
        }

        return isValid
    }
}
