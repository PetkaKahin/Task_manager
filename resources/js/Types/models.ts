export interface IProject {
    id: number
    title: string
    position: string
}

export interface ITask {
    id: number
    category_id: number
    content: Record<string, any> | null
    _key?: number
}

export interface ICategory {
    id: number
    project_id: number
    title: string
    description: string
    tasks: ITask[]
}
