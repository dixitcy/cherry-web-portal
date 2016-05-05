
import React , {Component , PropTypes} from 'react';
import { connect } from 'react-redux';
import {registerRequest ,registerUser, setErrorMessage , verifyUser } from '../actions/actions';
import cc from '../constants/country-codes';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import CircularProgress from 'material-ui/lib/circular-progress';
import SelectFieldExampleSimple from './SelectCountry';
import phoneNumberInput from './phoneNumberInput';
import PNF from 'google-libphonenumber/dist/browser/libphonenumber';
import Paper from 'material-ui/lib/paper';
import style from '../styles/Login';
import MediaQuery from 'react-responsive';
import FlatButton from 'material-ui/lib/flat-button';


let AsYouTypeFormatter = require('google-libphonenumber').AsYouTypeFormatter;
let formatter = new AsYouTypeFormatter('IN');


    /*NOTES :
        -consider showing country flags
        -separate out text field into phonetext field

    ISSUES :


		Replace this instead of messy html (separate into component)
		<phoneNumberInput
			style={style}
			formatNumber={this.state.formattedNumber}
			countryValue={this.state.countryCode}
			dialCode={this.setDialCode}
			handleChange={this.handleChange}
			value={this.formatNumber(this.state.formattedNumber)}
			serrormessage={errorMessage}/>
    */

	class LoginComponent extends React.Component {
            constructor(props) {
				props.location = {
					state : {
						nextPathname : '/memories'
					}
				}
                super(props);
                this.state = {
					redirectRoute : '/memories',
                    dial_code: '+91',
                    countryCode: 87,
                    formattedNumber: '',
					otp:''
				};

                this.handleChange = this.handleChange.bind(this);
                this.altHandleChange = this.altHandleChange.bind(this);
                this.handleOtp = this.handleOtp.bind(this);
                this.setDialCode = this.setDialCode.bind(this);
            }
            formatNumber(number) {
                formatter.clear();
                let stringNumber = number.toString();
                for (var i = 0; i < stringNumber.length; i++) {
                    formatter.inputDigit(stringNumber[i]);
                }
                return formatter.currentOutput_;
            }
			handleOtp(e){
				this.props.handleSetErrorMessage('');
				this.setState({otp:e.target.value});
			}
			altHandleChange(e){
				this.props.handleSetErrorMessage('');
				//console.log('ALT FORMATTED NUMBER');
				this.setState({
					formattedNumber: e.target.value
				});
			}
			handleChange(e) {
			    //remove any previous error messages asuser is making changes to input

			    this.props.handleSetErrorMessage('');
			    switch (true) {
			            //ALLOW ONLY NUMBER INPUT
			        case(e.keyCode >= 48 && e.keyCode <= 57):
			            let updatedFormattedNumber;

			            updatedFormattedNumber = this.state.formattedNumber + (String.fromCharCode(e.keyCode)).toString();
			            this.setState({formattedNumber: updatedFormattedNumber});

			            break;
			        case(e.keyCode == 8):

			            let newNumber = this.state.formattedNumber.substr(0, this.state.formattedNumber.length - 1);

			            this.setState({formattedNumber: ''});

			            break;
			        default:

			            break;
			    }

			}
            setDialCode(event, index, value) {

                this.setState({
                    countryCode: index
                });
                this.setState({
                        dial_code: cc[index].dial_code
                    });
                formatter.clear();
                formatter = new AsYouTypeFormatter((cc[index].code).toString());
            }
    	render(){
    		const  {isRegistered , isFetching , handleRegisterUser , handleVerifyUser, handleSetErrorMessage , errorMessage , verificationId , location } = this.props;
			let redirectRoute = this.state.redirectRoute;
			if(location.state){
				redirectRoute = location.state.nextPathname;
			}
    		return (
                    <div style={style.loginContainer}>

						<div style={style.loginElement}>
							<MediaQuery minWidth={800}>


                    <Paper style={style.paper} zDepth={1}>
                    <div >


                        {!isRegistered &&

                            <div>
                            <div style={style.wrapperDiv}>

                                <div style={style.inlineDiv}>

                                    <SelectFieldExampleSimple countryValue={this.state.countryCode}  setCountry={this.setDialCode} />

                                </div>
                                <div  style={style.inlineDiv}>
                                    <TextField hintText={this.state.formattedNumber.length ? 'Enter your mobile number' : ''}
                                        style={style.textField}
                                        errorText={errorMessage}
                                        value={this.state.formattedNumber}
                                        onChange={this.altHandleChange}
                                        onSelect={this.checkForTab}
                                        errorStyle={style.errorStyle}
										onEnterKeyDown={() => {handleRegisterUser(this.state.formattedNumber,this.state.dial_code)}}
                                        underlineFocusStyle={style.cherry}
                                        floatingLabelStyle={(errorMessage) ? style.cherry : style.red}
                                        floatingLabelText="Mobile Number"
                                        id="phoneText"
                                        />
                                </div>
                            </div>

                            <div>

                                {isFetching &&
									<CircularProgress size={0.8}/>
                                }
                                {!isFetching &&
									<RaisedButton style={style.button} labelColor="white" disabled={false} primary={true} label={isRegistered ? 'VERIFY' : 'GET OTP'} onClick={() => handleRegisterUser(this.state.formattedNumber,this.state.dial_code)}/>
								}

                            </div>

                        </div>
                        }

                        {isRegistered &&
                            <div>
                            <div style={style.wrapperDiv}>


                                <div  style={style.inlineDiv}>
                                    <TextField hintText={this.state.formattedNumber.length ? 'otp here' : ''}
                                        style={style.otpField}
										onChange={this.handleOtp}
										errorText={errorMessage}
										onEnterKeyDown={() => {handleVerifyUser(verificationId ,this.state.otp , redirectRoute)}}
										value={this.state.otp}
										errorStyle={style.errorStyle}
										underlineFocusStyle={style.cherry}
                                        floatingLabelStyle={(errorMessage) ? style.cherry : style.red}
                                        floatingLabelText="OTP"
                                        id="otpText"
                                    />
                                </div>
                            </div>
                            <div>

                                {isFetching &&

                                    <CircularProgress size={0.8}/>
                                }
                                {!isFetching &&

                                    <RaisedButton
										style={style.button}
										labelColor='white'
										disabled={false}
										primary={true}
										label={isRegistered ? 'CONTINUE' : 'GET OTP'}
										onClick={() => handleVerifyUser(verificationId ,this.state.otp , redirectRoute)}/>
                                }

                            </div>
                        </div>
                        }


                    </div>
                </Paper>
					</MediaQuery>
					<div className={'infoDiv'} ref='infoDiv' style={{position: 'absolute',
						bottom: '100px',
						textAlign: 'center',
						width: '100%'}}>
						<p className={'loginInfoText'}>Cherry . Your memories here . Forever . </p>
						<div style={{width:'200px',margin:'auto'}}>
							<FlatButton
								label="Android"
								target='_blank'
								style={{display:'inline-block',float:'left'}}
								linkButton={true}
								href='https://play.google.com/store/apps/details?id=com.triconlabs.cherry&hl=en'
								primary={true}/>

							<FlatButton
								label="ios"
								target='_blank'
								style={{display:'inline-block'}}
								linkButton={true}
								href='https://itunes.apple.com/us/app/cherry-cherish-your-memories/id924848929?mt=8'
								primary={true}/>

						</div>
					</div>
					<MediaQuery maxWidth={820}>


			<Paper style={style.smallPaper} zDepth={1}>
			<div >
				{!isRegistered &&
					<div>
					<div style={style.wrapperDiv}>

						<div style={style.inlineDiv}>

							<SelectFieldExampleSimple countryValue={this.state.countryCode}  setCountry={this.setDialCode} />

						</div>
						<div  style={style.inlineDiv}>
							<TextField hintText={this.state.formattedNumber.length ? 'Enter your mobile number' : ''}
								style={style.textField}
								errorText={errorMessage}
								value={this.state.formattedNumber}
								onFocus={() => {console.log('TEST HIDE FOOTER');document.getElementsByClassName('foot')[0].style.display='none';this.refs.infoDiv.style.display = 'none';}}
								onBlur={() => {this.refs.infoDiv.style.display = 'block';document.getElementsByClassName('foot')[0].style.display='block'}}
								onChange={this.altHandleChange}
								onEnterKeyDown={() => {handleRegisterUser(this.state.formattedNumber,this.state.dial_code)}}
								errorStyle={style.errorStyle}
								underlineFocusStyle={style.cherry}
								floatingLabelStyle={(errorMessage) ? style.cherry : style.red}
								floatingLabelText="Mobile Number"
								id="phoneText"
								/>
						</div>
					</div>

					<div>

						{isFetching &&
							<CircularProgress size={0.8}/>
						}
						{!isFetching &&
							<RaisedButton
								style={style.button}
								labelColor='white'
								disabled={false}
								primary={true}
								label={isRegistered ? 'VERIFY' : 'GET OTP'}
								onClick={() => handleRegisterUser(this.state.formattedNumber,this.state.dial_code)}/>
						}

					</div>

				</div>
				}

				{isRegistered &&
					<div>
					<div style={style.wrapperDiv}>


						<div  style={style.inlineDiv}>
							<TextField hintText={this.state.formattedNumber.length ? 'otp here' : ''}
								style={style.otpField}
								onChange={this.handleOtp}
								errorText={errorMessage}
								onFocus={() => {document.getElementsByClassName('foot')[0].style.display='none';this.refs.infoDiv.style.display = 'none';}}
								onBlur={() => {this.refs.infoDiv.style.display = 'block';document.getElementsByClassName('foot')[0].style.display='block'}}
								errorStyle={style.errorStyle}
								onEnterKeyDown={() => {handleVerifyUser(verificationId ,this.state.otp , redirectRoute)}}
								value={this.state.otp}
								underlineFocusStyle={style.cherry}
								floatingLabelStyle={(errorMessage) ? style.cherry : style.red}
								floatingLabelText="OTP"
								id="otpText"
							/>
						</div>
					</div>
					<div>

						{isFetching &&

							<CircularProgress size={0.8}/>
						}
						{!isFetching &&

							<RaisedButton
								style={style.button}
								labelColor='white'
								disabled={false}
								primary={true}
								label={isRegistered ? 'CONTINUE' : 'GET OTP'}
								onClick={() => handleVerifyUser(verificationId ,this.state.otp , redirectRoute)}/>
						}
					</div>
				</div>
				}

			</div>
		</Paper>
			</MediaQuery>
</div>
                </div>
    			)
    		}
    }

    LoginComponent.propTypes = {
        handleRegisterUser: PropTypes.func.isRequired,
        handleVerifyUser: PropTypes.func.isRequired,
        handleSetErrorMessage: PropTypes.func.isRequired,
    	isRegistered: PropTypes.bool.isRequired,
        isFetching: PropTypes.bool.isRequired,
    	errorMessage: PropTypes.string,
		location: PropTypes.object
    }


    const mapStateToProps = (state) => {
    	const { auth } = state;
    	const{ isRegistered , errorMessage , isFetching , verificationId } = auth;

    	return {
    		isRegistered,
    		errorMessage,
    		isFetching,
            verificationId

    	}
    }

    const mapDispatchToProps = (dispatch) => {
    	return {
    		handleRegisterUser: (formattedNumber,dial_code) => {
				//console.log('dial_code');
				//console.log(dial_code);
    			let creds = {
					//need to add in countrycode here , maybe formateed dial_code remove the + or replace with %2b
    				identifier :formattedNumber,
    				identifierType : 'PHONE',
    				verificationMode : 'OTP_MSG',
					dial_code : dial_code

    			}
    			dispatch(registerUser(creds))
    			//dispatch(registerRequest(auth));
    		},
    		handleVerifyUser : (id,otp,redirectRoute) => {
				//console.log('CHECK REDIRECTROUTE');
				//console.log(redirectRoute);
    			dispatch(verifyUser(id,otp,redirectRoute))
    		},
    		handleSetErrorMessage : (msg) => {
    			dispatch(setErrorMessage(msg))
    		}
    	}
    }


    const Login = connect(
    	mapStateToProps,
    	mapDispatchToProps
    )(LoginComponent)

    export default Login;
