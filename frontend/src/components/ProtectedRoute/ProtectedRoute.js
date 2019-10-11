import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default function ProtectedRoute(ComponentToProtect) {
    return class extends Component {
        constructor() {
            super();
            this.state = {
                loading: true,
                redirect: false,
            };
        }
        
        componentDidMount() {
            axios({
                method: "GET",
                url: 'http://localhost:3000/api/user/verify',
                headers: {
                    "X-ACCESS-TOKEN": cookies.get('token')
                }    
            })
                .then(res => {
                    if (res.status === 200) {
                        this.setState({ loading: false }, () => {
                        });
                    } else {
                        const error = new Error(res.error);
                        throw error;
                    }
                })
                .catch(err => {
                    cookies.remove('token');
                    this.setState({ loading: false, redirect: true });
                });
        }

        render() {
            const { loading, redirect } = this.state;
            if (loading) {
                return null;
            }
            if (redirect) {
                return <Redirect to="/" />;
            }
            return (
                <React.Fragment>
                    <ComponentToProtect {...this.props} />
                </React.Fragment>
            );
        }
    }
}