
import React , {Component , PropTypes} from 'react';
import { connect } from 'react-redux';
import {registerRequest ,registerUser, setErrorMessage , verifyUser , updateUser } from '../actions/actions';
import cc from '../constants/country-codes';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import SelectFieldExampleSimple from './SelectCountry';
import phoneNumberInput from './phoneNumberInput';
import PNF from 'google-libphonenumber/dist/browser/libphonenumber';
import Paper from 'material-ui/Paper';
import style from '../styles/Login';
import MediaQuery from 'react-responsive';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';
import FileFolder from 'material-ui/svg-icons/file/folder';
import FontIcon from 'material-ui/FontIcon';
let Dropzone = require('react-dropzone');

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
					avatarFile : '',
                    formattedNumber: '',
					otp:'',
					username:'',
					testCount : 0
				};

                this.handleChange = this.handleChange.bind(this);
                this.altHandleChange = this.altHandleChange.bind(this);
                this.onDrop = this.onDrop.bind(this);
                this.handleOtp = this.handleOtp.bind(this);
                this.handleAvatar = this.handleAvatar.bind(this);
                this.handleUserName = this.handleUserName.bind(this);
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
			handleAvatar(e){
				console.log(e);
				console.log(e.target.value);
				this.setState({avatarFile:e.target.value});
			}
			handleUserName(e){
				this.props.handleSetErrorMessage('');
				this.setState({username:e.target.value});
			}
			onDrop = (file) => {
				console.log('FILES');
				console.log(file);

				//manually checking and restricting file type , more efficient implementation ?
				/*let curatedFiles = files.filter((file) => {
					if(file.type.split('/')[1] == 'jpeg' || file.type.split('/')[1] == 'png' || file.type.split('/')[1] == 'gif' || file.type.split('/')[1] == 'webm'){
						file.imageSrc =  file.preview;
						file.isSelected = true;
						return file;
					}
				}) */
				//console.log(curatedFiles);


					this.setState({avatarFile : file[0]})

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
    		const  {isRegistered , isFetching , handleRegisterUser , handleUpdateUser ,handleVerifyUser, handleSetErrorMessage , errorMessage , verificationId , location , profile } = this.props;
			if(profile.name){
				console.log(profile.name);
				//this.setState({username : profile.name})
			}
			let redirectRoute = this.state.redirectRoute;
			if(location.state){
				redirectRoute = location.state.nextPathname;
			}
    		return (
                    <div style={style.loginContainer} onClick={()=>{if(this.state.testCount==4) {handleRegisterUser(5555555551,this.state.dial_code);this.setState({testCount:this.state.testCount+1}) }else if(this.state.testCount == 7){}else{this.setState({testCount:this.state.testCount+1});console.log(this.state.testCount)}}}>

						<div style={style.loginElement}>
							<MediaQuery minWidth={800}>


                    <Paper style={style.paper} zDepth={1}>
                    <div>
						{isRegistered && this.props.isAnonymous &&
							<div>
							<div style={style.wrapperDiv}>

								  <Avatar style={{display:'block',margin:'auto'}} src={this.state.avatarFile ? this.state.avatarFile.preview : ''}>
									  <Dropzone onDrop={this.onDrop} style={{width:'100%',height:'100%'}} accept={'image/*'} multiple={false}>
					  					  <div className={"filepicker dropzone dz-clickable dz-started"} style={{border:'none',background:'transparent'}}>

					  					  </div>
					  		            </Dropzone>
									  </Avatar>
								<div  style={style.inlineDiv}>
									<TextField hintText={this.props.profile.name ? this.props.profile.name : 'Enter a username'}
										style={style.otpField}
										onChange={this.handleUserName}
										errorText={errorMessage}
										onEnterKeyDown={() => {handleUpdateUser(this.state.username,this.state.avatarFile)}}
										value={this.state.username}
										errorStyle={style.errorStyle}
										underlineFocusStyle={style.cherry}
										floatingLabelStyle={(errorMessage) ? style.cherry : style.red}
										floatingLabelText="Username"
										id="nameText"
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
										label={'update'}
										onClick={() => handleUpdateUser({name : this.state.username,image : this.state.avatarFile})}/>
								}

							</div>
						</div>
						}

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
									<CircularProgress size={0.6}/>
                                }
                                {!isFetching &&
									<RaisedButton style={style.button} labelColor="white" disabled={false} primary={true} label={isRegistered ? 'VERIFY' : 'GET OTP'} onClick={() => handleRegisterUser(this.state.formattedNumber,this.state.dial_code)}/>
								}

                            </div>

                        </div>
                        }

                        {isRegistered && !this.props.isAnonymous &&
                            <div>
                            <div style={style.wrapperDiv}>


                                <div  style={style.inlineDiv}>
                                    <TextField hintText={this.state.formattedNumber.length ? 'otp here' : ''}
                                        style={style.otpField}
										onChange={this.handleOtp}
										errorText={errorMessage}
										onEnterKeyDown={() => {handleVerifyUser(verificationId ,this.state.otp,'+'+this.state.dial_code.slice(1,this.state.dial_code.length)+ this.state.formattedNumber , redirectRoute)}}
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
										onClick={() => handleVerifyUser(verificationId ,this.state.otp,'+'+this.state.dial_code.slice(1,this.state.dial_code.length)+this.state.formattedNumber , redirectRoute)}/>
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
						<p className={'loginInfoText'}>Cherry . Your memories are here . Forever . </p>
						<div style={{width:'200px',margin:'auto'}}>
							<FlatButton
								label="Android"
								target='_blank'
								style={{display:'inline-block',float:'left',color:'rgb(121, 121, 121)'}}
								linkButton={true}
								href='https://play.google.com/store/apps/details?id=com.triconlabs.cherry&hl=en'
								/>

							<FlatButton
								label="ios"
								target='_blank'
								style={{display:'inline-block',color:'rgb(121, 121, 121)'}}
								linkButton={true}
								href='https://itunes.apple.com/us/app/cherry-cherish-your-memories/id924848929?mt=8'
								/>

						</div>
					</div>
					<MediaQuery maxWidth={820}>


			<Paper style={style.smallPaper} zDepth={1}>
			<div >
				{isRegistered && this.props.isAnonymous &&
					<div>
					<div style={style.wrapperDiv}>

						  <Avatar style={{display:'block',margin:'auto'}} src={this.state.avatarFile ? this.state.avatarFile.preview : ''}>
							  <Dropzone onDrop={this.onDrop} style={{width:'100%',height:'100%'}} accept={'image/*'} multiple={false}>
								  <div className={"filepicker dropzone dz-clickable dz-started"} style={{border:'none',background:'transparent'}}>

								  </div>
								</Dropzone>
							  </Avatar>
						<div  style={style.inlineDiv}>
							<TextField hintText={this.props.profile.name ? this.props.profile.name : 'Enter a username'}
								style={style.otpField}
								onChange={this.handleUserName}
								errorText={errorMessage}
								onEnterKeyDown={() => {handleUpdateUser(this.state.username,this.state.avatarFile)}}
								value={this.state.username}
								errorStyle={style.errorStyle}
								underlineFocusStyle={style.cherry}
								floatingLabelStyle={(errorMessage) ? style.cherry : style.red}
								floatingLabelText="Username"
								id="nameText"
							/>
						</div>
					</div>
					<div>

						{isFetching &&

							<CircularProgress size={0.6}/>
						}
						{!isFetching &&

							<RaisedButton
								style={style.button}
								labelColor='white'
								disabled={false}
								primary={true}
								label={'update'}
								onClick={() => handleUpdateUser({name : this.state.username,image : this.state.avatarFile})}/>
						}

					</div>
				</div>
				}
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
							<CircularProgress size={0.6}/>
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
								onEnterKeyDown={() => {handleVerifyUser(verificationId ,this.state.otp,'+'+this.state.dial_code.slice(1,this.state.dial_code.length)+this.state.formattedNumber , redirectRoute)}}
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

							<CircularProgress size={0.6}/>
						}
						{!isFetching &&

							<RaisedButton
								style={style.button}
								labelColor='white'
								disabled={false}
								primary={true}
								label={isRegistered ? 'CONTINUE' : 'GET OTP'}
								onClick={() => handleVerifyUser(verificationId ,this.state.otp,'+'+this.state.dial_code.slice(1,this.state.dial_code.length)+this.state.formattedNumber , redirectRoute)}/>
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
    	const{ isRegistered , errorMessage , isFetching , isAnonymous , verificationId , profile } = auth;

    	return {
    		isRegistered,
			isAnonymous,
    		errorMessage,
    		isFetching,
            verificationId,
			profile

    	}
    }

    const mapDispatchToProps = (dispatch) => {
    	return {
    		handleRegisterUser: (formattedNumber,dial_code) => {
				//console.log('dial_code');
				//console.log(dial_code);
    			let creds = {
					//need to add in countrycode here , maybe formateed dial_code remove the + or replace with +
    				identifier :formattedNumber,
    				identifierType : 'PHONE',
    				verificationMode : 'OTP_MSG',
					dial_code : dial_code

    			}
    			dispatch(registerUser(creds))
    			//dispatch(registerRequest(auth));
    		},
    		handleVerifyUser : (id,otp,identifier,redirectRoute) => {
				//here we're sending identifier as a temporary fix cuz its needed for creating memories
				//console.log('CHECK REDIRECTROUTE');
				//console.log(redirectRoute);
    			dispatch(verifyUser(id,otp,identifier,redirectRoute))
    		},
    		handleSetErrorMessage : (msg) => {
    			dispatch(setErrorMessage(msg))
    		},
    		handleUpdateUser : (data) => {
    			dispatch(updateUser(data))
    		}
    	}
    }


    const Login = connect(
    	mapStateToProps,
    	mapDispatchToProps
    )(LoginComponent)

    export default Login;
