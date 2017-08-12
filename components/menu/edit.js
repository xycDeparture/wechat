
import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'


import Select from 'antd/lib/select'
import Col from 'antd/lib/col'



const FormItem = Form.Item
const Option = Select.Option


export default class AddMenuComp extends React.Component {
	constructor(props, context) {
		super(props, context)
	}

	render() {

		const formItemLayout = {
		    labelCol: { span: 3 },
		    wrapperCol: { span: 8 }
		}

		return(
			<Form style={{marginTop: 40}} layout='horizontal'>
				<FormItem {...formItemLayout} label="公众号：">
					<Input type="text" defaultValue="加州O2O网点" disabled/>
				</FormItem>
				<FormItem {...formItemLayout} label="名称：">
					<Input type="text"/>
				</FormItem>
				<FormItem  {...formItemLayout} label="类型：">
    	        	<Select  {...typeProps} placeholder="请选择类型" style={{ width: 180 }}>
    	        		{
    	        			this.props.select.map(item => {
    	        				return <Option value={item.key}>{item.value}</Option>
    	        			})
    	        		}
    	        	</Select>
		        </FormItem>
				<FormItem {...formItemLayout} label="内容：">
					<Input type="text"/>
				</FormItem>
				<FormItem {...formItemLayout} label="排序：">
					<Input type="text"/>
				</FormItem>
			    <FormItem  {...formItemLayout}>
		        	<Col offset="9">
        	        	<Button type="primary" size="large">确定</Button>
        	        	<Button type="ghost" size="large"style={{ marginLeft: 40 }}>重置</Button>
        			</Col>
		        </FormItem>
			</Form>
		)
	}
}
