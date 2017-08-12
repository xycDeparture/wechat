import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import IconFont from 'Application/components/iconFont'
import Key from 'Application/decorators/key'
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'
import Spin from 'antd/lib/spin'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import InputNumber from 'antd/lib/input-number'
import Select from 'antd/lib/select'
import Modal from 'antd/lib/modal'
import message from 'antd/lib/message'
import Popconfirm from 'antd/lib/popconfirm'
import Auth from 'Application/components/auth'
import format from 'Application/utils/formatDate'
import safeString from 'safeString'
import AddAllKindsModal from './addAllKindsModal'

const FormItem = Form.Item
const Option = Select.Option
@Key(['content'])
@Form.create()
export default class QRCodeComp extends React.Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	}

	static propTypes = {
		selectData: PropTypes.instanceOf(Immutable.Map).isRequired,
		content: PropTypes.instanceOf(Immutable.List).isRequired,
		params: PropTypes.instanceOf(Immutable.Map).isRequired,
		error: PropTypes.object.isRequired,
		actions: PropTypes.object.isRequired,
		loading: PropTypes.bool.isRequired,
		submitLoading: PropTypes.bool.isRequired,
		editLoading: PropTypes.bool.isRequired
	}

	state = {
		modalVisible: false,
		visible: false,
		editData: {},
		typeSelectValue: ''
	}

    toggleModal(info, visible) {
        if(info) {
            this.setState({
                [visible]: !this.state[visible],
                info: info
            })
        }else{
            this.setState({
                [visible]: !this.state[visible],
            })
        }
    }
    
    addWechatScene(data) {
        this.props.actions.addWechatScene(data).then(err => {
            message.success(err.errormsg)
            this.setState({
                visible: false
            })
        })
    }
    
    addChannel(data) {
        this.props.actions.addChannel(data).then(err => {
            message.success(err.errormsg)
            this.setState({
                visible: false
            })
        })
    }
    
    addWechatGroup(data) {
        this.props.actions.addWechatGroup(data).then(err => {
            message.success(err.errormsg)
            this.setState({
                visible: false
            })
        })
    }
    
    addVirtualGroup(data) {
        this.props.actions.addVirtualGroup(data).then(err => {
            message.success(err.errormsg)
            this.setState({
                visible: false
            })
        })
    }
    
    addPosition(data) {
        this.props.actions.addPosition(data).then(err => {
            message.success(err.errormsg)
            this.setState({
                visible: false
            })
        })
    }
    
	hideEditQRCode() {
		this.setState({
			modalVisible: false
		})
		this.props.form.resetFields()
	}

	showEditQRCode(editData = {}) {

		this.props.actions.fetchQRCodeSelect().then(x => {
			this.setState({
				modalVisible: true,
				editData
			})
		})

	}

	editQRCode() {
		this.props.form.validateFields((err, values) => {

			if (err) {
				return
			}

			delete values.searchName

			values.virtual_groupid = values.virtual_groupid ? values.virtual_groupid.join(',') : ''

			let data = {}
			if (Object.keys(this.state.editData).length) {
				data.id = this.state.editData.id
				data.act = 'update'
			}

			const postData = {
				...values,
				...data
			}

			this.props.actions.editQRCode(postData).then(err => {
				message.success(err.errormsg)
				this.props.form.resetFields()
				this.setState({
					modalVisible: false,
					editData: {}
				})
			})
		})
	}

	delQRCode(id) {
		const act = 'delete'
		this.props.actions.editQRCode({ id, act }).then(err => {
			message.success(err.errormsg)
		})
	}

	// 查询列表
	handleSearch(nextPage = this.props.params.get('page'), pageSize = this.props.params.get('psize')) {
		const query = {
			psize: pageSize,
			page: nextPage,
			name: this.props.form.getFieldValue('searchName')
		}

		this.context.router.push({
			pathname: '/wechat/qrcode/list',
			query
		})

		this.props.actions.fetchQRCodeList(query)
	}

	renderToolbar() {
		const nameProps = this.props.form.getFieldDecorator('searchName', {
			initialValue: this.props.params.get('name')
		})(
			<Input type="text" placeholder="请输入名称" />
		)

		return (
			<div className="toolbar">
				<Form layout='inline'>
					<Auth type={["wechat-qrcode-add"]}>
						<FormItem>
							<Button type="primary" onClick={this.showEditQRCode.bind(this, {})}>
								<Icon type="plus" />
								添加
							</Button>
						</FormItem>
					</Auth>
					<FormItem  label="名称：">
							{nameProps}
		        	</FormItem>
		        	<FormItem>
	    	        	<Button type="primary" onClick={this.handleSearch.bind(this, undefined, undefined)}>
							<Icon type="search" />
							 搜索
						</Button>
		        	</FormItem>

				</Form>
			</div>
		)
	}

	renderTable() {
		const dataSource = this.props.content.toJS()
		const editQRCode = obj => _ => {
			return this.showEditQRCode(obj)
		}
		const delQRCode = id => _ => {
			return this.delQRCode(id)
		}

		const showQRCode = obj => _ => {
			Modal.info({
				title: '`' + obj.name + '` 的二维码',
				content: <img style={{width: 300, marginLeft: -19}} src={`https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${obj.ticket}`} />
			})
		}

		const columns = [{
			title: '名称',
			dataIndex: 'name',
			key: 'name'
		}, {
			title: '类型',
			dataIndex: 'type_name',
			key: 'type_name'
		}, {
			title: '场景',
			dataIndex: 'scene_name',
			key: 'scene'
		}, {
			title: '渠道',
			dataIndex: 'channel_name',
			key: 'channel_name'
		}, {
			title: '二维码',
			dataIndex: 'remark',
			key: 'qrcode',
			render(_, obj) {
				return <a onClick={showQRCode(obj)}><IconFont type="icon-eye" cursor title="查看"/> 查看</a>
			}
		}, {
			title: '位置信息',
			dataIndex: 'position_name',
			key: 'position'
		}, {
			title: '唯一key',
			dataIndex: 'keyword',
			key: 'key'
		}, {
			title: '到期时间',
			dataIndex: 'expire_date',
			key: 'expire_date',
			render(time, obj) {
                if (obj.action_name === 'QR_SCENE') {
                    return <span>{format(time*1000)}</span>
                } else {
                    return <span>永久</span>
                }
			}
		}, {
			title: '操作',
			key: 'operation',
			render(_, obj) {
				// const authConfig = {
				// 	dpid: obj.dpid,
				// 	nid: obj.nid,
				// 	cpid: obj.cpid,
				// 	uid: obj.create_user
				// }

				return (
					<div>
						<Auth type={["wechat-qrcode-check", "wechat-qrcode-update"]}>
							<a onClick={editQRCode(obj)}>详情</a>
						</Auth>
						{' '}
						<Auth type={["wechat-qrcode-delete"]} >
							<Popconfirm title="确定要删除吗？" onConfirm={delQRCode(obj.id)}>
								<a>删除</a>
							</Popconfirm>
						</Auth>


					</div>
				)
			}
		}]

		const params = this.props.params
		const pagination = {
			pageSize: +params.get('psize'),
			current: +params.get('page'),
			onChange: ::this.handleSearch,
			showSizeChanger: true,
			onShowSizeChange: ::this.handleSearch,
			total: +params.get('count'),
			showTotal: function() {
				return `共${params.get('count')}条`
			}.bind(this)
		}

		return (
			<Table
				dataSource={dataSource}
				columns={columns}
				loading={this.props.loading}
				pagination={pagination}
			/>
		)
	}

	typeChange(v) {
		this.setState({
			typeSelectValue: v
		})
	}

	renderModal() {
		const formItemLayout = {
		    labelCol: { span: 5 },
		    wrapperCol: { span: 15 }
		}
        const toggleModal = (obj, visible) => _ =>{
            this.toggleModal(obj, visible)
        }
		const { getFieldDecorator } = this.props.form
		const data = this.state.editData
		const hasData = Object.keys(data).length
		const selectData = this.props.selectData.toJS()
		const nameProps = getFieldDecorator('name', {
			rules: [
		       { required: true, message: '请输入名称' },
			],
			initialValue: data.name
		})(
			<Input type="text" placeholder="请输入名称" />
		)

		const sceneProps = getFieldDecorator('scene', {
			rules: [
		       { required: true, message: '请选择场景' },
			],
			initialValue: safeString(data.scene)
		})(
			<Select placeholder="请选择场景" style={{ width: 230 }}>
				{
					selectData.sceneList.map(item =>
						<Option key={item.id} value={item.id+''}>{item.name}</Option>
					)
				}
			</Select>
		)

		const channelProps = getFieldDecorator('channel', {
			rules: [
		       { required: true, message: '请选择渠道' },
			],
			initialValue: safeString(data.channel)
		})(
			<Select placeholder="请选择渠道" style={{ width: 230 }}>
				{
					selectData.channelList.map(item =>
						<Option key={item.id} value={item.id+''}>{item.name}</Option>
					)
				}
			</Select>
		)

		const wechatGroupProps = getFieldDecorator('wechat_groupid', {
			rules: [
		       { required: true, message: '请选择微信分组' },
			],
			initialValue: safeString(data.wechat_groupid)
		})(
			<Select placeholder="请选择微信分组" style={{ width: 230 }}>
				{
					selectData.weixinGroup.map((item, index) =>
						<Option key={index} value={item.id+''}>{item.name}</Option>
					)
				}
			</Select>
		)

		const virtualProps = getFieldDecorator('virtual_groupid', {
			// rules: [
		 //       { type: 'array' },
			// ],
			initialValue: data.virtual_groupid ? data.virtual_groupid.split(',') : undefined
		})(
			<Select
				optionFilterProp="children"
				mode='multiple'
				placeholder="请选择虚拟分组"
				style={{ width: 230 }}
			>
				{
					selectData.virtualGroup.map(item =>
						<Option key={item.id} value={item.id+''}>{item.name}</Option>
					)
				}
			</Select>
		)

		const positionProps = getFieldDecorator('position', {
			rules: [
		       { required: false, message: '请选择位置' },
			],
			initialValue: safeString(data.position)
		})(
			<Select placeholder="请选择位置" style={{ width: 230 }}>
				{
					selectData.positionList.map(item =>
						<Option key={item.id} value={item.id+''}>{item.name}</Option>
					)
				}
			</Select>
		)

		const typeProps = getFieldDecorator('action_name', {
			rules: [
		       { required: true, message: '请选择类型' },
			],
			onChange: ::this.typeChange,
			initialValue: data.action_name
		})(
			<Select disabled={!!hasData} placeholder="请选择类型">
				{
					selectData.qrcodeType.map(item =>
						<Option key={item.id} value={item.id+''}>{item.name}</Option>
					)
				}
			</Select>
		)

		const expireDateProps = getFieldDecorator('expire_date', {
			initialValue: format(data.expire_date*1000)
		})(
			<Input disabled={!!hasData} />
		)

		let expireProps
		if (!hasData) {
			expireProps = getFieldDecorator('expire_seconds', {
				rules: [
			       { type: 'number', required: true, message: '请输入有效期' },
				],
				initialValue: 1
			})(
				<InputNumber min={1} max={7}/>
			)
		}

		// const authConfig = {
		// 	dpid: data.dpid,
		// 	nid: data.nid,
		// 	cpid: data.cpid,
		// 	uid: data.create_user
		// }

		return (
			<Modal
				visible={this.state.modalVisible}
				title={Object.keys(this.state.editData).length ? '编辑' : '添加'}
				onCancel={::this.hideEditQRCode}
				footer={[
					<Button key="back" type="ghost" size="large" onClick={::this.hideEditQRCode}>返 回</Button>,
					<Auth key="submit" type={["wechat-qrcode-update"]} >
						<Button type="primary" size="large" loading={this.props.submitLoading} onClick={::this.editQRCode}>
							提 交
						</Button>
					</Auth>
				]}
			>
				<Form layout='horizontal' >
					<FormItem
						{...formItemLayout}
						label="名称："
						hasFeedback
					>
						{nameProps}
			        </FormItem>
			        <FormItem
						{...formItemLayout}
						label="场景："
					>
			            {sceneProps}
    		            <a onClick={toggleModal('sceneModal', 'visible')} style={{marginLeft: 10}}><Icon type="plus"/>添加场景</a>
			        </FormItem>
			        <FormItem
						{...formItemLayout}
						label="渠道："
					>
						{channelProps}
						<a onClick={toggleModal('channelModal', 'visible')} style={{marginLeft: 10}}><Icon type="plus"/>添加渠道</a>
			        </FormItem>
			        <FormItem
						{...formItemLayout}
						label="微信分组："
					>
						{wechatGroupProps}
						<a onClick={toggleModal('wechatGroupModal', 'visible')} style={{marginLeft: 10}}><Icon type="plus"/>微信分组</a>
			        </FormItem>
			        <FormItem
						{...formItemLayout}
						label="虚拟分组："
					>
						{virtualProps}
						<a onClick={toggleModal('virtualGroupModal', 'visible')} style={{marginLeft: 10}}><Icon type="plus"/>虚拟分组</a>
			        </FormItem>
			        <FormItem
						{...formItemLayout}
						label="位置："
					>
						{positionProps}
    		            <a onClick={toggleModal('positionModal', 'visible')} style={{marginLeft: 10}}><Icon type="plus"/>添加位置</a>
			        </FormItem>
			        <FormItem
						{...formItemLayout}
						label="类型："
						hasFeedback
					>
						{typeProps}
			    </FormItem>
			        {
			        	!hasData && this.state.typeSelectValue !== 'QR_LIMIT_STR_SCENE' &&
					      <FormItem
									{...formItemLayout}
									label="有效期 (天)："
									hasFeedback
									required
								>
									{
										!hasData ? expireProps
										:
										<InputNumber min={1} max={7}/>
									}
						   </FormItem>
			        }
			        {
			        	hasData && data.action_name === 'QR_SCENE' ?
					      <FormItem
									{...formItemLayout}
									label="到期时间："
									hasFeedback
								 >
								 	{expireDateProps}
					     </FormItem> : ''
			       }
				</Form>
			</Modal>
		)
	}

	render() {
		return (
			<Spin spinning={this.props.editLoading}>
				{this.renderToolbar()}
				{this.renderTable()}
				{this.renderModal()}
			    <AddAllKindsModal
                    visible={this.state.visible}
                    info={this.state.info}
                    toggle={::this.toggleModal}
                    actions={{
                        addWechatScene: ::this.addWechatScene,
                        addChannel: ::this.addChannel,
                        addWechatGroup: ::this.addWechatGroup,
                        addVirtualGroup: ::this.addVirtualGroup,
                        addPosition: ::this.addPosition
                    }}
                />
			</Spin>
		)
	}
}
