import React, { Component } from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { withRouter } from "react-router-dom";

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

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleAddTask() {
        if (this.state.newTask !== "" && this.state.newTask !== null && this.state.newTask !== undefined && this.state.newTask.length > 0) {
            let task = [...this.state.tasks, this.state.newTask];
            this.setState({
                tasks: task,
                newTask: ""
            });
        }
    }

    handleDeleteTask(index) {
        let tasks = this.state.tasks;
        tasks.splice(index, 1);
        this.setState({
            tasks: tasks
        });
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
                                                {this.state.tasks.map((task, index) => {
                                                    return (
                                                        <Col xs={12} className="text-left mt-1 mb-1" key={index}>
                                                            <Card className="p-3">
                                                                <Row className="align-items-center justify-content-center">
                                                                    <Col xs={8}>
                                                                        {task}
                                                                    </Col>
                                                                    <Col xs={4}>
                                                                        <Button variant="danger" size="sm" block onClick={() => this.handleDeleteTask(index)}>Delete</Button>
                                                                    </Col>
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