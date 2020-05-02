namespace App {
    export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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

    export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
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
}
