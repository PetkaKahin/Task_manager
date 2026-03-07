import { Extension } from '@tiptap/core'
import { Plugin, PluginKey, NodeSelection } from '@tiptap/pm/state'
import { liftListItem } from '@tiptap/pm/schema-list'

const DELETABLE_ATOM_TYPES = new Set(['horizontalRule'])
const LIFTABLE_LIST_TYPES = new Set(['taskItem', 'listItem'])

export const MobileNodeDelete = Extension.create({
    name: 'mobileNodeDelete',

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('mobileNodeDelete'),
                props: {
                    handleDOMEvents: {
                        beforeinput(view, event: InputEvent) {
                            if (event.inputType !== 'deleteContentBackward') return false

                            const { state } = view
                            const { selection } = state
                            const { $from } = selection

                            if (selection instanceof NodeSelection || $from.pos === 0) return false
                            if ($from.parentOffset !== 0) return false

                            // Block-level atom before current block (e.g. <hr>)
                            if ($from.depth > 0) {
                                const beforePos = $from.before($from.depth)
                                const $beforePos = state.doc.resolve(beforePos)
                                const nodeBeforeBlock = $beforePos.nodeBefore
                                if (nodeBeforeBlock && DELETABLE_ATOM_TYPES.has(nodeBeforeBlock.type.name)) {
                                    event.preventDefault()
                                    view.dispatch(state.tr.delete(beforePos - nodeBeforeBlock.nodeSize, beforePos))
                                    return true
                                }
                            }

                            // TaskItem / ListItem: lift to regular paragraph
                            for (let d = $from.depth; d >= 1; d--) {
                                const node = $from.node(d)
                                if (LIFTABLE_LIST_TYPES.has(node.type.name)) {
                                    event.preventDefault()
                                    liftListItem(node.type)(state, view.dispatch)
                                    return true
                                }
                            }

                            return false
                        },
                    },
                },
            }),
        ]
    },
})