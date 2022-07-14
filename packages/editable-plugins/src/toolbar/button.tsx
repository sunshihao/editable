
import { EditableEditor } from '@editablejs/editor';
import classNames from 'classnames'
import React from 'react';
import { ButtonProps } from './types';

const Button: React.FC<ButtonProps & Record<'editor', EditableEditor>> = ({ editor, children, onToggle, active }) => {

	const handleMouseDown = (event: React.MouseEvent) => {
		event.preventDefault()
		onToggle(editor)
	}

  return <button onMouseDown={handleMouseDown} className={classNames("toolbar-btn", {"active": active})}>{ children }</button>
}

export default Button