
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { EditorState } from 'draft-js'
import Immutable, { Map } from 'immutable'
import DraftEditor from 'draft-js-plugins-editor'
import createSideToolbarPlugin from 'draft-js-side-toolbar-plugin'
import creatInlineToolbarPlugin, { Separator } from 'draft-js-inline-toolbar-plugin'
import {
    AlignBlockCenterButton,
    AlignBlockDefaultButton,
    AlignBlockLeftButton,
    AlignBlockRightButton,
    BlockquoteButton,
    BoldButton,
    CodeBlockButton,
    CodeButton,
    HeadlineOneButton,
    HeadlineTwoButton,
    HeadlineThreeButton,
    ItalicButton,
    OrderedListButton,
    UnderlineButton,
    UnorderedListButton
} from 'draft-js-buttons'
import { stateToHTML } from 'draft-js-export-html'

import './less/editor.less'
import 'draft-js-side-toolbar-plugin/lib/plugin.css'
import 'draft-js-inline-toolbar-plugin/lib/plugin.css'

import Export from './Export.js';

export const Buttons = {
    AlignBlockCenter: AlignBlockCenterButton,
    AlignBlockDefault: AlignBlockDefaultButton,
    AlignBlockLeft: AlignBlockLeftButton,
    AlignBlockRight: AlignBlockRightButton,
    Blockquote: BlockquoteButton,
    Bold: BoldButton,
    CodeBlock: CodeBlockButton,
    Code: CodeButton,
    HeadlineOne: HeadlineOneButton,
    HeadlineThree: HeadlineThreeButton,
    HeadlineTwo: HeadlineTwoButton,
    Italic: ItalicButton,
    OrderedList: OrderedListButton,
    Separator: Separator,
    Underline: UnderlineButton,
    UnorderedList: UnorderedListButton,
}

class Editor extends Component {
    constructor(props) {
        super(props);

        this.blockRenderMap = Map({
            unstyled: {
                element: 'p'
            }
        })
        this.sideToolbarPlugin = createSideToolbarPlugin()
        this.inlineToolbarPlugin = creatInlineToolbarPlugin({
            structure: props.inlineToolbarButtons
        })

        this.state = {
            editor: EditorState.createEmpty()
        }
    }

    componentDidMount() {
        if (this.props.controlsNode) {
            ReactDOM.render(<div/>, this.props.controlsNode)
        }
    }

    componentDidUpdate() {
        this.props.preview(stateToHTML(this.state.editor.getCurrentContent()))
        this.props.onChange(this.state.editor.getCurrentContent())
    }

    render() {
        const plugins = [ ]
        const { SideToolbar } = this.sideToolbarPlugin
        const { InlineToolbar } = this.inlineToolbarPlugin
        if (this.props.sideToolbar) plugins.push(this.sideToolbarPlugin)
        if (this.props.inlineToolbar) plugins.push(this.inlineToolbarPlugin)

        return (
            <div style={this.props.style} className={this.props.className} onClick={this.editor ? this.editor.focus : () => { }}>
                <DraftEditor
                    editorState={this.state.editor}
                    ref={el => this.editor = el}
                    onChange={editorState => this.setState({ editor: editorState })}
                    plugins={plugins}
                    blockRenderMap={this.blockRenderMap} />
                { this.props.sideToolbar && <SideToolbar /> }
                { this.props.inlineToolbar && <InlineToolbar /> }
            </div>
        )
    }
}

Editor.propTypes = {
    style: PropTypes.object,
    className: PropTypes.string,
    preview: PropTypes.func,
    initialState: PropTypes.oneOf([PropTypes.string, PropTypes.object]),
    onChange: PropTypes.func,
    inlineToolbarButtons: PropTypes.arrayOf(PropTypes.oneOf([
        Buttons.AlignBlockCenter, Buttons.AlignBlockDefault, Buttons.AlignBlockLeft, Buttons.AlignBlockRight,
        Buttons.Blockquote, Buttons.Bold, Buttons.Code, Buttons.CodeBlock, Buttons.HeadlineOne, Buttons.HeadlineThree,
        Buttons.HeadlineTwo, Buttons.Italic, Buttons.OrderedList, Buttons.Separator, Buttons.Underline,
        Buttons.UnorderedList
    ])),
    sideToolbar: PropTypes.bool,
    inlineToolbar: PropTypes.bool,
}

Editor.defaultProps = {
    style: {
        boxSizing:    'border-box',
        minHeight:    '140px',
        border:       '1px solid #ddd',
        cursor:       'text',
        padding:      '16px',
        borderRadius: '1px',
        marginBottom: '2em',
        boxShadow:    'inset 0px 1px 8px -3px #ababab'
    },
    className: '',
    preview: () => { },
    initialState: null,
    onChange: () => { },
    inlineToolbarButtons: [ Buttons.Bold, Buttons.Italic, Buttons.Underline, Buttons.Separator, Buttons.HeadlineOne, Buttons.HeadlineTwo, Buttons.HeadlineThree ],
    sideToolbar: false,
    inlineToolbar: false,
}

export default Editor;
