import React, { useState } from 'react';
import { Redirect, withRouter} from 'react-router-dom';

import axios from 'axios';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import { authenticate, isAuth } from './Helper';

import 'react-notifications/lib/notifications.css';

import Google from './Google';

const Signin = ({ history }) => {
	// Signup State
	const [ values, setValues ] = useState({
		email: '',
		password: '',
		buttonText: 'Submit',
		thisComponent: 'Signin'
	});

	const { email, password, buttonText, thisComponent } = values;

	const handleChange = (name) => (e) => {
		setValues({ ...values, [name]: e.target.value });
	};

	const informParent = (response) => {
		authenticate(response, () => {
			NotificationManager.success(`Hey ${response.data.user.name}, Welcome back!`);
			isAuth() && isAuth().role === 'admin' ? history.push('/admin') : history.push('/todos');
		});
	};

	const clickSubmit = (e) => {
		e.preventDefault();
		setValues({ ...values, buttonText: 'Submitting' });

		axios
			.post('/api/signin', { email, password })
			.then((response) => {
				// console.log('SIGNIN SUCCESS', response);

				// save the response (user, token) => localStorage/cookie
				authenticate(response, () => {
					setValues({ ...values, email: '', password: '', buttonText: 'Submitted' });
					isAuth() && isAuth().role === 'admin' ? history.push('/admin') : history.push('/todos');
				});
			})
			.catch((error) => {
				// console.log('SIGNIN ERROR', error.response.data);
				setValues({ ...values, buttonText: 'Submit' });
				NotificationManager.error(error.response.data.error);
			});
	};

	const signinForm = () => (
		<form>
			<div className="form-group">
				<label className="text-muted">Email</label>
				<input onChange={handleChange('email')} value={email} type="email" className="form-control" />
			</div>

			<div className="form-group">
				<label className="text-muted">Password</label>
				<input onChange={handleChange('password')} value={password} type="password" className="form-control" />
			</div>

			<div>
				<button className="btn btn-primary" onClick={clickSubmit}>
					{buttonText}
				</button>
			</div>
		</form>
	);

	return (
		<div className="col-md-6 offset-md-3">
			<NotificationContainer />
			{isAuth() ? <Redirect to="/" /> : null}
			<h1 className="p-5 text-center">Signin</h1>

			<div className="p-2 bd-highlight" style={{ justifyContent: 'space-between' }}>
				<Google informParent={informParent} thisComponent={thisComponent} />
			</div>
			{signinForm()}
		</div>
	);
};

export default withRouter(Signin);
