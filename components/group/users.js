import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'
import Button from 'antd/lib/button'
import Modal from 'antd/lib/modal'
import message from 'antd/lib/message'
import Form from 'antd/lib/form'
import Key from 'Application/decorators/key'
import Select from 'antd/lib/select'
import EditModal from './user_editModal'
import Auth from 'Application/components/auth'

const Option = Select.Option
const FormItem = Form.Item

@Key(['users'])
@Form.create()
export default class GroupComp extends  React.Component {
	constructor(props, context) {
		super(props, context)
		this.state = {
			psize: 10,
			info: {},
			group: 1,
			visible_1: false,
			visible_2: false
		}
	}

	static propTypes= {
		params: PropTypes.instanceOf(Immutable.Map).isRequired,
		users: PropTypes.instanceOf(Immutable.List).isRequired,
		actions: PropTypes.object.isRequired
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}

	toggleModal(info, visible, group, cb) {
		if(visible == 'visible_2') this.props.form.resetFields()
		if(info) {
			if(cb) {
				cb(info)
			}
			this.setState({
				[visible]: !this.state[visible],
				info: info,
				group: group
			})
		}else{
			this.setState({
				[visible]: !this.state[visible],
			})
		}
	}

	changeGroup(userid, groupid) {
		this.props.actions.updateWechatGroup(userid, groupid).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({ visible_1: false })
			this.props.actions.fetchUserGroupList(this.context.location.query)
		})
	}

	changeVirtualGroup(userid, groupid) {
		this.props.actions.updateVirtualGroup(userid, groupid).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({ visible_1: false,  info: resolve.result})
			this.props.actions.fetchUserGroupList(this.context.location.query)
		})
	}

	handlePageChange(nextPage) {
		const query = this.context.location.query
		query.page = nextPage
		query.psize = this.state.psize
		this.context.router.push({
			pathname: '/wechat/group/users',
			query: query
		})
		this.props.actions.fetchUserGroupList(query)
	}

	checkUser(obj) {
		this.context.router.push({
			pathname: '/wechat/user/check',
			query: {id: obj.id}
		})
	}

	cancelWechatUser() {
		const dataSource = this.props.users.toJS().filter(item => item.subscribe)
		var ids = this.props.form.getFieldValue('ids')
		var openids = []
		ids.forEach(item => {
			dataSource.forEach(item1 => {
				if(item == item1.id){
					openids.push(item1.openid)
				}
			})
		})
    	this.props.form.validateFields((errors, values) => {
    		const gid = this.context.location.query.gid+''
    		this.props.actions.cancelWechatUser({ids, openids, gid}).then(resolve => {
				message.success(resolve.errormsg)
				this.setState({
					visible_2: false
				})
				this.props.actions.fetchUserGroupList(this.context.location.query)
			}).catch(reject => {
				message.error(reject.err.errormsg)
			})
    	})
	}


	handlePageSizeChange(current, pageSize) {
		const query = this.context.location.query
		query.page = current
		query.psize = pageSize
		this.setState({
			psize: pageSize
		})
		this.props.actions.fetchUserGroupList(query)
	}

	renderPullUserModal() {
		const { getFieldDecorator } = this.props.form
		const dataSource = this.props.users.toJS().filter(item => item.subscribe)
		const select = this.props.select.toJS().weixinGroup
		const formItemLayout = {
			labelCol: {
				span: 4
			},
			wrapperCol: {
				span: 18
			}
		}
		const content = (
			<Form layout='horizontal' >
		        <FormItem
		          {...formItemLayout}
		          label="用户："
		          disabled
		          hasFeedback
		          >
							{
								getFieldDecorator('ids')(
									<Select
										placeholder="请选择用户"
										mode='multiple'
									>
										{
											dataSource.map(item => {
												return(
													<Option value={item.id+''} key={item.id+''}>{item.nickname}</Option>
												)
											})
										}
									</Select>
								)
							}
		        </FormItem>
			</Form>
		)
		return(
			<Modal
				title='批量取消标签'
				visible={this.state.visible_2}
				cancelText='返回'
				onCancel={this.toggleModal.bind(this, undefined, 'visible_2')}
				onOk={::this.cancelWechatUser}
			>
				{content}
			</Modal>
		)
	}

	renderTable() {
		const dataSource = this.props.users.toJS()
		const params = this.props.params.toJS()
		const toggleModal = (obj, visible, fn) => _ => {
			return this.toggleModal(obj, visible, fn)
		}
		const checkUser = obj => _ => {
			return this.checkUser(obj)
		}
		const columns = [{
			title: '公众号',
			dataIndex: 'acid_name',
			key: 'acid_name'
		}, {
			title: '昵称',
			dataIndex: 'nickname',
			key: 'nickname'
		}, {
			title: '手机号',
			dataIndex: 'mobile',
			key: 'mobile',
		}, {
			title: '校验',
			dataIndex: 'mobile_check',
			key: 'mobile_check',
			render(mobile_check) {
				const icon = mobile_check === ''? 'cross': 'check'
				return (
					<Icon type={icon}/>
				)
			}
		}, {
			title: '操作',
			key: 'operation',
			render(_, obj) {
				return (
					<div>
                        <Auth type={["wechat-user-check"]}>
                            <a onClick={checkUser(obj)}>查看</a>
                        </Auth>
						<span style={{marginLeft: 10}}></span>
                        <Auth type={["wechat-user-update"]}>
                            <a onClick={toggleModal(obj, 'visible_1', 1)}>修改微信分组</a>
                        </Auth>
						<span style={{marginLeft: 10}}></span>
                        <Auth type={["wechat-user-virtual-update"]}>
                            <a onClick={toggleModal(obj, 'visible_1', 0)}>修改虚拟分组</a>
                        </Auth>
					</div>
				)
			}
		}]
		const pagination = {
			total: params.count,
			current: +params.page,
			onChange: ::this.handlePageChange,
			showSizeChanger: true,
			pageSize: +params.psize,
			onShowSizeChange: ::this.handlePageSizeChange,
			showTotal: function() {
				return `共${params.count}条`
			}.bind(this)
		}

		return (
			<div>
				<div hidden={!this.context.location.query.group_id}>
                    <Auth type={["wechat-group-move-many-user"]}>
                        <Button type="primary" onClick={this.toggleModal.bind(this, undefined, 'visible_2')}>
                            <Icon type="user"/>
                            批量取消标签
                        </Button>
                    </Auth>
				</div>
				<Table
					dataSource={dataSource}
					columns={columns}
					pagination={ pagination }
					loading={this.props.loading}
					style={{marginTop:5}}
				/>
			</div>
		)
	}

	render() {
		const select = this.props.select.toJS()
		return (
			<div>
				{this.renderTable()}
				{this.renderPullUserModal()}
				<EditModal
					info={this.state.info}
					visible={this.state.visible_1}
				    toggle={::this.toggleModal}
				    select={select}
				    group={this.state.group}
				    changeGroup={::this.changeGroup}
				    changeVirtualGroup={::this.changeVirtualGroup}
				/>
			</div>
		)
	}
}
