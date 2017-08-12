import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'

import Radio from 'antd/lib/radio'
import Select from 'antd/lib/select'
import Table from 'antd/lib/table'
import Popconfirm from 'antd/lib/popconfirm'
import Col from 'antd/lib/col'

import Icon from 'antd/lib/icon'

import message from 'antd/lib/message'
import Spin from 'antd/lib/spin'
import AddModal from './addImgTextModal'
import Auth from 'Application/components/auth'
import safeString from 'safeString'
const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option


@Form.create()
export default class Edit extends React.Component{
	constructor(props, context) {
		super(props, context)
		this.state = {
			ready: false,
			visible: false,
			content: '',
			dataSource: [],
			event_type: '',
			reply_type: '',
			sign_type: '',
			img_url:'',
			info:{}
		}
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}

	componentWillReceiveProps(nextProps) {
		const dataSource = nextProps.info.toJS().content
		if(Object.prototype.toString.call(dataSource) == '[object Array]'){
			dataSource.forEach((item, index) => {
				item.key = index
			})
		}
		if(!this.state.ready) {
			this.setState({
				event_type: nextProps.info.toJS().type,
				reply_type: nextProps.info.toJS().reply_type,
				sign_type: nextProps.info.toJS().sign,
				dataSource: Object.prototype.toString.call(dataSource) == '[object Array]'?dataSource: [],
				content: Object.prototype.toString.call(dataSource) == '[object Array]'?'': dataSource,
				ready: true
			})
		}
	}


	setDataSource(info) {
		const dataSource = this.state.dataSource
		const dataEdit = this.state.info
		if(Object.keys(dataEdit).length > 0) {
			const index = dataSource.findIndex(item => item.key == info.key)
			if(index > -1) dataSource[index] = info
		}else{
			info.key = info.content_txt_pictrue
			dataSource.unshift(info)
		}
		this.setState({
			info: info,
			dataSource: dataSource,
			visible: false
		})
	}

	removeItem(title, dataSource) {
		dataSource = dataSource.filter(item => {
			return item.content_txt_title != title
		})
		this.setState({
			dataSource: dataSource
		})
	}

	changeSort(obj, type) {
		const dataSource = this.state.dataSource
		const index = dataSource.findIndex(item => item.key == obj.key)
		if(index > -1) {
			var z = ''
			if(type == 'up' && index != 0) {
				z = dataSource[index]
				dataSource[index] = dataSource[index - 1]
				dataSource[index - 1] = z
			}
			if(type == 'down' && index != dataSource.length - 1) {
				z = dataSource[index]
				dataSource[index] = dataSource[index + 1]
				dataSource[index + 1] = z
			}
			this.setState({dataSource: dataSource})
		}
		else return
	}

	renderForm() {
		const { getFieldDecorator } = this.props.form
		const editSelect = this.props.editSelect.toJS()
		const info = this.props.info.toJS()
		const toggleModal = (obj, visible, fn) => _ => {
			return this.toggleModal(obj, visible, fn)
		}
		const formItemLayout = {
		    labelCol: { span: 3 },
		    wrapperCol: { span: 12 }
		}

		const keywordProps = getFieldDecorator('keyword', {
			initialValue: info.keyword
		})(
			<Input type="text" readOnly/>
		)

		const signProps = getFieldDecorator('sign', {
			rules: [
				{ required: true,  message: '请选择' }
			],
			initialValue: safeString(info.sign)
		})(
			<RadioGroup disabled>
						{
					editSelect.signType.map(item => {
						return (
									<Radio key={item.id} value={item.id+''}>{item.name}</Radio>
						)
					})
				}
			</RadioGroup>
		)

		const typeProps = getFieldDecorator('type', {
			rules: [
				{ required: true,  message: '请选择' }
			],
			initialValue: safeString(info.type)
		})(
			<Select size="large" placeholder="请选择类型：" disabled>
				{
					editSelect.evenType.map(item => {
						return (
							<Option key={item.id} value={item.id+''}>{item.name}</Option>
						)
					})
				}
			</Select>
		)

		const replyTypeProps = getFieldDecorator('reply_type', {
			rules: [
				{ required: true,  message: '请选择' }
			],
			initialValue: safeString(info.reply_type)
		})(
			<Select size="large" placeholder="请选择类型：" disabled>
				{
					editSelect.replyType.map(item => {
						return (
							<Option key={item.id} value={item.id+''}>{item.name}</Option>
						)
					})
				}
			</Select>
		)

		const sceneProps = getFieldDecorator('scene', {
			initialValue: safeString(info.scene)
		})(
			<Select size="large"  placeholder="请选择类型：" disabled>
				{
					editSelect.sceneList.map(item => {
						return (
							<Option key={item.id} value={item.id+''}>{item.name}</Option>
						)
					})
				}
			</Select>
		)

		const contentProps = getFieldDecorator('content_text', {
			initialValue: this.state.content
		})(
			<Input type="textarea" rows="6" readOnly/>
		)

    const mstchingProps = getFieldDecorator('mstching_type', {
        initialValue: safeString(info.mstching_type)
    })(
			<RadioGroup disabled>
					{
							editSelect.mstchingType.map(item => {
									return (
											<Radio key={item.id} value={item.id+''}>{item.name}</Radio>
									)
							})
					}
			</RadioGroup>
		)

		const imgProps = getFieldDecorator('content_pictrue', {
		})(
			<Select
			showSearch
			optionFilterProp="children"
	notFoundContent="无法找到"
			size="large"
			placeholder="请选择素材："
			>
				{
					editSelect.allImage.map(item => {
						return (
							<Option key={item.media_id} value={item.media_id+''}>{item.name}</Option>
						)
					})
				}
			</Select>
		)
		const groupProps = getFieldDecorator('wechat_group', {
			initialValue: safeString(info.wechat_group)
		})(
			<Select mode='multiple' size="large" placeholder="请选择类型：">
									{groupOptionList}
			</Select>
		)

		const signNameProps = getFieldDecorator('sid', {
			initialValue: safeString(info.sid)
		})(
			<Select size="large"  placeholder="请选择签到名称：" disabled>
				{
					editSelect.signName.map(item => {
						return (
							<Option key={item.id} value={item.id+''}>{item.name}</Option>
						)
					})
				}
			</Select>
		)

		const setImgUrl = (img_url) => {
			this.setState({
		      	content: img_url
		      })
		}

        const groupOptionList = [<Option key="x" value='-1'>全部</Option>]
        editSelect.weixinGroup.map(item => {
            groupOptionList.push(
                <Option key={item.id} value={item.id+''}>{item.name}</Option>
            )
        })

		return(
			<Form layout='horizontal' style={{marginTop: 30}} >

			        <FormItem  {...formItemLayout}  label="事件类型：">
									{typeProps}
		        	</FormItem>
		        	<div hidden={this.state.event_type != 2}>
		        		 <FormItem
				          {...formItemLayout}
				          label="关键字："
				          disabled
				          >
									{keywordProps}
			        	</FormItem>
		        	</div>
		        	<div hidden={this.state.event_type != 4}>
		        		<FormItem  {...formItemLayout} label="场景回复：">
										{sceneProps}
		        		</FormItem>
		        	</div>
		        	<div hidden={this.state.event_type == 4 || this.state.event_type == 1}>
			        	<FormItem   {...formItemLayout} label="微信分组：">
										{groupProps}
			        	</FormItem>
		        	</div>

                    <FormItem
                      {...formItemLayout}
                      label="匹配类型："
                      >
											{mstchingProps}
                    </FormItem>

		        	<FormItem
			          {...formItemLayout}
			          label="签到："
			          >
									{signProps}
			        </FormItem>
			        <div hidden={this.state.sign_type != 1}>
		        		<FormItem  {...formItemLayout} label="签到名称：">
										{signNameProps}
		        		</FormItem>
		        	</div>
		        	<FormItem  {...formItemLayout} label="回复类型：">
									{replyTypeProps}
		        	</FormItem>
		        	<div hidden={this.state.reply_type == 1?false:true}>
			        	<FormItem
				          {...formItemLayout}
				          label="文本内容："
				          >
									{contentProps}
				        </FormItem>
			 		</div>
			 		<div hidden={this.state.reply_type == 2?false:true}>
			        	<FormItem  {...formItemLayout} label="选择图片素材：">
										{imgProps}
		        		</FormItem>
			 		</div>
			 		<div>
			 			{this.renderTable()}
			 		</div>
			         <FormItem {...formItemLayout} style={{marginTop: 20}}>
			        	<Col offset={4}>
			        		<Button type="ghost" style={{width: 100, marginLeft: 40}} onClick={() => { history.back() }}>返回</Button>
	        			</Col>
				     </FormItem>
				</Form>
		)
	}

	renderTable() {
		var  dataSource = this.state.dataSource
		const assetsUrl = this.props.assetsUrl
		const removeItem = (title, dataSource) => _ => {
			return this.removeItem(title, dataSource)
		}
		const toggleModal = (info, visible, cb) => _ => {
			return this.toggleModal(info, visible, cb)
		}
		const changeSort = (obj, type) => _ => {
			return this.changeSort(obj, type)
		}
		const columns = [{
			title: '标题',
			dataIndex: 'content_txt_title',
			key: 'content_txt_title'
		}, {
			title: '图片地址',
			dataIndex: 'content_txt_pictrue',
			key: 'content_txt_pictrue',
			render(img) {
                img = img.match(/(http|https):\/\//g) ? img : assetsUrl + img
				return(
					<div><img className='head-img' src={img}/></div>
				)
			}
		}, {
			title: '链接地址',
			dataIndex: 'content_txt_url',
			key: 'content_txt_url',
		}, {
			title: '排序',
			key: 'sort',
			render(status, obj) {
				return(
					<div>
						<div><a><Icon onClick={changeSort(obj, 'up')} type="caret-up"/></a></div>
						<div><a><Icon onClick={changeSort(obj, 'down')} type="caret-down"/></a></div>
					</div>
				)
			}
		}, {
			title: '描述',
			dataIndex: 'content_txt_description',
			key: 'content_txt_description',
		}, {
			title: '操作',
			key: 'operation',
			render(_, obj) {
				return (
					<div>
						<span style={{marginLeft: 5}}>-</span>
						<span style={{marginLeft: 5}}>-</span>
					</div>
				)
			}
		}]

		return (
			<div hidden={this.state.reply_type != 3} >
				<Table
					columns={columns}
					dataSource={this.state.dataSource}
					pagination={false}
				/>
			</div>
		)
	}
	render() {
		return (
			<div>
				<Spin spinning={!this.state.ready}>
					{this.renderForm()}
				</Spin>
			</div>
		)
	}
}
