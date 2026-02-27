export interface IProject {
    id: number
    title: string
}

export interface ITask {
    id: number
    category_id: number
    content: string
}

export interface ICategory {
    id: number
    project_id: number
    title: string
    description: string
    tasks: ITask[]
}
