import mitt, {type Emitter} from 'mitt';
import type {IData} from "@/stores/kanban.store.ts";
import type {ITask} from "@/Types/models.ts";
import type {IDnDPayload} from "@vue-dnd-kit/core";

export interface IChangeCardPosition {
    data: ITask,
    oldIndexCard: number,
    oldIndexCategory: number,
}

type Events = {
    'column.changed.position': IDnDPayload
    'card.changed.position': IDnDPayload
}

export const emitter: Emitter<Events> = mitt<Events>();
