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

		    // construct command using bundled docker binary to execute 'wp theme list' inside container for active themes
		    let activeCommand = `${context.environment.dockerPath} exec ${site.container} wp theme list --status=active --path=/app/public --field=name --allow-root`

		    // execute command in docker env and run callback when it returns
		    childProcess.exec( activeCommand, { env: context.environment.dockerEnv }, (error, stdout, stderr) => {
		        // Display error message if there's an issue
		        if (error) {
		            this.setState( { activeContent:  <tr><td className="themes-table-source">Error retrieving active theme: <pre>{ stderr }</pre></td></tr> } )
		        } else {
		            // split list into array
		            let themes = stdout.trim().split( "\n" )
		            // Only create unordered list if there are themes to list
		            if ( themes.length && themes[0].length > 1 ) {
		                this.setState( { activeContent: themes.map( (item) => <tr><td className="themes-table-source" key={ themes.indexOf(item) }>{ item }</td></tr> ) } )
		            } else {
		                this.setState( { activeContent: <tr><td className="themes-table-source">No active theme.</td></tr> } )
		            }
		        }
		    } );

		    // construct command using bundled docker binary to execute 'wp theme list' inside container for active themes
		    let inactiveCommand = `${context.environment.dockerPath} exec ${site.container} wp theme list --status=inactive --path=/app/public --field=name --allow-root`

		    // execute command in docker env and run callback when it returns
		    childProcess.exec( inactiveCommand, { env: context.environment.dockerEnv }, (error, stdout, stderr) => {
		        // Display error message if there's an issue
		        if (error) {
		            this.setState( { inactiveContent:  <tr><td className="themes-table-source">Error retrieving inactive theme list: <pre>{ stderr }</pre></td></tr> } )
		        } else {
		            // split list into array
		            let themes = stdout.trim().split( "\n" )
		            // Only create unordered list if there are themes to list
		            if ( themes.length && themes[0].length > 1 ) {
		                this.setState( { inactiveContent: themes.map( (item) => <tr><td className="themes-table-source" key={ themes.indexOf(item) }>{ item }</td></tr> ) } )
		            } else {
		                this.setState( { inactiveContent: <tr><td className="themes-table-source">No inactive themes.</td></tr> } )
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


					<table className="table-striped themes-table">
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
