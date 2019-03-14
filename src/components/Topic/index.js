import React from 'react';
import {Button, Col, Collapse, Row, Select, Table, Tag} from 'antd';
import './style.less';

const Panel = Collapse.Panel;
const Option = Select.Option;
const color_text = {
    1: "red",
    2: "orange",
    3: "yellow",
    4: "green",
    5: "blue",
    0: ""
};

class Topic extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            method: "MMR",
            topic: "1",
            documents: {
                1: "",
            },
            human_summary: {
                1: "",
            },
            result: "",
            rouge: "",
            type_rouge: "topic",

        };
    }

    getTopic() {
        const topic = this.state.topic;
        const url = 'http://202.191.57.85:5000/api/v1/resources/topic?topic_id=' + topic.toString();
        fetch(url).then((result) => {
            return result.json();
        }).then((jsonResult) => {
            this.setState({
                documents: jsonResult.document,
                human_summary: jsonResult.human,
            })
        });
    }

    handleChangeTopic(value) {
        this.setState({topic: value});

    }

    handleChangeMethod(value) {
        this.setState({method: value});

    }

    handleChangeTypeRouge(value) {
        this.setState({type_rouge: value});

    }

    handleGetResultByMethod() {
        const {method, topic} = this.state;
        const url = 'http://202.191.57.85:5000/api/v1/resources/result_topic?topic_id=' + topic.toString() + '&method=' + method.toString();
        fetch(url).then((result) => {
            return result.json();
        }).then((jsonResult) => {
            this.setState({
                result: jsonResult,
            })
        });

        const url_topic = 'http://202.191.57.85:5000/api/v1/resources/topic_method?topic_id=' + topic.toString() + '&method=' + method.toString();
        fetch(url_topic).then((result) => {
            return result.json();
        }).then((jsonResult) => {
            this.setState({
                documents: jsonResult.document,
            })
        });
    }

    handleGetRouge = () => {
        const {method, topic, type_rouge} = this.state;
        const url = 'http://202.191.57.85:5000/api/v1/resources/rouge_average?method=' + method + '&type=' + type_rouge + '&id=' + topic;
        fetch(url).then((result) => {
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

    renderTopicOption = () => {
        const array = [];
        for (var i = 0; i < 200; i++) {
            array.push(i + 1)
        }
        delete array[177];

        return <Select defaultValue="1" style={{width: 100}}
                       onChange={this.handleChangeTopic.bind(this)}>
            {
                array.map(number => <Option key={number} value={number}>{number}</Option>)
            }
        </Select>

    };

    renderInputDocument = (key, value) => {
        let text = [];
        if (typeof value == "object") {
            text = value
        }
        const header = "Bài báo " + key;
        return (<Panel key={key} header={header}>
            <Row type="flex" align="middle">
                <p>
                    {text.map(([weight, sentence], index) => {
                            const styles = {
                                color: color_text[weight]
                            };
                            return <React.Fragment key={index}>
                                <span style={styles}>{sentence + ' '}</span>
                            </React.Fragment>
                        }
                    )}
                </p>
            </Row>
        </Panel>)
    };

    renderHumanSumary = (key, value) => {
        const header = "Người thứ " + key;
        return (<Panel key={key} header={header}>
            <Row key={key} type="flex" align="middle">
                <p>{value}</p>
            </Row>
        </Panel>)
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

    renderRougeOption = () => (
        <Select defaultValue="topic" style={{width: 100}}
                onChange={this.handleChangeTypeRouge.bind(this)}>
            <Option value="topic">Topic</Option>
            <Option value="all">All</Option>
        </Select>
    );

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

    renderNote = () => {
        const columns = [
            {
                title: 'Level',
                dataIndex: 'level',
                key: 'level',
                render: text => <a href="javascript:;">{text}</a>,
            },
            {
                title: 'Color',
                dataIndex: 'tag',
                key: 'tag',
                render: tag => (
                    <span>
                  <Tag color={color_text[tag]} key={tag}>{'color'.toUpperCase()}</Tag>
                </span>
                ),
            }
        ];

        const data = [
            {
                key: '1',
                level: '1',
                tag: 1,
            },
            {
                key: '2',
                level: '2',
                tag: 2,
            },
            {
                key: '3',
                level: '3',
                tag: 3,
            },
            {
                key: '4',
                level: '4',
                tag: 4,
            },
            {
                key: '5',
                level: '5',
                tag: 5,
            }
        ];
        return <Table className="level" columns={columns} dataSource={data} pagination={false}/>

    };


    render() {
        return (
            <Row>
                <Row type="flex" align="top">
                    <Col span={6}>
                        <Row type="flex" align="middle">
                            <Col span={9}>
                                Topic:
                            </Col>
                            <Col span={15}>
                                {this.renderTopicOption()}
                            </Col>
                        </Row>

                        <Row type="flex" align="middle">
                            <Col span={9}/>
                            <Col span={15}>
                                <Button type="primary" onClick={this.getTopic.bind(this)}>Download</Button>
                            </Col>
                        </Row>

                        <Row type="flex" align="middle">
                            <Col span={9}>
                                Phương pháp:
                            </Col>
                            <Col span={15}>
                                {this.renderMethodOption()}
                            </Col>

                        </Row>

                        <Row type="flex" align="middle">
                            <Col span={9}/>
                            <Col span={15}>
                                <Button type="primary" onClick={this.handleGetResultByMethod.bind(this)}>Thực
                                    hiện</Button>
                            </Col>
                        </Row>
                        <Row style={{padding: "20px"}}>
                            {this.renderNote()}
                        </Row>


                    </Col>
                    <Col span={18}>
                        <Row>
                            <Row type="flex" align="middle">
                                <Col span={20}>
                                    Đầu vào tóm tắt:
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
                            </Row>
                            <Collapse>
                                {Object.entries(this.state.human_summary).map(array => this.renderHumanSumary(array[0], array[1]))}
                            </Collapse>

                        </Row>

                        <Row>
                            <Collapse>
                                <Panel header="Kết quả tóm tắt của hệ thống:">
                                    <Row type="flex" align="middle">
                                        <p>{this.state.result}</p>
                                    </Row>
                                </Panel>
                            </Collapse>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col span={6}>
                        <Row type="flex" align="middle" justify="center">
                            {this.renderRougeOption()}
                        </Row>
                        <Row type="flex" align="middle" justify="center">
                            <Button type="primary" onClick={this.handleGetRouge.bind(this)}>Tính rouge</Button>
                        </Row>
                    </Col>
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

export default Topic;
