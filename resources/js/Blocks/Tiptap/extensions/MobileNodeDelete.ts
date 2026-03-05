import { Extension } from '@tiptap/core'
import { Plugin, PluginKey, NodeSelection } from '@tiptap/pm/state'
import { liftListItem } from '@tiptap/pm/schema-list'

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

                            // Inline atom right before cursor (e.g. inline node)
                            const nodeBefore = $from.nodeBefore
                            if (nodeBefore && nodeBefore.isAtom) {
                                event.preventDefault()
                                view.dispatch(state.tr.delete($from.pos - nodeBefore.nodeSize, $from.pos))
                                return true
                            }

                            if ($from.parentOffset === 0) {
                                // Block-level atom before current block (e.g. <hr>)
                                if ($from.depth > 0) {
                                    const beforePos = $from.before($from.depth)
                                    const $beforePos = state.doc.resolve(beforePos)
                                    const nodeBeforeBlock = $beforePos.nodeBefore
                                    if (nodeBeforeBlock && nodeBeforeBlock.isAtom) {
                                        event.preventDefault()
                                        view.dispatch(state.tr.delete(beforePos - nodeBeforeBlock.nodeSize, beforePos))
                                        return true
                                    }
                                }

                                // TaskItem: lift to regular paragraph
                                for (let d = $from.depth; d >= 1; d--) {
                                    const node = $from.node(d)
                                    if (node.type.name === 'taskItem') {
                                        event.preventDefault()
                                        liftListItem(node.type)(state, view.dispatch)
                                        return true
                                    }
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