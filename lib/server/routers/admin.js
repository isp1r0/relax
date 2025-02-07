import {Router} from 'express';
import {graphql} from 'graphql';

import getMarkup from '../helpers/get-markup';
import routeHandler from '../helpers/route-handler';
import routes from '../../routers/admin';
import schema from '../schema';
import UserModel from '../models/user';
import {getAdmin as getAdminActionType} from '../../client/actions/types';
import {getQueryVariables} from '../../decorators/query-props';

var adminRouter = new Router();

// Restrict from here onwards
adminRouter.get('/admin*', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.header = res.locals.header.concat([
      {
        tag: 'link',
        props: {
          rel: 'stylesheet',
          type: 'text/css',
          href: 'https://fonts.googleapis.com/css?family=Open+Sans:400,600,700'
        }
      },
      {
        tag: 'link',
        props: {
          rel: 'stylesheet',
          type: 'text/css',
          href: '/css/main.css'
        }
      },
      {
        tag: 'link',
        props: {
          href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
          rel: 'stylesheet'
        }
      }
    ]);
    res.locals.footer.push({
      tag: 'script',
      props: {
        src: '/js/admin.js'
      }
    });
    next();
  } else {
    next();
    // res.redirect('/admin/login');
  }
  //   res.locals.user = req.user;
  //   res.locals.tabs = [];
  //
});

// Logout
adminRouter.get('/admin/logout', (req, res) => {
  req.logout();
  res.redirect('/admin/login');
});

adminRouter.get('/admin*', (req, res, next) => {
  if (req.isAuthenticated()) {
    routeHandler(routes, req, res, next);
  } else {
    next();
  }
});

adminRouter.get('/admin*', async (req, res, next) => {
  if (req.isAuthenticated()) {
    const AdminContainer = req.routerState.components[0];
    const PanelContainer = req.routerState.components[1];

    const {panelSettings, defaultQuery} = PanelContainer;
    const queryVariables = Object.assign({}, defaultQuery, req.query);

    const paginateQuery = getQueryVariables(queryVariables);

    const {query, variables} = AdminContainer.getQueryAndVariables(
      {
        params: req.routerState.params,
        queryVariables: {
          ...paginateQuery
        }
      },
      {
        ...panelSettings
      }
    );

    const username = req.session.passport.user;
    const user = await UserModel
      .findOne({username})
        .select({
          _id: 1,
          username: 1,
          name: 1,
          email: 1
        })
        .exec();

    const data = await graphql(
      schema.getSchema(),
      query,
      {
        isAuthenticated: true,
        user
      },
      variables
    );

    await req.store.dispatch({
      type: getAdminActionType,
      ...data
    });

    res.status(200).send(getMarkup(req.store, res));
  } else {
    next();
  }
});

export default adminRouter;
