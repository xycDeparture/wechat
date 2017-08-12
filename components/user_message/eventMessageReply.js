import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Popconfirm from 'antd/lib/popconfirm'
import Select from 'antd/lib/select'
import message from 'antd/lib/message'
import Modal from 'antd/lib/modal'
import Upload from 'antd/lib/upload'
import Auth from 'Application/components/auth'
import Key from 'Application/decorators/key'
import safeString from 'safeString'

const Option = Select.Option
const FormItem = Form.Item
let searchTimer = null
@Form.create()
export default class ReplyComp extends React.Component {
    
    state = {
        msgType: undefined,
        tableDataSource: [],
        msgModalVisible: false,
        replyList: [],
        msgModalObj: {},
        textContent: ""
    }
    
    componentWillReceiveProps(nextProps) {
        if (!this.state.msgType) {
            const replyData = nextProps.replyData.toJS()
            if (replyData.msgtype === "text") {
                this.setState({
                    textContent: replyData.content
                })
            } else if (replyData.msgtype === "news") {
                const dataContent = replyData.content.map(item => {
                    return {
                        key: Math.random().toString(36).substr(2, 7),
                        url: item.picurl,
                        title: item.title,
                        desc: item.description,
                        link: item.url
                    }
                })
                this.setState({
                    tableDataSource: dataContent
                })
            } else if (replyData.msgtype === "reply") {
                this.setState({
                    replyList: [{...replyData.content}]
                })
            }
            if (replyData.msgtype) {
                this.setState({
                    msgType: replyData.msgtype
                })
            }
        }
    }
    static contextTypes = {
        location: PropTypes.object.isRequired,
        router: PropTypes.object.isRequired
    }
    
    showAddPicMsgModal() {
        this.setState({
            msgModalVisible: true
        })
    }

    hideAddPicMsgModal() {
        this.setState({
            msgModalVisible: false,
            msgModalObj: {}
        })
    }
    
    uploadFile(file) {
        this.props.actions.uploadFile(file).then(x => {
            message.success(x.errormsg)
            this.setState({
                msgModalObj: {
                    ...this.state.msgModalObj,
                    url: x.result.file_url
                }
            })
        })
        return false
    }

    handleFileRemove() {
        this.setState({
            msgModalObj: {
                ...this.state.msgModalObj,
                url: ''
            }
        })
    }
    
    savePicMsg() {
        this.props.form.validateFields(['title', 'desc', 'link'], (errors, values) => {
            if (errors) {
                return
            }

            if (!this.state.msgModalObj.url) {
                return message.error('请选择图片')
            }

            let tableDataSource = this.state.tableDataSource
            if (this.state.msgModalObj.isEdit) {
                tableDataSource = tableDataSource.map(item => {
                    if (item.key == this.state.msgModalObj.key) {
                        return {
                            ...item,
                            ...values,
                            url: this.state.msgModalObj.url
                        }
                    }
                    return item
                })
            } else {
                if (tableDataSource.length < 8) {
                    tableDataSource.push({
                        key: Math.random().toString(36).substr(2, 7),
                        url: this.state.msgModalObj.url,
                        ...values
                    })
                } else {
                    return message.error('最多添加8条!')
                }
            }

            this.setState({
                tableDataSource,
                msgModalVisible: false,
                msgModalObj: {}
            })

            this.props.form.resetFields(['title', 'desc', 'link'])
        })
    }
    
    delTableData(key) {
        this.setState({
            tableDataSource: this.state.tableDataSource.filter(item => item.key != key)
        })
    }
    
    changeSelect(type, value) {
        this.setState({
            [type]: value
        })
    }

    handleSearchReplyList = ({ target: { value } }) => {
        clearTimeout(searchTimer)
        this.props.form.resetFields(['replyList'])
        if (!value.trim()) {
            this.setState({
                replyList: []
            })
            return
        }
        searchTimer = setTimeout(() => {
            this.props.actions.searchKeywordEventReply(value).then(response => {
                if (!response.result.reply_list.length) {
                    this.setState({
                        replyList: []
                    })
                    return message.warning("暂无相关关键字！")
                }
                else {
                    this.setState({
                        replyList: response.result.reply_list
                    })
                }
            })
        }, 300)
    }
    
    handleSubmit() {
        const query = this.context.location.query
        this.props.form.validateFields(['msgtype'], (errors, values) => {
            if (errors) {
                return
            }
            let content
            if (values.msgtype === 'text') {
                content = this.props.form.getFieldValue('content')
                if (!content) {
                    message.error("请输入文本信息")
                    return
                }
            } else if (values.msgtype === 'news') {
                if (!this.state.tableDataSource.length) {
                    message.error("请添加图文")
                    return
                }
                content = this.state.tableDataSource.map(item => {
                    return {
                        picurl: item.url,
                        title: item.title,
                        description: item.desc,
                        url: item.link
                    }
                })
                content = JSON.stringify(content)
            } else {
                const id = this.props.form.getFieldValue('replyList')
                if (!id) {
                    message.error("请选择消息回复")
                    return
                }
                let keyword
                this.state.replyList.map(item => {
                    if (item.id == id) {
                        keyword = item.keyword
                    }
                })
                content = {
                    id,
                    keyword
                }
                content = JSON.stringify(content)
            }
            
            const data = {
               relation_id: query.id,
               type: 2,
               msgtype: values.msgtype,
               content
            }
            
            this.props.actions.eventReplySubmit(data).then(result => {
                message.success(result.errormsg)
                this.context.router.push({
                    pathname: '/wechat/eventMessage/list'
                })
            })
        })
    }
    
    renderForm() {
        const replySelectData = this.props.replySelectData
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 16 }
        }

        const { getFieldDecorator } = this.props.form
      
        const textProps = getFieldDecorator('content', {
            rules: [
                { required: true, message: '请输入文本信息' }
            ],
            initialValue: this.state.textContent
        })(
            <Input type="textarea" rows="5" />
        )

        const msgTypeProps = getFieldDecorator('msgtype', {
            rules: [
                { required: true, message: '请输入消息类型' }
            ],
            initialValue: this.state.msgType,
            onChange: this.changeSelect.bind(this, 'msgType')
        })(
            <Select placeholder="请选择消息类型">
                {
                    replySelectData.map(item =>
                        <Option key={item.get('id')} value={item.get('id')+''}>{item.get('name')}</Option>
                    )
                }
            </Select>
        )

        const assets_domain = this.props.assets_domain
        const delTableData = id => _ => {
            return this.delTableData(id)
        }
        const editPicMsg = id => _ => {
            const msgModalObj = {
                ...this.state.tableDataSource.find(item => item.key == id),
                isEdit: true
            }

            this.setState({
                msgModalObj,
                msgModalVisible: true
            })
        }
        const columns = [{
            title: '图片',
            dataIndex: 'url',
            key: 'url',
            render(url) {
                return <img src={assets_domain + url} width={100}/>
            }
        },{
            title: '标题',
            dataIndex: 'title',
            key: 'title'
        },{
            title: '描述',
            dataIndex: 'desc',
            key: 'desc'
        },{
            title: '链接',
            dataIndex: 'link',
            key: 'link'
        },{
            title: '操作',
            key: 'operator',
            render(_, obj) {
                return (
                   <div>
                        <a onClick={editPicMsg(obj.key)} style={{paddingRight: 10}}>编辑</a>
                        <Popconfirm title="确认删除吗？" onConfirm={delTableData(obj.key)}>
                            <a>删除</a>
                        </Popconfirm>
                    </div>
                )
            }
        }]

        const replyListOption = []
        if (this.state.replyList.length) {
            this.state.replyList.map(item =>
                replyListOption.push(<Option key={item.id} value={item.id+''}>{item.keyword}</Option>)
            )
        }
        
        const replyListProps = getFieldDecorator('replyList', {
            rules: [
                { required: true, message: '请选择消息回复' }
            ],
            initialValue: this.state.replyList.length ? this.state.replyList[0].id + '' : undefined
        })(
            <Select
                onChange={this.handleChangePreview}
                size="large"
                placeholder="请选择消息回复"
            >
                {replyListOption}
            </Select>
        )

        return (
            <div>
                <div className="pure-form">
                    <Form layout='horizontal'>
                        <FormItem {...formItemLayout} label="消息类型：">
                                    {msgTypeProps}
                        </FormItem>
                        {{
                            'text': (
                                <FormItem {...formItemLayout}
                                    label="文本："
                                    hasFeedback
                                >
                                    {textProps}
                                </FormItem>
                            ),
                            'news': (
                                <FormItem {...formItemLayout} label="图文内容：" required>
                                    <Button type="dashed" size="default" onClick={::this.showAddPicMsgModal}>添加图文</Button>
                                </FormItem>
                            ),
                            'reply': (
                                <FormItem {...formItemLayout}
                                    label="消息回复："
                                    hasFeedback
                                >
                                    <Input size="large" placeholder="请输入关键字" onChange={this.handleSearchReplyList.bind(this)}/>
                                    <div style={{marginTop: 8}}></div>
                                    {replyListProps}
                                </FormItem>
                            )
                        }[this.state.msgType]}

                    </Form>
                </div>
                {
                    this.state.msgType === 'news' && this.state.tableDataSource.length ?
                    <div style={{paddingLeft: 40, paddingRight: 40}}>
                        <Table
                            dataSource={this.state.tableDataSource}
                            columns={columns}
                            pagination={false}
                        />
                    </div> : null
                }
                <Button style={{ marginLeft: 96, marginTop: 16, marginRight: 16 }} onClick={() => history.back()}>返回</Button>
                <Button type="primary" onClick={::this.handleSubmit}>提交</Button>
            </div>
        )
    }
    
    renderModal() {
        const { getFieldDecorator } = this.props.form
        const modalObj = this.state.msgModalObj
        const titleProps = getFieldDecorator('title', {
            rules: [
                { required: true, message: '请输入标题' }
            ],
            initialValue: modalObj.title
        })(
            <Input type="text" />
        )

        const descProps = getFieldDecorator('desc', {
            rules: [
                { required: true, message: '请输入描述' }
            ],
            initialValue: modalObj.desc
        })(
            <Input type="textarea" />
        )

        const linkProps = getFieldDecorator('link', {
            rules: [
                { required: true, message: '请输入链接' }
            ],
            initialValue: modalObj.link
        })(
            <Input type="text" />
        )

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 16 }
        }

        const getFile = () => {
            if (modalObj.url) {
                return [{
                    uid: -1,
                    status: 'done',
                    url: this.props.assets_domain + modalObj.url
                }]
            }
            return []
        }
        const uploadProps = {
            listType: 'picture-card',
            beforeUpload: ::this.uploadFile,
            //onChange: ::this.handleFileChange,
            onRemove: ::this.handleFileRemove,
            fileList: getFile(),
            accept: 'image/png,image/jpeg,image/gif'
        }
        return (
            <Modal
                visible={this.state.msgModalVisible}
                onCancel={::this.hideAddPicMsgModal}
                onOk={::this.savePicMsg}
                title={modalObj.isEdit ? '修改图文' : '添加图文'}
            >
                <Form layout='horizontal' >
                    <FormItem
                        {...formItemLayout}
                        label="标题："
                        hasFeedback>
                                {titleProps}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="描述："
                        hasFeedback>
                                {descProps}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="链接："
                        hasFeedback>
                                {linkProps}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="图片："
                        required
                        hasFeedback>
                        <Upload {...uploadProps}>
                            <Icon type="plus" />
                            <div className="ant-upload-text">图片</div>
                        </Upload>
                    </FormItem>
                </Form>
            </Modal>
        )
    }
    
	render() {
		return (
			<div>
				{this.renderForm()}
				{this.renderModal()}
			</div>
		)
	}
}
