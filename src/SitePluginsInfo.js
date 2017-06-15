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
				this.setState( { content: ( <p className="plugins-danger">Machine not running!</p> ) } )
				this.setState( { activeContent: null} )
				this.setState( { inactiveContent: null} )
			}
    }

    componentWillUnmount() {
        // tear down
    }

		getPluginList() {

			// Set loading message for active plugins
			this.setState( { activeContent:
				<tr>
					<td className="plugins-table-name">loading...</td>
					<td className="plugins-table-info"> - </td>
					<td className="plugins-table-info"> - </td>
				</tr> } )

			// Set loading message for inactive plugins
			this.setState( { inactiveContent:
				<tr>
					<td className="plugins-table-name">loading...</td>
					<td className="plugins-table-info"> - </td>
					<td className="plugins-table-info"> - </td>
				</tr> } )

	    // get site object using siteID
	    let site = this.props.sites[ this.props.params.siteID ]

	    // construct command using bundled docker binary to execute 'wp plugin list' inside container for active plugins
      // IMPORTANT can't forget to escape any spaces in dockerPath!
      let activeCommand = `${ context.environment.dockerPath.replace(/ /g, "\\ ") } exec ${site.container} wp plugin list --status=active --path=/app/public --format=csv --allow-root`
      
	    // execute command in docker env and run callback when it returns
	    childProcess.exec( activeCommand, { env: context.environment.dockerEnv }, (error, stdout, stderr) => {
	        // Display error message if there's an issue
	        if (error) {
            this.setState( { activeContent:
  					<tr>
  						<td className="plugins-table-name">Error retrieving active plugin: <pre>{ error, stdout, stderr }</pre></td>
  						<td className="plugins-table-info"> - </td>
  						<td className="plugins-table-info"> - </td>
  					</tr> } )
	        } 
          else {
	            // split list into array
            let plugins = stdout.trim().split( "\n" )
	          plugins.splice(0, 1)

	            // Only create unordered list if there are plugins to list
            if ( plugins.length && plugins[0].length > 1 ) {
              this.setState( { activeContent: plugins.map( (item) =>
  						<tr>
  							<td className="plugins-table-name" key={ plugins.indexOf(item) }>{ item.trim().split( "," )[0] }</td>
  							<td className={ item.trim().split( "," )[2] + " plugins-table-info" } >{ item.trim().split( "," )[2] }</td>
  							<td className="plugins-table-info">{ item.trim().split( "," )[3] }</td>
  						</tr> ) } )
            } 
            else {
              this.setState( { activeContent:
  						<tr>
  							<td className="plugins-table-name">No active plugins.</td>
  							<td className="plugins-table-info"> - </td>
  							<td className="plugins-table-info"> - </td>
  						</tr> } )
            }
	        }
	    } );

			// construct command using bundled docker binary to execute 'wp plugin list' inside container for inactive plugins
      // IMPORTANT can't forget to escape any spaces in dockerPath!
      let inactiveCommand = `${ context.environment.dockerPath.replace(/ /g, "\\ ") } exec ${site.container} wp plugin list --status=inactive --path=/app/public --format=csv --allow-root`

	    // execute command in docker env and run callback when it returns
	    childProcess.exec( inactiveCommand, { env: context.environment.dockerEnv }, (error, stdout, stderr) => {
	        // Display error message if there's an issue
	        if (error) {
            this.setState( { inactiveContent:
						<tr>
							<td className="plugins-table-name">Error retrieving inactive plugin: <pre>{ stderr }</pre></td>
							<td className="plugins-table-info"> - </td>
							<td className="plugins-table-info"> - </td>
						</tr> } )
	        } 
          else {
            // split list into array
            let plugins = stdout.trim().split( "\n" )
            plugins.splice(0, 1)

            // Only create unordered list if there are plugins to list
            if ( plugins.length && plugins[0].length > 1 ) {
              this.setState( { inactiveContent: plugins.map( (item) =>
							<tr>
								<td className="plugins-table-name" key={ plugins.indexOf(item) }>{ item.trim().split( "," )[0] }</td>
								<td className={ item.trim().split( "," )[2] + " plugins-table-info" } >{ item.trim().split( "," )[2] }</td>
								<td className="plugins-table-info">{ item.trim().split( "," )[3] }</td>
							</tr> ) } )
            } else {
                    this.setState( { inactiveContent:
            	<tr>
            		<td className="plugins-table-name">No inactive plugins.</td>
            		<td className="plugins-table-info"> - </td>
            		<td className="plugins-table-info"> - </td>
            	</tr> } )
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

          <h3 className="plugins-table-title">Active Plugins</h3>
					<table className="table-striped plugins-table">
						<thead>
  						<tr className="plugin-table-head" >
  							<th className="plugins-table-name"><strong>Name</strong></th>
  							<th className="plugins-table-info"><strong>Update</strong></th>
  							<th className="plugins-table-info"><strong>Version</strong></th>
  						</tr>
						</thead>
						<tbody>
              { this.state.activeContent }
						</tbody>
					</table>

          <h3 className="plugins-table-title">Inactive Plugins</h3>
					<table className="table-striped plugins-table">
						<thead>
  						<tr className="plugin-table-head" >
  							<th className="plugins-table-name"><strong>Name</strong></th>
  							<th className="plugins-table-info"><strong>Update</strong></th>
  							<th className="plugins-table-info"><strong>Version</strong></th>
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
