    import fetch from 'isomorphic-fetch';
    import apiUrl from '../config/config';
	import { browserHistory } from 'react-router';


    //todo get user , memories only if needed , need to make a separate thunk for this
    //actions types
    const DO_SOMETHING = 'DO_SOMETHING';
    const FETCH_MEMORIES = 'FETCH_MEMORIES';
    const FETCH_MEMORIES_SUCCESS = 'FETCH_MEMORIES_SUCCESS';
    const FETCH_MEMORIES_FAIL = 'FETCH_MEMORIES_FAIL';
    const RECEIVE_MEMORIES = 'RECEIVE_MEMORIES';

	const LOGOUT_USER = 'LOGOUT_USER';

    const REGISTER_USER = 'REGISTER_USER';
    const REGISTER_REQUEST = 'REGISTER_REQUEST';
    const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
    const REGISTER_FAIL = 'REGISTER_FAIL';
    const VERIFY_USER = 'VERIFY_USER';
    const VERIFY_REQUEST = 'VERIFY_REQUEST';
    const VERIFY_SUCCESS = 'VERIFY_SUCCESS';
    const VERIFY_FAIL = 'VERIFY_FAIL';
    const SET_ERROR_MESSAGE = 'SET_ERROR_MESSAGE';


    /*
    // API CALLS  => ASYNC ACTIONS
    consider using redux-sagas
    {
    type : 'FETCH_MEMORIES',
    id : memoryId
    }

    {
    type: 'REGISTER_USER',
    creds: {
    	identifier:"",
    	identifierType:"PHONE",
    	verificationMode:"OTP_MSG"
    }
    }

    */



    //action creators

    const doSomething = (text) => {
        return {
            type: 'DO_SOMETHING',
            text: text
        }
    }
    const validateCredentials = (creds) => {
        console.log('TRUTH');
		//DEMO CASE
		if(creds.identifier == '5555555551'){
			return '';
		}
		//DEMO CASE END
        if(creds.identifier == null || creds.identifier == '' ){
            return '*required field';
        }
        let phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
        let phoneNumber = phoneUtil.parse(creds.identifier, 'IN');
        let truth =  phoneUtil.isValidNumber(phoneNumber);
        console.log(truth);
        console.log(phoneUtil.format(phoneNumber, phoneUtil.INTERNATIONAL));
        if(truth){
            return '';
        }else {
            return 'check your number';

        }
        //dispatch error message action
    }
    // Meet our first thunk action creator!
    // Though its insides are different, you would use it just like any other action creator:
    // store.dispatch(fetchPosts('reactjs'))
    const registerUser = (creds) => {
        /*	return async action */

        console.log(creds);
        let validation='';


        return dispatch => {
            // We dispatch requestLogin to kickoff the call to the API . THIS WILL DEPEND ON THE AUTH FLOW WE DECIDE EVENTUALLY , JUST REGISTER_USER FOR NOW.

            dispatch(registerRequest(creds));
            validation = validateCredentials(creds);
            console.log(validation);
            if(validation == ''){

            }else{
                //don't executr if validation fails
                dispatch(registerFail(validation));
                return;
            }
            let config = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: 'identifier='+'%2b91'+creds.identifier+'&identifierType='+creds.identifierType+'&verificationMode='+creds.verificationMode
            }
            let url = apiUrl + '/register.json';

            return fetch(url, config)
    		.then((response) => response.json())
                .then((json) => {
    				console.log(json);
                    if (!json.verificationId) {
                        //ideally see what the server sends
                        dispatch(registerFail('invalid number'));
                    } else {
                        console.log('VERIFICATION ID RECEIVED');
                        console.log(json.verificationId);
                        dispatch(registerSuccess(json.verificationId));
                        //dispatch(verifyUser(json.verificationId));
                        //need to send verifyuser request
                    }
                })
    			.catch((json) => {
    				console.log(json);
                    dispatch(registerFail('network error'));
    			})

        }

    }

    const registerRequest = (data) => {
        // return async action using thunk middleware
        return {
            type: REGISTER_REQUEST,
            data: data
        }

    }


    const getUserProfile = (data) => {
        //use this function to fetch user data when authToken is already present on initial page load
        //save this data as auth
    }

    const registerSuccess = (id) => {
        return {
            type: REGISTER_SUCCESS,
            id: id
        }
    }

    const registerFail = (msg) => {
        return {
            type: REGISTER_FAIL,
            errMsg: msg
        }
    }

    const setErrorMessage = (msg) => {
        return {
            type: SET_ERROR_MESSAGE,
            errMsg: msg
        }
    }

    const verifyRequest = (data) => {
        //update state , actual network call made in verifyUser()
        return {
            type: VERIFY_REQUEST,
            data: data
        }

    }

    const verifySuccess = (data) => {
        return {
            type: VERIFY_SUCCESS,
            data: data
        }

    }

    const verifyFail = (msg) => {
        return {
            type: VERIFY_FAIL,
            error: msg
        }
    }


    const verifyUser = (id,otp) => {
        console.log('VERIFY_USER');
        let url = apiUrl + '/verify/' + id + '.json';
        let config = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'otp='+otp
        }
        return dispatch => {
            //dispatch() dispatch requestverify
            return fetch(url, config)
			.then((response) => response.json())
                .then((json) => {
                    if (json.authToken) {
                        dispatch(verifySuccess(json));
						browserHistory.replace('/authenticated');
                    } else {
                        dispatch(verifyFailed(json));
                    }
                })
        }

    }

	const logOutUser = () => {
		//Need to remove token from localStorage
		return {
			type: LOGOUT_USER
		}
	}



    const fetchMemories = (token) => {
		//needs to be an async action
        return {
            type: FETCH_MEMORIES,
			token : token

        }
    }

	const fetchmemories = (memoryId) => {
		//gotta set the url ad config and makesure auth header has been set
		return dispatch => {
			return fetch(url , config)
			.then((response) => response.json())
			.then((json) => {
				dispatch(fetchMemoriesSuccess(json));
			})
			.catch((json) => {
				dispatch(fetchMemoriesFail(json));

			})
		}
	}

    const receiveMemories = (json) => {
        return {
            type: RECEIVE_MEMORIES,
            memories: json
        }
    }

    //export action creator and call like dispatch(actionCreator(a,b))
    //eventually move all action names into constants
    export {
        doSomething,
    	registerUser,
        registerRequest,
        registerFail,
        registerSuccess,
        verifyUser,
        verifyFail,
        verifySuccess,
        setErrorMessage,
		fetchMemories,
		receiveMemories,
		logOutUser
    };
