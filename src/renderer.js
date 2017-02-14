'use strict';

const path = require('path');

module.exports = function ( context ) {
	const hooks = context.hooks
	const React = context.React
	const remote = context.electron.remote

	hooks.addFilter( 'siteInfoMoreMenu', function( menu, site ) {
	    menu.push( {
	        label: 'Plugins',
	        enabled: !this.context.router.isActive(`/site-info/${site.id}/plugins-themes`),
	        click: () => {
	            context.events.send('goToRoute', `/site-info/${site.id}/plugins-themes`);
	        }
	    } );
	    return menu;
	} );

		// Require component
	const PluginsAndThemes = require('./PluginsAndThemes')(context)
	// Get router handle
	const Router = context.ReactRouter
	// Add Route
	hooks.addContent( 'routesSiteInfo', () => {
	    return <Router.Route key="site-info-plugins-themes" path="/site-info/:siteID/plugins-themes" component={ PluginsAndThemes }/>
	} );



};
