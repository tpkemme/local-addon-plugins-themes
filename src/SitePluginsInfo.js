/* src/SitePluginsInfo.js */
const childProcess = require ('child_process' )

module.exports = function( context ) {

    const Component = context.React.Component
    const React = context.React
    const $ = context.jQuery

    return class SitePluginsInfo extends Component {
        constructor( props ) {
            super( props )
            // init class vars
            this.state = {
	    		activeContent: null,
				inactiveContent: null,
				content: null
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
			this.setState( { activeContent: <p>loading...</p>} )
			this.setState( { inactiveContent: <p>loading...</p>} )

		    // get site object using siteID
		    let site = this.props.sites[ this.props.params.siteID ]

		    // construct command using bundled docker binary to execute 'wp plugin list' inside container for active plugins
		    let activeCommand = `${context.environment.dockerPath} exec ${site.container} wp plugin list --status=active --path=/app/public --field=name --allow-root`

		    // execute command in docker env and run callback when it returns
		    childProcess.exec( activeCommand, { env: context.environment.dockerEnv }, (error, stdout, stderr) => {
		        // Display error message if there's an issue
		        if (error) {
		            this.setState( { activeContent:  <p>Error retrieving active plugin list: <pre>{ stderr }</pre></p> } )
		        } else {
		            // split list into array
		            let plugins = stdout.trim().split( "\n" )
		            // Only create unordered list if there are plugins to list
		            if ( plugins.length && plugins[0].length > 1 ) {
		                this.setState( { activeContent: <ul>{ plugins.map( (item) => <li key={ plugins.indexOf(item) }>{ item }</li> ) }</ul> } )
		            } else {
		                this.setState( { activeContent: <p>No active plugins.</p> } )
		            }
		        }
		    } );

		    // construct command using bundled docker binary to execute 'wp plugin list' inside container for active plugins
		    let inactiveCommand = `${context.environment.dockerPath} exec ${site.container} wp plugin list --status=inactive --path=/app/public --field=name --allow-root`

		    // execute command in docker env and run callback when it returns
		    childProcess.exec( inactiveCommand, { env: context.environment.dockerEnv }, (error, stdout, stderr) => {
		        // Display error message if there's an issue
		        if (error) {
		            this.setState( { inactiveContent:  <p>Error retrieving inactive plugin list: <pre>{ stderr }</pre></p> } )
		        } else {
		            // split list into array
		            let plugins = stdout.trim().split( "\n" )
		            // Only create unordered list if there are plugins to list
		            if ( plugins.length && plugins[0].length > 1 ) {
		                this.setState( { inactiveContent: <ul>{ plugins.map( (item) => <li key={ plugins.indexOf(item) }>{ item }</li> ) }</ul> } )
		            } else {
		                this.setState( { inactiveContent: <p>No inactive plugins.</p> } )
		            }
		        }
		    } );

			this.setState( { content: null} )

		}

        render() {
            return (
                <div style={{ overflow: 'scroll', display: 'flex', flexDirection: 'column', flex: 1, padding: '0 5%' }}>
					{ this.state.content }
					<h3>Active Plugins</h3>
					{ this.state.activeContent }

					<h3>Inactive Plugins</h3>
					{ this.state.inactiveContent }
                </div>
            );
        }
    }

}
