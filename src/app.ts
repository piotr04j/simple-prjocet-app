interface Validatable {
    value: string | number
    required?: boolean
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
}

const validate = (inputToValidation: Validatable) => {
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
    console.log(inputToValidation.value + ':' + isValid)
    return isValid
}

const autobinding = (_: any, _2: string, descriptor: PropertyDescriptor) => {
    const originalMethod =  descriptor.value
    const adjustedDescriptor: PropertyDescriptor = {
        configurable: true,
        get(): any {
            const boundFn = originalMethod.bind(this)
            return boundFn
        }
    }

    return adjustedDescriptor
}

class ProjectList {
    templateEl: HTMLTemplateElement
    hostEl: HTMLDivElement
    importNode: DocumentFragment
    element: HTMLElement

    constructor(private projectStatus: 'active' | 'finished') {
        this.templateEl = <HTMLTemplateElement>document.getElementById('project-list')!
        this.hostEl = <HTMLDivElement>document.getElementById('app')!
        this.importNode = document.importNode(this.templateEl.content, true)
        this.element = <HTMLElement>this.importNode.firstElementChild
        this.element.id = `${this.projectStatus}-projects`
    }

    private attach() {
        this.hostEl.insertAdjacentElement('beforeend', this.element)
    }

    private renderContent() {
        const listId = `${this.projectStatus}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.projectStatus.toUpperCase() + ' PROJECTS';
    }

    public init() {
        this.attach()
        this.renderContent()
    }
}

class ProjectInput {
    templateEl: HTMLTemplateElement
    hostEl: HTMLDivElement
    importNode: DocumentFragment
    element: HTMLFontElement
    titleInputEl: HTMLInputElement
    descriptionInputEl: HTMLInputElement
    peopleInputEl: HTMLInputElement

    constructor() {
        this.templateEl = <HTMLTemplateElement>document.getElementById('project-input')!
        this.hostEl = <HTMLDivElement>document.getElementById('app')!
        this.importNode = document.importNode(this.templateEl.content, true)
        this.element = <HTMLFontElement>this.importNode.firstElementChild
        this.titleInputEl = <HTMLInputElement>this.element.querySelector('#title')
        this.descriptionInputEl = <HTMLInputElement>this.element.querySelector('#description')
        this.peopleInputEl = <HTMLInputElement>this.element.querySelector('#people')
    }

    private gatherUserData(): [string, string, number] | void{
        const enteredTitle = this.titleInputEl.value
        const enteredDescription = this.descriptionInputEl.value
        const enteredPeople = this.peopleInputEl.value

        const titleValidatable: Validatable = {
            value: enteredTitle,
            required: true
        }
        const descriptionValidatable: Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5
        }
        const peopleValidatable: Validatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 4
        }
        if (
            validate(titleValidatable) &&
            validate(descriptionValidatable) &&
            validate(peopleValidatable)
        ) {
            return [enteredTitle, enteredDescription, parseInt(enteredPeople)]
        } else {
            alert('Invalid input, please try again!')
        }

    }

    @autobinding
    private submitHandler(event: Event) {
        event.preventDefault()
        const userInputs = this.gatherUserData()
        console.log(userInputs)
        this.clearInputs()
    }

    private clearInputs() {
        this.titleInputEl.value = ''
        this.descriptionInputEl.value = ''
        this.peopleInputEl.value = ''
    }

    private configure() {
        this.element.addEventListener('submit', this.submitHandler)
    }

    private attach() {
        this.hostEl.insertAdjacentElement('afterbegin', this.element)
    }

    public init() {
        this.configure()
        this.attach()
    }
}

const projectInput = new ProjectInput()
projectInput.init()

const activeProjectList = new ProjectList('active')
activeProjectList.init()

const finishedProjectList = new ProjectList('finished')
finishedProjectList.init()

