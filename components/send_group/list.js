import React, { PropTypes } from 'react'
import Immutable from 'immutable'
window.Immutable = Immutable

import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'
import Switch from 'antd/lib/switch'
import Spin from 'antd/lib/spin'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Modal from 'antd/lib/modal'
import Select from 'antd/lib/select'
const Option = Select.Option
import Checkbox from 'antd/lib/checkbox'
import message from 'antd/lib/message'
import Popconfirm from 'antd/lib/popconfirm'
import Auth from 'Application/components/auth'
import onError from 'Application/decorators/onError'
import format from 'Application/utils/formatDate'
import safeString from 'safeString'

import Key from 'Application/decorators/key'

const FormItem = Form.Item

let searchTimer = -1

@Form.create()
@Key(['content'])
@onError('fetchSendGroupList')
export default class SendGroupComp extends React.Component {
	static propTypes = {
		content: PropTypes.instanceOf(Immutable.List).isRequired,
		contentSelect: PropTypes.instanceOf(Immutable.Map).isRequired,
		modalSelect: PropTypes.instanceOf(Immutable.Map).isRequired,
		params: PropTypes.instanceOf(Immutable.Map).isRequired,
        sendGroupPreview: PropTypes.instanceOf(Immutable.List).isRequired,
		actions: PropTypes.object.isRequired,
		listLoading: PropTypes.bool.isRequired,
		loading: PropTypes.bool.isRequired,
		auth: PropTypes.object.isRequired
	}

	static contextTypes = {
		router: PropTypes.object.isRequired
	}

	state = {
		editModalVisible: false,
		editData: {},

		sendTypeId: -1,
		massTypeId: -1,
        visible: false,

        userPreview: [],
        userAll: [],
        userAllValue: [],
        activeType: ''
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.sendGroupPreview !== this.props.sendGroupPreview) {
            if (this.state.activeType === 'userAll') {
                let newUserAll = [
                    ...nextProps.sendGroupPreview.toJS(),
                    ...this.state.userAll
                ]
                const nextUserAll = []
                let current = null
                while (current = newUserAll.pop()) {
                    nextUserAll.push(current)
                    newUserAll.forEach((item, index) => {
                        if (item.id === current.id) {
                            newUserAll.splice(index, 1)
                        }
                    })
                }
                this.setState({
                    userAll: nextUserAll
                })
                // const nextUserAll = []
                // newUserAll.forEach(item => {
                //     for (var i = 0; )
                // })
            } else {
                this.setState({
                    [this.state.activeType]: nextProps.sendGroupPreview.toJS()
                })
            }
        }
    }

	onPageChange(nextPage, pageSize) {
		const query = {
			...this.props.params.toJS(),
			psize: pageSize,
			page: nextPage,
		}
		delete query.count
		this.context.router.push({
			pathname: '/wechat/group-send/list',
			query
		})
		this.props.actions.fetchSendGroupList(query)
	}

	setModalSelectId(key, value) {
		this.setState({
			[key]: value
		})
	}

	shownEditModal(editData = {}) {
		const state = {
			editModalVisible: true,
			editData,
			sendTypeId: editData.type,
			massTypeId: editData.msgtype
		}

        const setState = function setState() {
            this.setState(state)
            if (Object.keys(editData).length && editData.uid && editData.uid.length) {
                const userAllValue = []
                editData.uid.forEach(item => {
                    userAllValue.push(item.id)
                })
                this.setState({
                    userAll: editData.uid,
                    userAllValue
                })
            }
        }.bind(this)

		if (this.props.modalSelect.get('load')) {
			setState()
		} else {
			this.props.actions.fetchSendGroupModalSelect().then(x => {
				setState()
			})
		}


	}

	hideEditModal() {
		this.setState({
			editModalVisible: false
		})
		this.props.form.resetFields()
	}

	handleSearch(page, psize) {
		const values = this.props.form.getFieldsValue(['searchName', 'msgtype', 'send_status', 'searchType'])

		const query = {
			name: values.searchName,
			msgtype: values.msgtype,
			send_status: values.send_status,
			type: values.searchType,
			page,
			psize
		}

		this.context.router.push({
			pathname: '/wechat/group-send/list',
			query
		})

		this.props.actions.fetchSendGroupList(query)

	}

 	// 保存／添加群发
	saveSendGroup() {
		const {
			validateFields,
			getFieldsValue
		} = this.props.form

		validateFields((error, values) => {
			if (error) {
				return
			}
			let {
				groupSendPreview,
				groupSendType,
				wechatGroupId,
				virtualGroupId,
				userId,
				groupSendContentType,
				imgTxtId = '@',
				txtId,
				voiceId = '@',
        imgId = '@',
				wxcard = '@',
				videoId = '@'
			} = getFieldsValue([
				'groupSendPreview',
				'groupSendType',
				'wechatGroupId',
				'virtualGroupId',
				'userId',
				'groupSendContentType',
				'imgTxtId',
				'txtId',
				'voiceId',
				'imgId',
        'wxcard',
				'videoId'
			])

			imgTxtId = imgTxtId.split('@')
			voiceId = voiceId.split('@')
            imgId = imgId.split('@')
			wxcard = wxcard.split('@')
			videoId = videoId.split('@')

			const postData = {
				name: values.group_name,
				check_openid: values.groupPreviewPerson,
				type: groupSendType,
				wechat_groupid: wechatGroupId,
				virtual_groupid: virtualGroupId,
				open_id: this.state.userAllValue,
				msgtype: groupSendContentType,
				txt_content: imgTxtId[0],
				txt_content_name: imgTxtId[1],
				text_content: txtId,
				voice_content: voiceId[0],
				voice_content_name: voiceId[1],
				image_content: imgId[0],
				image_content_name: imgId[1],
                wxcard_content: wxcard[0],
                wxcard_content_name: wxcard[1],
				video_content: videoId[0],
				video_content_name: videoId[1]
			}

			const act = Object.keys(this.state.editData).length ? 'update' : 'add'

			this.props.actions.saveSendGroupData(postData, act, this.state.editData.id).then(x => {
				message.success(x.errormsg)
				this.hideEditModal()
			})
		})
	}

	// 删除群发
	removeSendGroup(id) {
		this.props.actions.removeSendGroup(id).then(x => {
			message.success(x.errormsg)
		})
	}

	// 修改审核状态
	updateAudit(id) {
		this.props.actions.updateAudit(id).then(x => {
			message.success(x.errormsg)
		})
	}

	// 预览
	sendPreview(id) {
		this.props.actions.sendPreview(id).then(x => {
			message.success(x.errormsg)
		})
	}

 	// 发送
	sendGroupMsg(id) {
		this.props.actions.sendGroupMsg(id).then(x => {
			message.success(x.errormsg)
		})
	}

	// 查看微信返回消息
	fetchReturnMsg(id) {
		this.props.actions.fetchReturnMsg(id).then(x => {
			Modal.info({
				title: x.errormsg,
				content: x.result.map((item, index) => <p key={index}>{item}</p>)
			})
		})
	}

    handleChangePreview = value => {
        this.setState({
            groupSendPreviewValue: value
        })
    }

    handleAllUserChange = value => {

        this.setState({
            userAllValue: value
        })
    }

    handleSearchPreview = (activeType, bindValue, { target: { value } }) => {
        clearTimeout(searchTimer)
        this.setState({
            activeType
        })
        if (!value.trim()) {
            this.props.actions.removeSearchPreview()
            if (bindValue === 'userAllValue') {
                // this.setState({
                //     userAllValue: []
                // })
            } else {
                this.setState({
                    groupSendPreviewValue: ''
                })
            }
            return
        }
        searchTimer = setTimeout(() => {
            this.props.actions.searchPreview({ value }).then(response => {
                if (!response.result.allUser.length) {
                    if (bindValue === 'groupSendPreviewValue') {
                        this.setState({
                            [bindValue]: ''
                        })
                    }

                    return message.warning(`暂无相关用户！`)
                }
                if (bindValue === 'groupSendPreviewValue') {
                    this.setState({
                        [bindValue]: response.result.allUser[0].id
                    })
                }

            })
        }, 500)
    }

	renderToolbar() {
		const {
			sendStatus,
			sendType,
			massType
		} = this.props.contentSelect.toJS()

		const params = this.props.params.toJS()

		const { getFieldDecorator } = this.props.form
		const nameProps = getFieldDecorator('searchName', {
			initialValue: params.name
		})(
			<Input type="text" placeholder="请输入名称" />
		)
		const msgTypeProps = getFieldDecorator('msgtype', {
			initialValue: params.msgtype
		})(
			<Select size="large" placeholder="请选择类型" style={{ width: 150 }} allowClear>
				<Option key={'x'} value="-1">全部</Option>
				{
					massType.map(item =>
						<Option key={item.id} value={item.id+''}>{item.name}</Option>
					)
				}
			</Select>
		)
		const statusProps = getFieldDecorator('send_status', {
			initialValue: params.send_status
		})(
			<Select size="large" placeholder="请选择类型" style={{ width: 150 }} allowClear>
				<Option key={'x'} value="-1">全部</Option>
				{
					sendStatus.map(item =>
						<Option key={item.id} value={''+item.id}>{item.name}</Option>
					)
				}
			</Select>
		)
		const typeProps = getFieldDecorator('searchType', {
			initialValue: params.type
		})(
			<Select size="large" placeholder="请选择对象" style={{ width: 150 }} allowClear>
				<Option key={'x'} value="-1">全部</Option>
				{
					sendType.map(item =>
						<Option key={item.id} value={''+item.id}>{item.name}</Option>
					)
				}
			</Select>
		)

		return (
			<div className="toolbar">
				<Form layout='inline'>
					<Auth type={["wechat-mass-add"]}>
						<FormItem>
							<Button type="primary" onClick={this.shownEditModal.bind(this, {})}>
								<Icon type="plus" />
								添加
							</Button>
						</FormItem>
					</Auth>

					<FormItem label="名称：">
							{nameProps}
		        	</FormItem>
					<FormItem  label="群发内容类型：">
							{msgTypeProps}
		        	</FormItem>
		        	<FormItem  label="群发内容对象：">
									{typeProps}
		        	</FormItem>
		        	<FormItem  label="发送状态：">
									{statusProps}
		        	</FormItem>
		        	<FormItem>
		        		<Button type="primary" onClick={this.handleSearch.bind(this, undefined, undefined)}>
							<Icon type="search" />
							 查询
						</Button>
		        	</FormItem>

				</Form>
			</div>
		)
	}

	renderTable() {
		const dataSource = this.props.content.toJS()
		const removeSendGroup = id => _ => {
			this.removeSendGroup(id)
		}

		const shownEditModal = obj => _ => {
			this.shownEditModal(obj)
		}

		const updateAudit = id => _ => {
			this.updateAudit(id)
		}

		const sendPreview = id => _ => {
			this.sendPreview(id)
		}

		const sendGroupMsg = id => _ => {
			this.sendGroupMsg(id)
		}

		const fetchReturnMsg = id => _ => {
			this.fetchReturnMsg(id)
		}

		const auth = this.props.auth

		const columns = [{
			title: '公众号',
			dataIndex: 'acid_name',
			key: 'publicNumber'
		}, {
			title: '名称',
			dataIndex: 'name',
			key: 'name'
		}, {
			title: '群发内容类型',
			dataIndex: 'msgtype_name',
			key: 'contentType'
		}, {
			title: '群发类型',
			dataIndex: 'type_name',
			key: 'sendType'
		},{
			title: '发送状态',
			dataIndex: 'send_status_name',
			key: 'sendState',
			render(send_status_name) {
				return <span>{send_status_name}</span>
			}
		}, {
			title: '审核状态',
			dataIndex: 'audit_type',
			key: 'status',
			render(audit_type, obj) {
				const disabled = auth['wechat-mass-audit'] === undefined
				return (
					<Switch
						disabled={disabled || obj.send_status == 3 || obj.send_status == 2}
						checked={!!audit_type}
						onChange={updateAudit(obj.id)}
						/>
				)
			}
		}, {
			title: '群发操作',
			key: 'groupOpration',
			render(_, obj) {
				return (
					obj.send_status == 5 ? null :
					<div>
						{/*TODO 撤销功能还没做*/}
						{/*   1未发送2发送中（判断create_time在30分钟以内显示撤销）3发送成功4发送失败5已撤销   */}
						{
							obj.send_status == 1 &&
							<Auth
								type={["wechat-mass-preview"]}
							>
								<a onClick={sendPreview(obj.id)}>预览{' '}</a>
							</Auth>

						}
						{
							obj.send_status == 2 &&
							<Auth type={["wechat-mass-check-status"]}>
								<a disabled>发送中{' '}</a>
							</Auth>
						}
						{
							obj.send_status == 3 &&
							<Auth
								type={["wechat-mass-check-wechat"]}
							>
								<a onClick={fetchReturnMsg(obj.msg_id)}>查看微信返回信息{' '}</a>
							</Auth>

						}

						{
							obj.send_status == 1 && obj.audit_type == 1 &&
							<Auth type={["wechat-mass-send"]}>
								<Popconfirm title="确定发送吗？" onConfirm={sendGroupMsg(obj.id)}>
									<a>发送{' '}</a>
								</Popconfirm>
							</Auth>

						}
					</div>
				)
			}
		},
		{
			title: '发送时间',
			dataIndex: 'last_update_time',
			key: 'last_update_time',
			render(time) {
				return (
					<span>{format(time*1000, 'yyyy-MM-dd hh:mm:ss')}</span>
				)
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
						{
							(obj.send_status == 1 || obj.send_status == 4) &&
							[
								<Auth key={1} type={["wechat-mass-check", "wechat-mass-update"]}>
									<a onClick={shownEditModal(obj)}>详情{' '}</a>
								</Auth>,
								<Auth
									key={2}
									type={["wechat-mass-delete"]}
								>
									<Popconfirm title="确定删除吗？" onConfirm={removeSendGroup(obj.id)}>
										<a>删除</a>
									</Popconfirm>
								</Auth>
							]
						}
					</div>
				)
			}
		}]

		const params = this.props.params
		const pagination = {
			pageSize: +params.get('psize'),
			current: +params.get('page'),
			onChange: ::this.onPageChange,
			showSizeChanger: true,
			onShowSizeChange: ::this.onPageChange,
			total: +params.get('count'),
			showTotal: function() {
				return `共${params.get('count')}条`
			}.bind(this)
		}

		return (
			<div>
				<div style={{fontSize: 14,fontWeight: 'bold'}}>本月已发条数：<i style={{fontSize: 16, color: "#2db7f5", fontWeight: 'bold'}}>{this.props.send_count}</i> 条</div>
				<Table
					pagination={pagination}
					dataSource={dataSource}
					columns={columns}
					loading={this.props.listLoading}
				/>
			</div>
		)
	}

	renderEditModal() {
		const formItemLayout = {
		    labelCol: { span: 5 },
		    wrapperCol: { span: 17 }
		}

		const selectStyle = {
			width: 300
		}

		const editData = this.state.editData

		const { getFieldDecorator } = this.props.form

		const {
			sendType,
			massType,
			allUser,
			allVoice,
			allVideo,
			allImage,
			cardList,
			allTxt,
			virtualGroup,
			weixinGroup
		} = this.props.modalSelect.toJS()
				// console.log(this.props.modalSelect.toJS())
				const sendGroupPreview = this.props.sendGroupPreview.toJS()
				const groupSendPreviewOptions = []
				if (this.state.userPreview.length) {
						this.state.userPreview.map(item =>
								groupSendPreviewOptions.push(<Option key={item.id} value={item.id+''}>{item.nickname}</Option>)
						)
				} else if (Object.keys(editData).length) {
						groupSendPreviewOptions.push(
								<Option key={editData.check_openid} value={editData.check_openid+''}>{editData.check_openid_name}</Option>
						)
				}

				const allUserOptions = []
				if (this.state.userAll.length) {
						this.state.userAll.map(item =>
								allUserOptions.push(<Option key={item.id} value={item.id+''}>{item.nickname}</Option>)
						)
				}

		const nameProps = getFieldDecorator('group_name', {
			rules: [
				{ required: true, message: '请输入名称' }
			],
			initialValue: editData.name
		})(
			<Input type="text" placeholder="请输入名称"/>
		)

//		const groupSendPreview = getFieldDecorator('groupSendPreview', {
//			// initialValue: safeString(editData.check_openid)
//			initialValue: safeString(this.state.groupSendPreviewValue || editData.check_openid)
//		})(
//			<Select
//				// showSearch={true}
//				onChange={this.handleChangePreview}
//				size="large"
//				// optionFilterProp="children"
//				searchPlaceholder="输入关键词"
//				// value={safeString(this.state.groupSendPreviewValue || editData.check_openid)}
//				// disabled={!this.state.userPreview.length}
//				placeholder="请选择群发预览人"
//			>
//				{groupSendPreviewOptions}
//			</Select>
//		)

        const sendPreviewPerson = this.props.sendPreviewPerson.toJS();
        const check_openid = !editData.check_openid ? '' : editData.check_openid
        const groupPreviewPerson = getFieldDecorator('groupPreviewPerson', {
            initialValue: safeString(check_openid)
        })(
            <Select placeholder="请选择群发预览人" allowClear>
                {
                    sendPreviewPerson.map(item => 
                        <Option key={item.id} value={item.id+''}>{item.nickname}</Option>
                    )
                }
            </Select>
        )
        
		const groupSendType = getFieldDecorator('groupSendType', {
    		onChange: this.setModalSelectId.bind(this, 'sendTypeId'),
    		initialValue:  safeString(editData.type)
    	})(
				<Select style={selectStyle} placeholder="请输入群发类型">
					{
						sendType.map(item =>
							<Option key={item.id} value={item.id+''}>{item.name}</Option>
						)
					}
				</Select>
			)

    	const wechatGroupId = getFieldDecorator('wechatGroupId', {
    		initialValue: safeString(editData.wechat_groupid)
    	})(
				<Select style={selectStyle}>
					{
						weixinGroup.map((item, index) =>
							<Option key={index} value={item.group_id+''}>{item.name}</Option>
						)
					}
				</Select>
			)

    	const virtualGroupId = getFieldDecorator('virtualGroupId', {
    		initialValue: editData.virtual_groupid ? editData.virtual_groupid.split(',') : undefined
    	})(
				<Select
				mode='multiple'
				style={selectStyle}
			>
					{
						virtualGroup.map(item =>
							<Option key={item.id} value={item.id+''}>{item.name}</Option>
						)
					}
				</Select>
			)

    	// let userIdInitialValue = undefined
    	// if (editData.uid && editData.uid.length) {
    	// 	userIdInitialValue = editData.uid.split(',')
    	// }
    	const userId = getFieldDecorator('userId', {
    		// initialValue: userIdInitialValue
				initialValue: this.state.userAllValue.length ? this.state.userAllValue : undefined
    	})(
				<Select
					mode='multiple'
					onChange={this.handleAllUserChange}
					searchPlaceholder="输入关键词"
					size="large"
					// value={this.state.userAllValue.length ? this.state.userAllValue : undefined}
				>
												{allUserOptions}
					</Select>
			)

    	const groupSendContentType = getFieldDecorator('groupSendContentType', {
    		onChange: this.setModalSelectId.bind(this, 'massTypeId'),
    		initialValue: editData.msgtype
    	})(
				<Select style={selectStyle} placeholder="请输入群发内容类型">
					{
						massType.map(item =>
							<Option key={item.id} value={item.id+''}>{item.name}</Option>
						)
					}
				</Select>
			)

    	function getValue(name1, name2) {
    		let ret = undefined
	    	if (editData.content && editData.content[name1] && editData.content[name2]) {
	    		ret = editData.content[name1] + '@' + editData.content[name2]
	    	}
	    	return ret
    	}
    	const imgTxtId = getFieldDecorator('imgTxtId', {
    		initialValue: getValue('txt_content', 'txt_content_name')
    	})(
				<Select style={selectStyle}>
					{
						allTxt.map(item =>
							<Option key={item.id} value={`${item.id}@${item.name}`}>{item.name}</Option>
						)
					}
				</Select>
			)

    	const txtId = getFieldDecorator('txtId', {
    		initialValue: editData.content ? editData.content.text_content ? editData.content.text_content : undefined : undefined
    	})(
				<Input type="textarea" rows="5"/>
			)

    	const voiceId = getFieldDecorator('voiceId', {
    		initialValue: getValue('voice_content', 'voice_content_name')
    	})(
				<Select style={selectStyle}>
					{
						allVoice.map(item =>
							<Option key={item.media_id} value={`${item.media_id}@${item.name}`}>{item.name}</Option>
						)
					}
				</Select>
			)

    	const imgId = getFieldDecorator('imgId', {
    		initialValue: getValue('image_content', 'image_content_name')
    	})(
				<Select style={selectStyle}>
					{
						allImage.map(item =>
							<Option key={item.media_id} value={`${item.media_id}@${item.name}`}>{item.name}</Option>
						)
					}
				</Select>
			)
      const wxcard = getFieldDecorator('wxcard', {
          initialValue: getValue('wxcard_content', 'wxcard_content_name')
      })(
				<Select style={selectStyle}>
						{
								cardList.map(item =>
										<Option key={item.card_id} value={`${item.card_id}@${item.name}`}>{item.name}</Option>
								)
						}
				</Select>
			)
    	const videoId = getFieldDecorator('videoId', {
    		initialValue: getValue('video_content', 'video_content_name')
    	})(
				<Select style={selectStyle}>
					{
						allVideo.map(item =>
							<Option key={item.media_id} value={`${item.media_id}@${item.name}`}>{item.name}</Option>
						)
					}
				</Select>
			)

		return (
			<Modal
				title={Object.keys(editData).length ? '详情' : '添加'}
				visible={this.state.editModalVisible}
				onCancel={::this.hideEditModal}
				onOk={::this.saveSendGroup}
				footer={[
					<Button key="back" type="ghost" size="large" onClick={::this.hideEditModal}>返 回</Button>,
					<Auth key="submit" type={["wechat-mass-update"]} >
						<Button type="primary" size="large" onClick={::this.saveSendGroup} loading={this.props.editLoading}>
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
						label="群发预览人："
						hasFeedback
					>
					    {groupPreviewPerson}
                    {  /* <Input size="large" placeholder="请输入用户昵称" onChange={this.handleSearchPreview.bind(this, 'userPreview', 'groupSendPreviewValue')}/>
                        <div style={{marginTop: 8}}></div>
						{groupSendPreview} */
				    }
					</FormItem>
			        <FormItem
			        	{...formItemLayout}
			        	label="群发类型："
			        	required
			        >
									{groupSendType}
		        	</FormItem>

		        	{{
		        		'2': (
		        			<FormItem
					        	{...formItemLayout}
					        	label="微信分组："
					        >
											{wechatGroupId}
				        	</FormItem>
		        		),
		        		'3': (
		        			<FormItem
					        	{...formItemLayout}
					        	label="虚拟分组："
					        >
										{virtualGroupId}
				        	</FormItem>
		        		),
		        		'4': (
		        			<FormItem
		        				{...formItemLayout}
					        	label="选择用户："
		        			>
                    <Input size="large" placeholder="请输入用户昵称" onChange={this.handleSearchPreview.bind(this, 'userAll', 'userAllValue')}/>
                    <div style={{marginTop: 8}}></div>
										{userId}
		        			</FormItem>
		        		)
		        	}[this.state.sendTypeId]}

		        	<FormItem
		        		{...formItemLayout}
		        		label="群发内容类型："
		        	>
								{groupSendContentType}
		        	</FormItem>

		        	{{
		        		'mpnews': (
		        			<FormItem
				        		{...formItemLayout}
				        		label="图文："
				        	>
										{imgTxtId}
				        	</FormItem>
		        		),
		        		'text': (
		        			<FormItem
				        		{...formItemLayout}
				        		label="文本："
				        	>
											{txtId}
				        	</FormItem>
		        		),
		        		'voice': (
		        			<FormItem
				        		{...formItemLayout}
				        		label="语音："
				        	>
											{voiceId}
				        	</FormItem>
		        		),
		        		'image': (
		        			<FormItem
				        		{...formItemLayout}
				        		label="图片："
				        	>
										{imgId}
				        	</FormItem>
		        		),
                        'wxcard': (
                            <FormItem
                                {...formItemLayout}
                                label="卡券："
                            >
																{wxcard}
                            </FormItem>
                        ),
		        		'mpvideo': (
		        			<FormItem
				        		{...formItemLayout}
				        		label="视频："
				        	>
											{videoId}
				        	</FormItem>
		        		)
		        	}[this.state.massTypeId]}

				</Form>
			</Modal>
		)
	}



	render() {
		return (
			<Spin spinning={this.props.loading}>
				{this.renderToolbar()}
				{this.renderTable()}
				{this.renderEditModal()}
			</Spin>
		)
	}
}
