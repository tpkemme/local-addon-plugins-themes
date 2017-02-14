/* src/SiteThemesInfo.js */
const childProcess = require ('child_process' )

module.exports = function( context ) {

    const Component = context.React.Component
    const React = context.React
    const $ = context.jQuery

    return class SiteThemesInfo extends Component {
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
				this.getThemeList();
			} else {
				this.setState( { content: ( <p>Machine not running!</p> ) } )
			}
        }

        componentWillUnmount() {
            // tear down
        }

		getThemeList() {
			this.setState( { activeContent: <tr><td className="themes-table-dest">loading...</td></tr>} )
			this.setState( { inactiveContent: <tr><td className="themes-table-dest">loading...</td></tr>} )

		    // get site object using siteID
		    let site = this.props.sites[ this.props.params.siteID ]

		    // construct command using bundled docker binary to execute 'wp plugin list' inside container for active plugins
		    let activeCommand = `${context.environment.dockerPath} exec ${site.container} wp theme list --status=active --path=/app/public --field=name --allow-root`

		    // execute command in docker env and run callback when it returns
		    childProcess.exec( activeCommand, { env: context.environment.dockerEnv }, (error, stdout, stderr) => {
		        // Display error message if there's an issue
		        if (error) {
		            this.setState( { activeContent:  <tr><td className="themes-table-dest">Error retrieving active theme: <pre>{ stderr }</pre></td></tr> } )
		        } else {
		            // split list into array
		            let plugins = stdout.trim().split( "\n" )
		            // Only create unordered list if there are plugins to list
		            if ( plugins.length && plugins[0].length > 1 ) {
		                this.setState( { activeContent: plugins.map( (item) => <tr><td className="themes-table-dest" key={ plugins.indexOf(item) }>{ item }</td></tr> ) } )
		            } else {
		                this.setState( { activeContent: <tr><td className="themes-table-dest">No active theme.</td></tr> } )
		            }
		        }
		    } );

		    // construct command using bundled docker binary to execute 'wp plugin list' inside container for active plugins
		    let inactiveCommand = `${context.environment.dockerPath} exec ${site.container} wp theme list --status=inactive --path=/app/public --field=name --allow-root`

		    // execute command in docker env and run callback when it returns
		    childProcess.exec( inactiveCommand, { env: context.environment.dockerEnv }, (error, stdout, stderr) => {
		        // Display error message if there's an issue
		        if (error) {
		            this.setState( { inactiveContent:  <tr><td className="themes-table-dest">Error retrieving inactive theme list: <pre>{ stderr }</pre></td></tr> } )
		        } else {
		            // split list into array
		            let plugins = stdout.trim().split( "\n" )
		            // Only create unordered list if there are plugins to list
		            if ( plugins.length && plugins[0].length > 1 ) {
		                this.setState( { inactiveContent: plugins.map( (item) => <tr><td className="themes-table-dest" key={ plugins.indexOf(item) }>{ item }</td></tr> ) } )
		            } else {
		                this.setState( { inactiveContent: <tr><td className="themes-table-dest">No inactive themes.</td></tr> } )
		            }
		        }
		    } );

			this.setState( { content: null} )

		}

        render() {
            return (
				<div className="themes-container">
					<link rel="stylesheet" href={this.stylesheetPath}/>
					{ this.state.content }
					<table className="table-striped themes-table">
						<thead>
						<tr>
							<th>Active Theme</th>
							<th>Path</th>
						</tr>
						</thead>
						<tbody>
						{ this.state.activeContent }
						</tbody>
					</table>
					<table className="table-striped plugins-table">
						<thead>
						<tr>
							<th>Inctive Theme</th>
							<th>Path</th>
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
