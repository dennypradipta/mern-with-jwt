import React, { Component } from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { withRouter } from "react-router-dom";
import Axios from "axios";


import UserContext from "../contexts/User/UserContext";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute"
import Form from 'react-bootstrap/Form';


class TodoPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            newTask: ""
        }
    }

    async componentDidMount() {
        try {
            const response = await Axios({
                method: 'GET',
                url: `http://localhost:3000/api/todo`,
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            this.setState({
                tasks: response.data
            })
        } catch (e) {
            alert(e.message)
        }
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    async handleAddTask() {
        if (this.state.newTask !== "" && this.state.newTask !== null && this.state.newTask !== undefined && this.state.newTask.length > 0) {
            try {
                const response = await Axios({
                    method: 'POST',
                    url: "http://localhost:3000/api/todo/add",
                    data: {
                        task: this.state.newTask
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                });
                let task = [...this.state.tasks, response.data];
                this.setState({
                    tasks: task,
                    newTask: ""
                });
            } catch (e) {
                alert(e.message);
                return;
            }

        }
    }


    async handleUpdateTask(id) {
        if (this.state.editableTask !== "" && this.state.editableTask !== null && this.state.editableTask !== undefined && this.state.editableTask.length > 0) {
            try {
                const response = await Axios({
                    method: 'PATCH',
                    url: `http://localhost:3000/api/todo/edit/${id}`,
                    data: {
                        task: this.state.editableTask
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                });
                let task = this.state.tasks.map((task) => {
                    if (task._id === id) {
                        return {
                            ...response.data,
                        }
                    }
                    return task
                })
                this.setState({
                    tasks: task,
                    newTask: "",
                    editable: "",
                    editableTask: ""
                });
            } catch (e) {
                alert(e.message);
                return;
            }

        }
    }

    async handleDeleteTask(taskId) {
        try {
            const response = await Axios({
                method: 'DELETE',
                url: `http://localhost:3000/api/todo/delete/${taskId}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            let tasks = this.state.tasks.filter(({ _id }) => taskId !== _id);
            this.setState({
                tasks: tasks
            });
        } catch (e) {
            alert(e.message);
            return;
        }

    }

    _viewTask = (task, _id) => {
        return (
            <>
                <Col onDoubleClick={() => { this.setState({ editable: _id, editableTask: task }) }} xs={8}>
                    {task}
                </Col>
                <Col xs={4}>
                    <Button variant="danger" size="sm" block onClick={() => this.handleDeleteTask(_id)}>Delete</Button>
                </Col>
            </>
        )
    }

    _editTask = (task, _id) => {
        return (
            <>
                <Col onDoubleClick={() => { this.setState({ editable: _id }) }} xs={8}>
                    <Form.Control name="editableTask" placeholder="Call Fransiska after meeting" onChange={(e) => this.handleChange(e)} value={this.state.editableTask}></Form.Control>
                </Col>
                <Col xs={4}>
                    <Button variant="primary" size="sm" block onClick={() => this.handleUpdateTask(_id)}>Update</Button>
                </Col>
            </>
        )
    }

    render() {
        return (<>
            <UserContext.Consumer>
                {context => (
                    <Container>
                        <Row className="full-height align-items-center justify-content-center">
                            <Col xs={12} sm={8} md={6} lg={6}>
                                <Card>
                                    <Card.Header className="text-center">
                                        <Row className="align-items-center justify-content-center">
                                            <Col xs={2} className="p-0">

                                            </Col>
                                            <Col xs={8} className="p-0">
                                                Welcome, {context.name}
                                            </Col>
                                            <Col xs={2} className="p-0">
                                                <Button size="sm" variant="danger" onClick={() => context.handleLogout()}>Logout</Button>
                                            </Col>
                                        </Row></Card.Header>
                                    <Card.Body className="text-center px-5">
                                        <p>What are you going to do today?</p>
                                        <Form>
                                            <Row>
                                                <Col className="mt-1 mb-1">
                                                    <Card className="p-3">
                                                        <Row>
                                                            <Col xs={8}>
                                                                <Form.Control name="newTask" placeholder="Call Fransiska after meeting" onChange={(e) => this.handleChange(e)} value={this.state.newTask}></Form.Control>
                                                            </Col>
                                                            <Col xs={4}>
                                                                <Button block onClick={() => this.handleAddTask()}>Add</Button>
                                                            </Col>
                                                        </Row>
                                                    </Card>
                                                </Col>
                                                {this.state.tasks.map(({ task, _id }, index) => {
                                                    return (
                                                        <Col xs={12} className="text-left mt-1 mb-1" key={_id}>
                                                            <Card className="p-3">
                                                                <Row className="align-items-center justify-content-center">
                                                                    {this.state.editable === _id ? this._editTask(task, _id) : this._viewTask(task, _id)}
                                                                </Row>
                                                            </Card>
                                                        </Col>
                                                    );
                                                })}
                                            </Row>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                )}
            </UserContext.Consumer>
        </>);
    }
}

export default withRouter(ProtectedRoute(TodoPage));