import { Extension } from '@tiptap/core'
import { TextSelection, AllSelection, NodeSelection } from '@tiptap/pm/state'

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        MoveNode: {
            /**
             * create a youtube node
             */
            moveNodeUp: () => ReturnType;
            moveNodeDown: () => ReturnType;
        };
    }
}

export const MoveNode = Extension.create({
    name: 'moveNode',

    addCommands() {
        return {
            moveNodeUp: () => ({ tr, state, dispatch }) => {
                const { selection } = state
                const { $from } = selection

                let depth, currentNode, currentNodePos, resolvedPos

                // Xử lý NodeSelection (cho atom nodes như Image, Video, etc.)
                if (selection instanceof NodeSelection) {
                    currentNode = selection.node
                    currentNodePos = selection.$from.pos
                    resolvedPos = state.doc.resolve(currentNodePos)

                    // Tìm depth của node trong parent
                    depth = resolvedPos.depth
                    // Nếu node nằm ngay trong doc, depth = 1
                    if (depth === 0) depth = 1
                } else {
                    // Tìm node ở depth phù hợp cho TextSelection
                    depth = $from.depth

                    while (depth > 0) {
                        const node = $from.node(depth)
                        const parent = $from.node(depth - 1)

                        if (parent && parent.type.name !== 'doc' || node.type.isBlock) {
                            break
                        }
                        depth--
                    }

                    if (depth === 0) return false

                    currentNode = $from.node(depth)
                    currentNodePos = $from.before(depth)
                    resolvedPos = $from
                }

                // Lấy parent node
                const parentDepth = depth - 1
                if (parentDepth < 0) return false

                const parent = resolvedPos.node(parentDepth)
                if (!parent) return false

                const indexInParent = resolvedPos.index(parentDepth)

                // Kiểm tra có node trước đó không
                if (indexInParent === 0) {
                    return false
                }

                const prevNode = parent.child(indexInParent - 1)
                if (!prevNode) return false

                const prevNodePos = currentNodePos - prevNode.nodeSize

                if (dispatch) {
                    try {
                        const nodeToMove = currentNode.copy(currentNode.content)

                        tr.delete(currentNodePos, currentNodePos + currentNode.nodeSize)
                        tr.insert(prevNodePos, nodeToMove)

                        // Đặt lại selection - dùng NodeSelection cho atom nodes
                        const newPos = prevNodePos
                        if (currentNode.isAtom) {
                            tr.setSelection(NodeSelection.create(tr.doc, newPos))
                        } else {
                            tr.setSelection(TextSelection.create(tr.doc, newPos + 1))
                        }

                        dispatch(tr.scrollIntoView())
                    } catch (error) {
                        console.error('Error moving node up:', error)
                        return false
                    }
                }

                return true
            },

            moveNodeDown: () => ({ tr, state, dispatch }) => {
                const { selection } = state
                const { $from } = selection

                let depth, currentNode, currentNodePos, resolvedPos

                // Xử lý NodeSelection (cho atom nodes như Image, Video, etc.)
                if (selection instanceof NodeSelection) {
                    currentNode = selection.node
                    currentNodePos = selection.$from.pos
                    resolvedPos = state.doc.resolve(currentNodePos)

                    depth = resolvedPos.depth
                    if (depth === 0) depth = 1
                } else {
                    // Tìm node ở depth phù hợp cho TextSelection
                    depth = $from.depth

                    while (depth > 0) {
                        const node = $from.node(depth)
                        const parent = $from.node(depth - 1)

                        if (parent && parent.type.name !== 'doc' || node.type.isBlock) {
                            break
                        }
                        depth--
                    }

                    if (depth === 0) return false

                    currentNode = $from.node(depth)
                    currentNodePos = $from.before(depth)
                    resolvedPos = $from
                }

                const currentNodeSize = currentNode.nodeSize

                // Lấy parent node
                const parentDepth = depth - 1
                if (parentDepth < 0) return false

                const parent = resolvedPos.node(parentDepth)
                if (!parent) return false

                const indexInParent = resolvedPos.index(parentDepth)

                // Kiểm tra có node tiếp theo không
                if (indexInParent >= parent.childCount - 1) {
                    return false
                }

                const nextNode = parent.child(indexInParent + 1)
                if (!nextNode) return false

                const nextNodeSize = nextNode.nodeSize

                if (dispatch) {
                    try {
                        const nodeToMove = currentNode.copy(currentNode.content)

                        tr.delete(currentNodePos, currentNodePos + currentNodeSize)

                        const insertPos = currentNodePos + nextNodeSize
                        tr.insert(insertPos, nodeToMove)

                        // Đặt lại selection - dùng NodeSelection cho atom nodes
                        if (currentNode.isAtom) {
                            tr.setSelection(NodeSelection.create(tr.doc, insertPos))
                        } else {
                            tr.setSelection(TextSelection.create(tr.doc, insertPos + 1))
                        }

                        dispatch(tr.scrollIntoView())
                    } catch (error) {
                        console.error('Error moving node down:', error)
                        return false
                    }
                }

                return true
            },
        }
    },

    addKeyboardShortcuts() {
        return {
            // Move node up with Alt+Up (Option+Up on Mac)
            'Alt-ArrowUp': () => this.editor.commands.moveNodeUp(),

            // Move node down with Alt+Down (Option+Down on Mac)
            'Alt-ArrowDown': () => this.editor.commands.moveNodeDown(),
        }
    },
})