namespace App {
    type Listener = (projects: Project[]) => void

    export class ProjectState {
        static instance: ProjectState
        private projects: Project[] = []
        private listeners: Listener[] = []

        private constructor() {

        }

        public static getInstance(): ProjectState {
            if (ProjectState.instance) {
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
            this.listeners.forEach(foo => {
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

    export const projectState = ProjectState.getInstance()
}
