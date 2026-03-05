import { Extension } from '@tiptap/core'
import { Plugin, PluginKey, NodeSelection } from '@tiptap/pm/state'

export const MobileNodeDelete = Extension.create({
    name: 'mobileNodeDelete',

    addProseMirrorPlugins() {
        const editor = this.editor

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

                            const nodeBefore = $from.nodeBefore
                            if (nodeBefore && nodeBefore.isAtom) {
                                event.preventDefault()
                                view.dispatch(state.tr.delete($from.pos - nodeBefore.nodeSize, $from.pos))
                                return true
                            }

                            if ($from.parentOffset === 0) {
                                for (let d = $from.depth; d >= 1; d--) {
                                    if ($from.node(d).type.name === 'taskItem') {
                                        event.preventDefault()
                                        editor.commands.liftListItem('taskItem')
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