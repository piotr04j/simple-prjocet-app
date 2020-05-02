/// <reference path='./models/drag-drop-interfaces.ts' />
/// <reference path='./models/project.ts' />
/// <reference path='./project-state/project-state.ts' />
/// <reference path='./utils/validation.ts' />
/// <reference path='./decorators/autobind.ts' />
/// <reference path='./components/base-component.ts' />
/// <reference path='./components/project-list-componen.ts' />
/// <reference path='./components/project-input-component.ts' />

namespace App {
    const projectInput = new ProjectInput()
    projectInput.init()

    const activeProjectList = new ProjectList('active')
    activeProjectList.init()

    const finishedProjectList = new ProjectList('finished')
    finishedProjectList.init()
}
