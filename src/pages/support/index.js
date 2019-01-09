
import React, { Component } from 'react';
import Support from '@/components/Support'
import { getSupports } from '@/services/agent';
import { Form, Button, Icon } from 'antd'



@Form.create()
class TestPage extends Component {
  state = {
    test1: '', test2: '', test3: ''
  }
  check = () => {
    const { form } = this.props;
    const { test1, test2, test3 } = form.getFieldsValue()
    console.log('check test1', test1)
    console.log('check test2', test2)
    console.log('check test3', test3)

    this.setState({ test1, test2, test3 })
  }


  render() {
    const { form } = this.props
    const { test1, test2, test3 } = this.state
    const { getFieldDecorator } = form
    return (
      <Form>
        <Form.Item>
          <Support 
            getSupports={getSupports}
            name='test1'
            value={57}
            placeholder='plz select one'
            form={form}
          />
        </Form.Item>
        <Form.Item>
          {
            getFieldDecorator('test2', { initialValue: { key: 86 }})(
              <Support 
                getSupports={getSupports}
                name='test2'
                form={form}
                placeholder='plz select one'
                notFieldDecorator={true}
                labelInValue
              />
            )
          }
        </Form.Item>
        <Form.Item>
          {
            getFieldDecorator('test3')(
              <Support 
                showSearch
                style={{ width: 300 }}
                getSupports={getSupports}
                name='test3'
                form={form}
                notFieldDecorator={true}
                placeholder='plz select one'
                icon='mail'
              />
            )
          }
        </Form.Item>
        <Form.Item label='test1'>{test1}</Form.Item>
        <Form.Item label='test2'>{JSON.stringify(test2)}</Form.Item>
        <Form.Item label='test3'>{JSON.stringify(test3)}</Form.Item>
        <Button onClick={this.check}>Check Vlaue</Button>
        
      </Form>
      
    )
  }
}


export default TestPage;



