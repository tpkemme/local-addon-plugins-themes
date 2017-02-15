/* src/SitePluginsInfo.js */
const childProcess = require ('child_process' )
const path = require('path');

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

			this.stylesheetPath = path.resolve(__dirname, '../style.css');
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
			this.setState( { activeContent: <tr><td className="plugins-table-source">loading...</td><td className="plugins-table-dest"> - </td></tr>} )
			this.setState( { inactiveContent: <tr><td className="plugins-table-source">loading...</td><td className="plugins-table-dest"> - </td></tr>} )

		    // get site object using siteID
		    let site = this.props.sites[ this.props.params.siteID ]

		    // construct command using bundled docker binary to execute 'wp plugin list' inside container for active plugins
		    let activeCommand = `${context.environment.dockerPath} exec ${site.container} wp plugin list --status=active --path=/app/public --field=name --allow-root`

		    // execute command in docker env and run callback when it returns
		    childProcess.exec( activeCommand, { env: context.environment.dockerEnv }, (error, stdout, stderr) => {
		        // Display error message if there's an issue
		        if (error) {
		            this.setState( { activeContent:  <tr><td className="plugins-table-source">Error retrieving active plugin: <pre>{ stderr }</pre></td><td className="plugins-table-dest"> - </td></tr> } )
		        } else {
		            // split list into array
		            let plugins = stdout.trim().split( "\n" )
		            // Only create unordered list if there are plugins to list
		            if ( plugins.length && plugins[0].length > 1 ) {
		                this.setState( { activeContent: plugins.map( (item) => <tr><td className="plugins-table-source" key={ plugins.indexOf(item) }>{ item }</td><td className="plugins-table-dest">Path</td></tr> ) } )
		            } else {
		                this.setState( { activeContent: <tr><td className="plugins-table-source">No active plugins.</td><td className="plugins-table-dest"> - </td></tr> } )
		            }
		        }
		    } );

		    // construct command using bundled docker binary to execute 'wp plugin list' inside container for active plugins
		    let inactiveCommand = `${context.environment.dockerPath} exec ${site.container} wp plugin list --status=inactive --path=/app/public --field=name --allow-root`

		    // execute command in docker env and run callback when it returns
		    childProcess.exec( inactiveCommand, { env: context.environment.dockerEnv }, (error, stdout, stderr) => {
		        // Display error message if there's an issue
		        if (error) {
		            this.setState( { inactiveContent:  <tr><td className="plugins-table-source">Error retrieving inactive plugin list: <pre>{ stderr }</pre></td><td className="plugins-table-dest"> - </td></tr> } )
		        } else {
		            // split list into array
		            let plugins = stdout.trim().split( "\n" )
		            // Only create unordered list if there are plugins to list
		            if ( plugins.length && plugins[0].length > 1 ) {
		                this.setState( { inactiveContent: plugins.map( (item) => <tr><td className="plugins-table-source" key={ plugins.indexOf(item) }>{ item }</td><td className="plugins-table-dest">Path</td></tr> ) } )
		            } else {
		                this.setState( { inactiveContent: <tr><td className="plugins-table-source">No inactive plugins.</td><td className="plugins-table-dest"> - </td></tr> } )
		            }
		        }
		    } );

			this.setState( { content: null} )

		}

        render() {
            return (
				<div className="plugins-container">
					<link rel="stylesheet" href={this.stylesheetPath}/>
					{ this.state.content }
					<table className="table-striped plugins-table">
						<thead>
						<tr>
							<th className="plugins-table-source">Active Plugin</th>
							<th className="plugins-table-dest">Path</th>
						</tr>
						</thead>
						<tbody>
						{ this.state.activeContent }
						</tbody>
					</table>


					<table className="table-striped plugins-table">
						<thead>
						<tr>
							<th className="plugins-table-source">Inactive Plugin</th>
							<th className="plugins-table-dest">Path</th>
						</tr>
						</thead>
						<tbody>
						{ this.state.inactiveContent }
						</tbody>
					</table>
                </div>
            );
        }
    }

}
