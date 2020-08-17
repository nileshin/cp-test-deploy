import React, { Component } from 'react';
import { StaticQuery, graphql, Link } from 'gatsby';

export const defaultMenuRender = data => {
  const { menu } = data;
  return (
    <ul>
      {menu.map(nav_item => (
        <li className={nav_item.classes.join(' ')} key={nav_item.wordpress_id}>
          {
            nav_item.post_object && nav_item.type !== 'custom' ? 
            <Link to={nav_item.url}>{nav_item.title}</Link> :
            <a href={nav_item.url}>{nav_item.title}</a>
          }
        </li>
      ))}
    </ul>
  );
}

class Menu extends Component {
  render() {
    const { menuName = 'main-menu', render, children } = this.props;
    const renderFunc = render || children;
    return (
      <StaticQuery
        query={graphql`
          query MenuQuery {
            allWordpressCpMenus {
              edges {
                node {
                  id
                  menu_name
                  menu {
                    wordpress_id
                    title
                    url
                    classes
                    type
                    post_object {
                      post_name
                    }
                  }
                }
              }
            }
            allWordpressAcfOptions {
              edges {
                node {
                  options {
                    social_menu {
                      social_media_network
                      link {
                        title
                        url
                        target
                      }
                    }
                  }
                }
              }
            }
          }
        `}
        render={data => {
          const {
            allWordpressCpMenus: { edges },
            allWordpressAcfOptions: { edges:options }
          } = data;
          const menu = edges.find(m => m.node.menu_name === menuName);
          return typeof renderFunc === 'function' ? renderFunc(menu.node, options) : defaultMenuRender(menu.node, options);
        }}
      />
    );
  }
}

export default Menu;
