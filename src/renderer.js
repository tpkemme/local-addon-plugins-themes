'use strict';

const path = require('path');

module.exports = function ( context ) {
	const hooks = context.hooks
	const React = context.React
	const remote = context.electron.remote

	// Add Plugins to More Menu
	hooks.addFilter( 'siteInfoMoreMenu', function( menu, site ) {
	    menu.push( {
	        label: 'Plugins',
	        enabled: !this.context.router.isActive(`/site-info/${site.id}/plugins`),
	        click: () => {
	            context.events.send('goToRoute', `/site-info/${site.id}/plugins`);
	        }
	    } );
	    return menu;
	} );

	// Add Themes to More Menu
	hooks.addFilter( 'siteInfoMoreMenu', function( menu, site ) {
	    menu.push( {
	        label: 'Themes',
	        enabled: !this.context.router.isActive(`/site-info/${site.id}/themes`),
	        click: () => {
	            context.events.send('goToRoute', `/site-info/${site.id}/themes`);
	        }
	    } );
	    return menu;
	} );

	// Require plugin component
	const SitePluginsInfo = require('./SitePluginsInfo')(context)

	// Require themes component
	const SiteThemesInfo = require('./SiteThemesInfo')(context)

	// Get router handle
	const Router = context.ReactRouter

	// Add Route for plugins
	hooks.addContent( 'routesSiteInfo', () => {
	    return <Router.Route key="site-info-plugins" path="/site-info/:siteID/plugins" component={ SitePluginsInfo }/>
	} );

	// Add Route for themes
	hooks.addContent( 'routesSiteInfo', () => {
	    return <Router.Route key="site-info-themes" path="/site-info/:siteID/themes" component={ SiteThemesInfo }/>
	} );



};
