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

    private gatherUserData(): [string, string, number] {
        const enteredTitle = this.titleInputEl.value
        const enteredDescription = this.descriptionInputEl.value
        const enteredPeople = this.peopleInputEl.value

        return [enteredTitle, enteredDescription, parseInt(enteredPeople)]
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
