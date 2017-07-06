import * as React from 'react'
import axios from 'axios'
import Loading from '../GenericComponents/Loading'
import ChangeSessionToken from '../Utils/ChangeSessionToken'
import VerifyAccountActivation from '../Utils/VerifyAccountActivation'
import SaveCredentials from '../Utils/SaveCredentials'

export default class LoginEmail extends React.Component<any, any> {
    
    constructor (props: void) {
        super(props)
        this.state = {
            classInput: '',
            errorMessage: ''
        }
    }

    ChangeInput = (input) => {
        this.props.changeValue(input.target.name, input.target.value)
    }
    
    LogInServer = (e) => {
        e.preventDefault()

        this.props.changeLoading(<Loading className="loagind-form color-bg-light-vivid-mid"/>)

        axios.post ('https://dev.flyve.org/glpi/apirest.php/initSession', {
                login: this.props.email,
                password: this.props.password
        })  
            .then((response) => {
                this.props.changeLoading('')
                ChangeSessionToken(response.data.session_token)
                // VerifyAccountActivation(this.props.history, 'users')

                SaveCredentials(this.props.email, this.props.password, this.props.history)
                
            })
            .catch((error) => {
                this.props.changeLoading('')
                this.setState({
                        classInput: 'color-line-alert',
                        errorMessage: 
                                    // tslint:disable-next-line:jsx-wrap-multiline
                                    <p className="color-type-alert"> 
                                        Your account or password is incorrect. If you don't remember your password, 
                                        <a href="#"> reset it now.</a>
                                    </p>
                    })
            })
    }

    render () { 
        return (
            <div>
                <h1>Enter password</h1>
                <span>Enter the password for</span>	<br />
                <span>{this.props.email}</span>	
                {this.state.errorMessage}
                <form onSubmit={this.LogInServer}>
                    <input 
                        type="password" 
                        name="password" 
                        className="win-textbox"
                        placeholder="Password"
                        value={this.props.password} 
                        onChange={this.ChangeInput} 
                        required={true}
                    />
                        <button className="win-button" type="button" onClick={() => this.props.changeValue('phase', 1)}>
                            Back 
                        </button>
                        <button type="submit" className="win-button color-accent color-type-primary-alt">
                            Sing in
                        </button>

                </form>
                <a href="#">Forgot my password</a>
            </div>
            
        )
    }
}