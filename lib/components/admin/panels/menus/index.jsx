import React, {PropTypes} from 'react';
import {Component, mergeFragments} from 'relax-framework';

import Breadcrumbs from '../../../breadcrumbs';
import List from './list';
import Filter from '../../../filter';
import Pagination from '../../../pagination';
import A from '../../../a';

export default class Menus extends Component {
  static fragments = mergeFragments({
    menusCount: {
      count: 1
    }
  }, List.fragments)

  static propTypes = {
    breadcrumbs: PropTypes.array.isRequired,
    menus: PropTypes.array,
    query: PropTypes.object.isRequired,
    count: PropTypes.number.isRequired,
    removeMenu: PropTypes.func.isRequired,
    duplicateMenu: PropTypes.func.isRequired
  }

  render () {
    return (
      <div className='admin-menus'>
        <div className='filter-menu'>
          <Breadcrumbs data={this.props.breadcrumbs} />
          <A href='/admin/menus/new' className='button-clean'>
            <i className='material-icons'>library_add</i>
            <span>Add new menu</span>
          </A>
          <Filter
            sorts={[
              {label: 'Date', property: '_id'},
              {label: 'Title', property: 'title'},
              {label: 'Slug', property: 'slug'}
            ]}
            url='/admin/menus'
            search='title'
            query={this.props.query}
          />
        </div>
        <div className='admin-scrollable'>
          <List
            menus={this.props.menus}
            removeMenu={this.props.removeMenu}
            duplicateMenu={this.props.duplicateMenu}
          />
          <Pagination
            url='/admin/menus'
            query={this.props.query}
            count={this.props.count}
          />
        </div>
      </div>
    );
  }
}
