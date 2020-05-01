interface Draggable {
    dragStartHandler(event: DragEvent): void
}

interface DragTarget {
    dragOverHandler(event: DragEvent): void
    dropHandler(event: DragEvent): void
    dragLeaveHandler(event: DragEvent): void
}

type Listener = (projects: Project[]) => void

enum ProjectStatus {
    Active,
    Finished
}

class Project {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public people: number,
        public status: ProjectStatus
    ) {}
}

class ProjectState {
    static instance: ProjectState
    private projects: Project[] = []
    private listeners: Listener[] = []

    private constructor() {

    }

    public static getInstance(): ProjectState {
        if(ProjectState.instance) {
            return ProjectState.instance
        }
        ProjectState.instance = new ProjectState()

        return ProjectState.instance
    }

    addProject(title: string, description: string, people: number) {
        const newProject = new Project(
            Math.random().toString(),
            title,
            description,
            people,
            ProjectStatus.Active
        )

        this.projects.push(newProject)
        this.callListeners(this.projects)
    }

    addListeners(listenerFn: Listener) {
        this.listeners.push(listenerFn)
    }

    callListeners(project: Project[]) {
        this.listeners.forEach( foo => {
            foo([...project])
        })
    }

    moveProject(projectId: string, newStatus: ProjectStatus) {
        const project = this.projects.find(project => project.id === projectId)
        if (project && project.status !== newStatus) {
            project.status = newStatus
            this.callListeners(this.projects)
        }
    }
}

const projectState = ProjectState.getInstance()

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

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateEl: HTMLTemplateElement
    hostEl: T
    element: U

    constructor(templateId: string, hostId: string, elementId?: string) {
        this.templateEl = <HTMLTemplateElement>document.getElementById(templateId)!
        this.hostEl = <T>document.getElementById(hostId)!
        const importNode = document.importNode(this.templateEl.content, true)
        this.element = <U>importNode.firstElementChild
        if (elementId) {
            this.element.id = elementId
        }
    }

    protected attach(insertPlace: 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend') {
        this.hostEl.insertAdjacentElement(insertPlace, this.element)
    }

    abstract configure(): void
    abstract renderContent(): void
}

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
    private project: Project

    get people(): string {
        const peopleNumber = this.project.people
        return peopleNumber === 1 ? peopleNumber.toString() + ' person' : peopleNumber.toString() + ' people'
    }

    constructor(hotsId: string, project: Project) {
        super('single-project', hotsId, project.id)
        this.project = project
    }

    @autobinding
    dragStartHandler(event: DragEvent): void {
        event.dataTransfer!.setData('text/plain', this.project.id)
        event.dataTransfer!.effectAllowed = 'move'
    }

    attach(insertPlace: "beforebegin" | "afterbegin" | "beforeend" | "afterend") {
        super.attach(insertPlace);
    }

    configure() {
        this.element.addEventListener('dragstart', this.dragStartHandler)
    }

    renderContent() {
        this.element.querySelector('h2')!.textContent = this.project.title
        this.element.querySelector('h3')!.textContent = this.people + ' assigned'
        this.element.querySelector('p')!.textContent = this.project.description
    }

    init() {
        this.renderContent()
        this.configure()
        this.attach('beforeend')
    }
}

class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
    assignedProjects: any[] = []

    constructor(private projectStatus: 'active' | 'finished') {
        super('project-list', 'app', `${projectStatus}-projects`)
    }

    @autobinding
    dragOverHandler(event: DragEvent) {
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault()
            const listEl = this.element.querySelector('ul')!
            listEl.classList.add('droppable')
        }
    }

    @autobinding
    dropHandler(event: DragEvent) {
        const projectId = event.dataTransfer!.getData('text/plain')
        projectState.moveProject(projectId, this.projectStatus === 'active' ? ProjectStatus.Active : ProjectStatus.Finished)
    }

    @autobinding
    dragLeaveHandler(_: DragEvent) {
        const listEl = this.element.querySelector('ul')!
        listEl.classList.remove('droppable')
    }

    renderContent() {
        const listId = `${this.projectStatus}-projects-list`
        this.element.querySelector('ul')!.id = listId
        this.element.querySelector('h2')!.textContent = this.projectStatus.toUpperCase() + ' PROJECTS'
    }


    configure() {
        projectState.addListeners((projects: Project[]) => {
            const relevantProjects = projects.filter( (project: Project) => {
                if (this.projectStatus === 'active') {
                    return project.status === ProjectStatus.Active
                }
                return project.status === ProjectStatus.Finished
            })
            this.assignedProjects = relevantProjects
            this.renderProjects()
        })
        this.element.addEventListener('dragover', this.dragOverHandler)
        this.element.addEventListener('dragleave', this.dragLeaveHandler)
        this.element.addEventListener('drop', this.dropHandler)
    }

    public init() {
        this.configure()
        this.attach('beforeend')
        this.renderContent()
    }

    private renderProjects() {
        const listEl = <HTMLUListElement>document.getElementById(`${this.projectStatus}-projects-list`)!
        listEl.innerHTML = ''
        this.assignedProjects.forEach( (project: Project) => {
           new ProjectItem(this.element.querySelector('ul')!.id, project).init()
        })
    }
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement>{
    titleInputEl: HTMLInputElement
    descriptionInputEl: HTMLInputElement
    peopleInputEl: HTMLInputElement

    constructor() {
        super('project-input', 'app')
        this.titleInputEl = <HTMLInputElement>this.element.querySelector('#title')
        this.descriptionInputEl = <HTMLInputElement>this.element.querySelector('#description')
        this.peopleInputEl = <HTMLInputElement>this.element.querySelector('#people')
    }

    renderContent() {}

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

const projectInput = new ProjectInput()
projectInput.init()

const activeProjectList = new ProjectList('active')
activeProjectList.init()

const finishedProjectList = new ProjectList('finished')
finishedProjectList.init()

