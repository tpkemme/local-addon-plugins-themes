/* src/MyComponent.js */
const childProcess = require ('child_process' )

module.exports = function( context ) {

    const Component = context.React.Component
    const React = context.React
    const $ = context.jQuery

    return class PluginsAndThemes extends Component {
        constructor( props ) {
            super( props )
            // init class vars
            this.state = {
	    		content: null,
				activePlugins: null,
				inactivePlugins: null
			}
        }

        componentDidMount() {
            // set up
			if ( 'running' === this.props.siteStatus ) {
				this.getPluginList();
			} else {
				this.setState( { content: ( <p>Machine not running!</p> ) } )
			}
        }

        componentWillUnmount() {
            // tear down
        }

		getPluginList() {
			this.setState( { activePlugins: <p>loading...</p>, inactivePlugins: <p>loading...</p> } )

		    // get site object using siteID
		    let site = this.props.sites[ this.props.params.siteID ]

		    // construct command using bundled docker binary to execute 'wp plugin list' inside container for active plugins
		    let commandActive = `${context.environment.dockerPath} exec ${site.container} wp plugin list --path=/app/public --field=name --status=active --allow-root`

			// construct command using bundled docker binary to execute 'wp plugin list' inside container for active plugins
		    let commandInactive = `${context.environment.dockerPath} exec ${site.container} wp plugin list --path=/app/public --field=name --status=inactive --allow-root`

		    // execute command in docker env and run callback when it returns
		    childProcess.exec( commandActive, { env: context.environment.dockerEnv }, (error, stdout, stderr) => {
		        // Display error message if there's an issue
		        if (error) {
		            this.setState( { activePlugins:  <p>Error retrieving active plugin list: <pre>{ stderr }</pre></p> } )
		        } else {
		            // split list into array
		            let plugins = stdout.trim().split( "\n" )
		            // Only create unordered list if there are plugins to list
		            if ( plugins.length && plugins[0].length > 1 ) {
		                this.setState( { activePlugins: <ul>{ plugins.map( (item) => <li key={ plugins.indexOf(item) }>{ item }</li> ) }</ul> } )
		            } else {
		                this.setState( { activePlugins: <p>No active plugins.</p> } )
		            }
		        }
		    } );

			// execute command in docker env and run callback when it returns
			childProcess.exec( commandInactive, { env: context.environment.dockerEnv }, (error, stdout, stderr) => {
				// Display error message if there's an issue
				if (error) {
					this.setState( { inactivePlugins:  <p>Error retrieving inactive plugin list: <pre>{ stderr }</pre></p> } )
				} else {
					// split list into array
					let plugins = stdout.trim().split( "\n" )
					// Only create unordered list if there are plugins to list
					if ( plugins.length && plugins[0].length > 1 ) {
						this.setState( { inactivePlugins: <ul>{ plugins.map( (item) => <li key={ plugins.indexOf(item) }>{ item }</li> ) }</ul> } )
					} else {
						this.setState( { inactivePlugins: <p>No inactive plugins.</p> } )
					}
				}
			} );

		}

        render() {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '0 5%' }}>

                    <h3>Active Plugins</h3>
					{ this.state.activePlugins }

					<h3>Inactive Plugins</h3>
					{ this.state.inactivePlugins }
                </div>
            );
        }
    }

}
