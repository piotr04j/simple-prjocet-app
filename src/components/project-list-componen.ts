namespace App {
    export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
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
                const relevantProjects = projects.filter((project: Project) => {
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
            this.assignedProjects.forEach((project: Project) => {
                new ProjectItem(this.element.querySelector('ul')!.id, project).init()
            })
        }
    }
}
