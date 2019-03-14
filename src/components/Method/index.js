import React from 'react';
import { Button, Col, Collapse, Input, Row, Select, Table, InputNumber } from 'antd';

import './style.less';

const {TextArea} = Input;
const Panel = Collapse.Panel;
const Option = Select.Option;

/* eslint-disable react/prefer-stateless-function */
class Method extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            method: "MMR",
            length: 80,
            documents: {
                1: "",
            },
            human_summary: {
                1: "",
            },
            result: "",
            rouge: "",
        };
        this.handleChangeHumanSumary.bind(this);
        this.handleChangeInputDocument.bind(this);
        this.handleLength.bind(this);
        this.handleChangeInputResult.bind(this);
        this.handleGetRouge.bind(this);
    }

    handleChangeMethod(value) {
        this.setState({method: value});

    }

    handleAddDocument = () => {
        let keys = Object.keys(this.state.documents);
        let newObject = Object.assign({}, this.state.documents);
        newObject[parseInt(keys[keys.length - 1]) + 1] = "";
        this.setState({
            documents: newObject,
        })
    };

    handleRemoveDocument = () => {
        let keys = Object.keys(this.state.documents);
        if (keys.length > 1) {
            let newObject = Object.assign({}, this.state.documents);
            delete newObject[parseInt(keys[keys.length - 1])];
            this.setState({
                documents: newObject,
            })
        }

    };

    handleAddHuman = () => {
        let keys = Object.keys(this.state.human_summary);
        let newObject = Object.assign({}, this.state.human_summary);
        newObject[parseInt(keys[keys.length - 1]) + 1] = "";
        this.setState({
            human_summary: newObject,
        })
    };

    handleRemoveHuman = () => {
        let keys = Object.keys(this.state.human_summary);
        if (keys.length > 1) {
            let newObject = Object.assign({}, this.state.human_summary);
            delete newObject[parseInt(keys[keys.length - 1])];
            this.setState({
                human_summary: newObject,
            })
        }

    };

    handleGetResultByMethod  = () => {
        const { method, length } = this.state;
        const url = 'http://202.191.57.85:5000/api/v1/resources/result_custom?method=' + method.toString() + '&length=' + length;

        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                documents: this.state.documents,
            })
        }).then((result) => {
            return result.json();
        }).then((jsonResult) => {
            this.setState({
                result: jsonResult,
            })
        });
    };

    handleGetRouge = () => {
        const url = 'http://202.191.57.85:5000/api/v1/resources/rouge_custom';

        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                human: this.state.human_summary,
                system: this.state.result,
            })
        }).then((result) => {
            return result.json();
        }).then((jsonResult) => {
            this.setState({
                rouge: {
                    rouge_1: jsonResult['rouge_1'],
                    rouge_2: jsonResult['rouge_2'],
                },
            })
        });
    };

    handleChangeHumanSumary = (key, event) => {
        let newObject = Object.assign({}, this.state.human_summary);
        newObject[key] = event.target.value;
        this.setState({
            human_summary: newObject,
        });
    };

    handleChangeInputDocument = (key, event) => {
        let newObject = Object.assign({}, this.state.documents);
        newObject[key] = event.target.value;
        this.setState({
            documents: newObject,
        });
    };

    handleChangeInputResult = (event) => {
        this.setState({
            result: event.target.value,
        });
    };

    handleLength = (value) => {
        this.setState({
            length: value,
        });
    };

    renderMethodOption = () => (
        <Select defaultValue="MMR" style={{width: 100}}
                onChange={this.handleChangeMethod.bind(this)}>
            <Option value="MMR">MMR</Option>
            <Option value="LexRank">LexRank</Option>
            <Option value="TextRank">TextRank</Option>
            <Option value="NMF">NMF</Option>
        </Select>
    );

    renderLength = () => (
        <InputNumber min={10} max={200} defaultValue={this.state.length} onChange={(value) => this.handleLength(value)} />
    );

    renderInputDocument = (key, value) => {
        const header = "Bài báo " + key;
        return (<Panel key={key} header={header}>
            <Row type="flex" align="middle">
                <TextArea value={value} rows={6} onChange={(event) => this.handleChangeInputDocument(key, event)}/>
            </Row>
        </Panel>)
    };

    renderHumanSumary = (key, value) => {
        const header = "Người thứ " + key;
        return (<Panel key={key} header={header}>
            <Row key={key} type="flex" align="middle">
                <TextArea value={value} rows={6} onChange={(event) => this.handleChangeHumanSumary(key, event)}/>
            </Row>
        </Panel>)
    };

    renderRouge = (i) => {
        const rouge = this.state.rouge;
        if (rouge === "") {
            return <p/>
        }
        let data2 = [];
        if (i === 1) {
            data2 = rouge.rouge_1;
        } else {
            data2 = rouge.rouge_2;

        }
        const columns = [{
            title: 'precision',
            dataIndex: 'precision',
            key: 'precision',
        }, {
            title: 'recall',
            dataIndex: 'recall',
            key: 'recall',
        }, {
            title: 'f1',
            dataIndex: 'f1',
            key: 'f1',
            render: text => <a href="javascript:;">{text}</a>,
        }];
        return <Table columns={columns} dataSource={[data2]} pagination={false}/>
    };

    render() {

        return (
            <Row>
                <Row type="flex" align="top">
                    <Col span={6}>
                        <Row type="flex" align="middle">
                            <Col span={9}>
                                Phương pháp:
                            </Col>
                            <Col span={15}>
                                {this.renderMethodOption()}
                            </Col>

                        </Row>
                        <Row type="flex" align="middle">
                            <Col span={9}>
                                Độ dài:
                            </Col>
                            <Col span={15}>
                                {this.renderLength()}
                            </Col>

                        </Row>

                        <Row type="flex" align="middle" style={{marginBottom: "50px"}}>
                            <Col span={9}/>
                            <Col span={15}>
                                <Button type="primary" onClick={this.handleGetResultByMethod.bind(this)}>Tóm tắt</Button>
                            </Col>
                        </Row>

                    </Col>

                    <Col span={18}>
                        <Row>
                            <Row type="flex" align="middle">
                                <Col span={20}>
                                    Đầu vào tóm tắt:
                                </Col>
                                <Col span={2}>
                                    <Button type="primary" onClick={this.handleAddDocument.bind(this)}>Thêm</Button>
                                </Col>

                                <Col span={2}>
                                    <Button type="primary" onClick={this.handleRemoveDocument.bind(this)}>Bớt</Button>
                                </Col>
                            </Row>
                            <Collapse>
                                {Object.entries(this.state.documents).map(array => this.renderInputDocument(array[0], array[1]))}
                            </Collapse>
                        </Row>

                        <Row>
                            <Row type="flex" align="middle">
                                <Col span={20}>
                                    Kết quả tóm tắt của con người:
                                </Col>
                                <Col span={2}>
                                    <Button type="primary" onClick={this.handleAddHuman.bind(this)}>Thêm</Button>
                                </Col>

                                <Col span={2}>
                                    <Button type="primary" onClick={this.handleRemoveHuman.bind(this)}>Bớt</Button>
                                </Col>
                            </Row>
                            <Collapse>
                                {Object.entries(this.state.human_summary).map(array => this.renderHumanSumary(array[0], array[1]))}
                            </Collapse>

                        </Row>

                        <Row>
                            <Collapse>
                                <Panel header="Kết quả tóm tắt của hệ thống:">
                                    <Row type="flex" align="middle">
                                        <TextArea value={this.state.result} rows={6} onChange={(event) => this.handleChangeInputResult(event)}/>
                                    </Row>
                                </Panel>
                            </Collapse>
                        </Row>


                    </Col>

                </Row>
                <Row>
                    <Col span={6}>
                        <Row type="flex" align="middle" justify="center">
                            <Button type="primary" onClick={this.handleGetRouge.bind(this)}>Tính rouge</Button>
                        </Row></Col>
                    <Col span={18}>
                        <Collapse>
                            <Panel header="Rouge-1">
                                <Row type="flex" align="middle">
                                    {this.renderRouge(1)}
                                </Row>
                            </Panel>
                            <Panel header="Rouge-2">
                                <Row type="flex" align="middle">
                                    {this.renderRouge(2)}
                                </Row>
                            </Panel>
                        </Collapse>
                    </Col>
                </Row>
            </Row>
        );
    }
}

export default Method;
