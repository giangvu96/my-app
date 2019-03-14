import React, {Component} from 'react';
import {Row, Tabs, Col} from 'antd';
import "antd/dist/antd.css";
import Topic from './components/Topic';
import Method from './components/Method';
import logo from './logo.svg';
import './App.css';

const TabPane = Tabs.TabPane;

class App extends Component {
    render() {

        return (
            <div className="App">
                <Row type="flex"
                     className="App-header">
                    <Col span={5}/>
                    <Col span={2}>
                        <img src={logo} className="App-logo" alt="logo"/>
                    </Col>
                    <Col span={10}>
                        <h1>Chương trình tóm tắt đa văn bản</h1>
                    </Col>

                </Row>
                <Row className="App-content">
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="Topic" key="1">
                            <Topic/>
                        </TabPane>
                        <TabPane tab="Method" key="2">
                            <Method/>
                        </TabPane>
                    </Tabs>
                </Row>
            </div>
        );
    }
}

export default App;
