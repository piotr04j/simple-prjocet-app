namespace App {
    export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
        titleInputEl: HTMLInputElement
        descriptionInputEl: HTMLInputElement
        peopleInputEl: HTMLInputElement

        constructor() {
            super('project-input', 'app')
            this.titleInputEl = <HTMLInputElement>this.element.querySelector('#title')
            this.descriptionInputEl = <HTMLInputElement>this.element.querySelector('#description')
            this.peopleInputEl = <HTMLInputElement>this.element.querySelector('#people')
        }

        renderContent() {
        }

        configure() {
            this.element.addEventListener('submit', this.submitHandler)
        }

        public init() {
            this.configure()
            this.attach('afterbegin')
        }

        private gatherUserData(): [string, string, number] | void {
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
                max: 6
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
            if (userInputs) {
                projectState.addProject(...userInputs)
            }
            this.clearInputs()
        }

        private clearInputs() {
            this.titleInputEl.value = ''
            this.descriptionInputEl.value = ''
            this.peopleInputEl.value = ''
        }
    }
}
