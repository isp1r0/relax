import forEach from 'lodash.foreach';
import React, {PropTypes} from 'react';
import {Component} from 'relax-framework';
import {Component as JSS} from 'relax-jss';

import displays from '../../helpers/displays';
import stylesManager from '../../helpers/styles-manager';
import {Droppable} from '../dnd';

// import utils from '../../utils';

export default class Canvas extends Component {
  static propTypes = {
    dnd: PropTypes.object.isRequired,
    dndActions: PropTypes.object.isRequired,
    pageBuilder: PropTypes.object.isRequired,
    pageBuilderActions: PropTypes.object.isRequired,
    display: PropTypes.string.isRequired,
    styles: PropTypes.array.isRequired
  }

  static childContextTypes = {
    renderElement: PropTypes.func.isRequired,
    dropHighlight: PropTypes.string.isRequired
  }

  getChildContext () {
    return {
      renderElement: this.renderElement.bind(this, {}),
      dropHighlight: this.props.pageBuilder.dragging ? 'vertical' : 'none'
    };
  }

  componentDidMount () {
    this.refs.canvas.addEventListener('scroll', this.onScroll.bind(this));
  }

  onScroll () {
    window.dispatchEvent(new Event('scroll'));
  }

  onElementClick (id, event) {
    event.preventDefault();
    this.props.pageBuilderActions.selectElement(id);
  }

  render () {
    const {data} = this.props.pageBuilder;
    const dropInfo = {
      id: 'body',
      type: 'body'
    };
    const bodyStyle = {
      margin: '0 auto',
      maxWidth: displays[this.props.display]
    };

    // Process schema links if any
    const elementsLinks = {};
    const elements = data && data.body && this.renderChildren(data.body.children, elementsLinks);

    return (
      <div className='page-builder-canvas' ref='canvas'>
        <div className='body-element' style={bodyStyle} ref='body'>
          <Droppable type='body' dropInfo={dropInfo} accepts='Section' placeholder dnd={this.props.dnd} dndActions={this.props.dndActions} pageBuilder={this.props.pageBuilder} pageBuilderActions={this.props.pageBuilderActions}>
            {elements}
          </Droppable>
        </div>
        {this.renderStyles()}
      </div>
    );
  }

  renderStyles () {
    const styleTags = [];
    forEach(stylesManager.stylesMap, (styleMap, key) => {
      styleTags.push(
        <JSS stylesheet={styleMap.stylesheet} key={key} />
      );
    });
    return styleTags;
  }

  renderChildren (children, elementsLinks) {
    let result;
    if ( children instanceof Array ) {
      result = children.map(this.renderElement.bind(this, elementsLinks));
    } else {
      result = children;
    }
    return result;
  }

  renderElement (elementsLinks, elementId) {
    const {data, elements, selectedId} = this.props.pageBuilder;
    const element = data[elementId];

    const styleClassMap = stylesManager.processElement(element, elements[element.tag], this.props.styles, elements);

    if ((!element.hide || !element.hide[this.props.display]) && element.display !== false) {
      if (element.display !== false) {
        const FactoredElement = elements[element.tag];
        const selected = selectedId === element.id;

        return (
          <FactoredElement
            {...element.props}
            dnd={this.props.dnd}
            dndActions={this.props.dndActions}
            pageBuilder={this.props.pageBuilder}
            pageBuilderActions={this.props.pageBuilderActions}
            display={this.props.display}
            key={elementId}
            selected={selected}
            element={element}
            elementId={elementId}
            styleClassMap={styleClassMap}>
            {element.children && this.renderChildren(element.children, elementsLinks)}
          </FactoredElement>
        );
      }
    }
  }
}
