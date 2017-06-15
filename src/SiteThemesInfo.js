/* src/SiteThemesInfo.js */
const childProcess = require ('child_process' )
const path = require('path');

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

			this.stylesheetPath = path.resolve(__dirname, '../style.css');
    }

    componentDidMount() {
      // set up
			if ( 'running' === this.props.siteStatus ) {
				this.getThemeList();
			} else {
				this.setState( { content: ( <p className="themes-danger">Machine not running!</p> ) } )
				this.setState( { activeContent: null} )
				this.setState( { inactiveContent: null} )
			}
    }

    componentWillUnmount() {
        // tear down
    }

		getThemeList() {

			// Set loading message for active themes
			this.setState( { activeContent:
				<tr>
					<td className="themes-table-name">loading...</td>
					<td className="themes-table-info"> - </td>
					<td className="themes-table-info"> - </td>
				</tr> } )

			// Set loading message for inactive themes
			this.setState( { inactiveContent:
				<tr>
					<td className="themes-table-name">loading...</td>
					<td className="themes-table-info"> - </td>
					<td className="themes-table-info"> - </td>
				</tr> } )

	    // get site object using siteID
	    let site = this.props.sites[ this.props.params.siteID ]

	    // construct command using bundled docker binary to execute 'wp theme list' inside container for active themes
	    // IMPORTANT can't forget to escape any spaces in dockerPath!
	    let activeCommand = `${ context.environment.dockerPath.replace(/ /g, "\\ ") } exec ${site.container} wp theme list --status=active --path=/app/public --format=csv --allow-root`

	    // execute command in docker env and run callback when it returns
	    childProcess.exec( activeCommand, { env: context.environment.dockerEnv }, (error, stdout, stderr) => {
        // Display error message if there's an issue
        if (error) {
            this.setState( { activeContent:
				<tr>
					<td className="themes-table-name">Error retrieving active theme: <pre>{ stderr }</pre></td>
					<td className="themes-table-info"> - </td>
					<td className="themes-table-info"> - </td>
				</tr> } )
        } else {
          // split list into array
          let themes = stdout.trim().split( "\n" )
		      themes.splice(0, 1)

          // Only create unordered list if there are themes to list
          if ( themes.length && themes[0].length > 1 ) {
            this.setState( { activeContent: themes.map( (item) =>
  						<tr>
  							<td className="themes-table-name" key={ themes.indexOf(item) }>{ item.trim().split( "," )[0] }</td>
  							<td className={ item.trim().split( "," )[2] + " themes-table-info" } >{ item.trim().split( "," )[2] }</td>
  							<td className="themes-table-info">{ item.trim().split( "," )[3] }</td>
  						</tr> ) } )
          } else {
            this.setState( { activeContent:
  						<tr>
  							<td className="themes-table-name">No active themes.</td>
  							<td className="themes-table-info"> - </td>
  							<td className="themes-table-info"> - </td>
  						</tr> } )
            }
	        }
	    } );

			// construct command using bundled docker binary to execute 'wp theme list' inside container for inactive themes
      // IMPORTANT can't forget to escape any spaces in dockerPath!
      let inactiveCommand = `${ context.environment.dockerPath.replace(/ /g, "\\ ") } exec ${site.container} wp theme list --status=inactive --path=/app/public --format=csv --allow-root`

	    // execute command in docker env and run callback when it returns
	    childProcess.exec( inactiveCommand, { env: context.environment.dockerEnv }, (error, stdout, stderr) => {
        // Display error message if there's an issue
        if (error) {
          this.setState( { inactiveContent:
  					<tr>
  						<td className="themes-table-name">Error retrieving inactive theme: <pre>{ stderr }</pre></td>
  						<td className="themes-table-info"> - </td>
  						<td className="themes-table-info"> - </td>
  					</tr> } )
        } else {
          // split list into array
          let themes = stdout.trim().split( "\n" )
  				themes.splice(0, 1)

          // Only create unordered list if there are themes to list
          if ( themes.length && themes[0].length > 1 ) {
            this.setState( { inactiveContent: themes.map( (item) =>
  						<tr>
  							<td className="themes-table-name" key={ themes.indexOf(item) }>{ item.trim().split( "," )[0] }</td>
  							<td className={ item.trim().split( "," )[2] + " themes-table-info" } >{ item.trim().split( "," )[2] }</td>
  							<td className="themes-table-info">{ item.trim().split( "," )[3] }</td>
  						</tr> ) } 
            )
          } else {
            this.setState( { inactiveContent:
  						<tr>
  							<td className="themes-table-name">No inactive themes.</td>
  							<td className="themes-table-info"> - </td>
  							<td className="themes-table-info"> - </td>
  						</tr> } )
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

          <h3 className="themes-table-title">Active Theme</h3>
					<table className="table-striped themes-table">
						<thead>
    					<tr className="theme-table-head" >
    						<th className="themes-table-name"><strong>Name</strong></th>
    						<th className="themes-table-info"><strong>Update</strong></th>
    						<th className="themes-table-info"><strong>Version</strong></th>
    					</tr>
						</thead>
            <tbody>
				      { this.state.activeContent }
						</tbody>
					</table>

          <h3 className="themes-table-title">Inactive Themes</h3>
					<table className="table-striped themes-table">
						<thead>
  						<tr className="theme-table-head" >
  							<th className="themes-table-name"><strong>Name</strong></th>
  							<th className="themes-table-info"><strong>Update</strong></th>
  							<th className="themes-table-info"><strong>Version</strong></th>
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
