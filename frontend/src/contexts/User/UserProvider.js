import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import axios from "axios";
import Cookies from 'universal-cookie';

import UserContext from "./UserContext";

const cookies = new Cookies();

class UserProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            
            name: null
        }
    }

    componentDidMount() {
        if(cookies.get('token') !== null) {
            axios({
                method: 'GET',
                url: "http://localhost:3000/api/user/whoami",
                headers: {
                    'X-ACCESS-TOKEN': cookies.get('token')
                },
                withCredentials: true
            })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            isLoggedIn: true,
                            name: response.data.result
                        });
                    } else {
                        alert(response.data.message);
                        this.props.history.push('/');
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        }
    }

    render() {
        return (
            <UserContext.Provider
                value={{
                    isLoggedIn: this.state.isLoggedIn,
                    name: this.state.name,
                    handleLogin: data => {
                        axios({
                            method: 'POST',
                            url: "http://localhost:3000/api/user/login",
                            data: data,
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            withCredentials: true
                        })
                            .then(response => {
                                if (response.status === 200) {
                                    this.setState({
                                        isLoggedIn: true
                                    }, () => {
                                        this.props.history.push('/dashboard');
                                    });
                                } else {
                                    alert(response.data.message);
                                }
                            })
                            .catch(error => {
                                alert(error.data.message);
                            })
                    },
                    handleLogout: data => {
                        cookies.remove('token');
                        this.props.history.push('/');
                    }
                }}
            >
                {this.props.children}
            </UserContext.Provider>
        );
    }
}

export default withRouter(UserProvider);