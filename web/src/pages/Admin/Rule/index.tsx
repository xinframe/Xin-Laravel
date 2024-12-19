import XinTable from '@/components/XinTable';
import { ProFormColumnsAndProColumns } from '@/components/XinTable/typings';
import XinDict from '@/components/XinDict';
import { useModel } from '@umijs/max';
import React, { useState } from 'react';
import IconsItem from '@/components/XinForm/IconsItem';
import { message, Switch } from 'antd';
import IconFont from '@/components/IconFont';
import {addApi, editApi} from '@/services/common/table';

interface RuleType {
  id?: number;
  pid?: number;
  type?: string | number;
  sort?: number;
  name?: string;
  path?: string;
  icon?: string;
  key?: string;
  local?: string;
  status?: number;
  show?: number;
  created_at?: string;
  updated_at?: string;
}

const Table: React.FC = () => {
  const dictEnum = useModel('dictModel', ({dictEnum}) => dictEnum)
  const [rulePid, setRulePid] = useState<RuleType[]>();

  // 菜单项
  const parentItem: ProFormColumnsAndProColumns<RuleType> = {
    title: '父节点',
    dataIndex: 'pid',
    valueType: 'treeSelect',
    request: async () => rulePid!,
    fieldProps: { fieldNames: { label: 'name', value: 'id' }},
    formItemProps: { rules: [{ required: true, message: '此项为必填项' }]},
    colProps: { span: 7 },
  };
  const ruleItem: ProFormColumnsAndProColumns<RuleType> = {
    title: '权限标识',
    dataIndex: 'key',
    valueType: 'text',
    tooltip: '例: 路由地址 "/index/index" , 权限标识为 "index.index" , 按钮权限请加上上级路由的权限标识，如：查询按钮权限 "index.index.list" ',
    formItemProps: { rules: [{ required: true, message: '此项为必填项' }]},
  };
  const pathItem: ProFormColumnsAndProColumns<RuleType> = {
    title: '路由地址',
    dataIndex: 'path',
    valueType: 'text',
    formItemProps: { rules: [{ required: true, message: '此项为必填项' }]},
    tooltip: '项目文件系统路径，忽略：pages 或 index.(ts|tsx)',
  };
  const iconItem: ProFormColumnsAndProColumns<RuleType> = {
    title: '图标',
    dataIndex: 'icon',
    valueType: 'text',
    renderFormItem: (form, config, schema) => <IconsItem dataIndex={form.key} form={schema} value={config.value}></IconsItem>,
    colProps: { span: 6 },
  };
  const localeItem: ProFormColumnsAndProColumns<RuleType> = {
    title: '多语言标识',
    dataIndex: 'local',
    valueType: 'text',
    colProps: { span: 6 },
  };

  const upDate = (value: boolean, index: string, id: number) => {
    let data: any = { id };
    data[index] = value ? 1 : 0;
    editApi('/admin/rule', data).then(() => {
      message.success('修改成功');
    });
  };

  const columns: ProFormColumnsAndProColumns<RuleType>[] = [
    {
      title: '类型',
      dataIndex: 'type',
      valueType: 'radio',
      valueEnum: dictEnum.get('ruleType'),
      hideInTable: true,
      initialValue: '0',
      formItemProps: { rules: [{ required: true, message: '此项为必填项' }]},
      colProps: { span: 10 },
    },
    {
      title: '标题',
      dataIndex: 'name',
      valueType: 'text',
      formItemProps: { rules: [{ required: true, message: '此项为必填项' }]},
      width: 200,
      colProps: { span: 7 },
      tooltip: '菜单的标题，可当作菜单栏标题，如果有多语言标识，该项会被覆盖！',
    },
    {
      title: '图标',
      dataIndex: 'icon',
      valueType: 'text',
      renderText: (_, date) => date.icon ? <IconFont name={date.icon}/> : '-',
      width: 60,
      align: 'center',
      hideInForm: true,
    },
    {
      valueType: 'dependency',
      name: ['type'],
      hideInTable: true,
      columns: ({ type }: any): any[] => {
        if (type === '0') {
          return [pathItem, ruleItem, iconItem, localeItem];
        } else if (type === '1') {
          return [parentItem, pathItem, ruleItem, iconItem, localeItem];
        } else if (type === '2') {
          return [parentItem, ruleItem];
        }
        return [];
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      valueType: 'radioButton',
      valueEnum: dictEnum.get('ruleType'),
      render: (_, date) => <XinDict value={date.type} dict={'ruleType'} />,
      hideInForm: true,
      align: 'center',
      width: 120,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      valueType: 'text',
      tooltip: '数字越大排序越靠前',
      align: 'center',
      width: 100,
      colProps: { span: 4 },
    },
    {
      title: '权限标识',
      dataIndex: 'key',
      valueType: 'text',
      hideInForm: true,
      tooltip: '例: 路由地址 "/index/index" , 权限标识为 "index.index" , 按钮权限请加上上级路由的权限标识，如：查询按钮权限 "index.index.list" ',
      width: 200,
    },
    {
      title: '路由地址',
      dataIndex: 'path',
      valueType: 'text',
      hideInForm: true,
      renderText: (text, record) => record.type !== '2' ? text : '-',
      tooltip: '项目文件系统路径，忽略：pages 或 index.(ts|tsx)',
      width: 200,
    },
    {
      title: '显示状态',
      dataIndex: 'show',
      valueType: 'switch',
      tooltip: '菜单栏显示状态，控制菜单是否显示再导航中（菜单规则依然生效）',
      align: 'center',
      width: 120,
      render: (_, data) => {
        if (data.type === '2') { return '-' }
        return (
          <Switch
            checkedChildren='显示'
            unCheckedChildren='隐藏'
            defaultValue={data.show === 1}
            onChange={(value) => upDate(value, 'show', data.id!)}
          />
        )
      },
      colProps: { span: 4 },
    },
    {
      title: '是否禁用',
      dataIndex: 'status',
      valueType: 'switch',
      tooltip: '权限是否禁用（将不会参与权限验证）',
      align: 'center',
      width: 120,
      render: (_, data) => {
        return <Switch
          checkedChildren='启用'
          unCheckedChildren='禁用'
          defaultChecked={data.status === 1}
          onChange={(value) => upDate(value, 'status', data.id!)}
        />;
      },
      colProps: { span: 4 },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'date',
      hideInForm: true,
      align: 'center',
    },
    {
      title: '最近修改',
      dataIndex: 'updated_at',
      valueType: 'fromNow',
      hideInForm: true,
      align: 'center',
    },
  ];

  /**
   * 添加菜单
   * @param ruleData
   */
  const handleAdd = async (ruleData: RuleType) => {
    let data = Object.assign(ruleData, {show: 1, status: 1})
    if(data.type === '0') { data.pid = 0 }
    await addApi('/admin/rule', data);
    return true;
  }

  /**
   * 编辑菜单
   * @param ruleData
   */
  const handleUpdate = async (ruleData: RuleType) => {
    let data: RuleType = {};
    if (ruleData.type === '0') {
      data = Object.assign(ruleData, { pid: 0, type: 0})
    } else if (ruleData.type === '1') {
      data = Object.assign(ruleData, { type: 1 })
    } else if (ruleData.type === '2') {
      data = Object.assign(ruleData, { type: 2, path: '', local: '', icon: '' })
    } else {
      message.warning('类型错误！');
      return false;
    }
    await editApi('/admin/rule' , data );
    message.success('更新成功！');
    return true
  }

  return (
    <XinTable<RuleType>
      tableApi={'/admin/rule'}
      columns={columns}
      search={false}
      pagination={false}
      handleAdd={handleAdd}
      handleUpdate={handleUpdate}
      optionProps={{ fixed: 'right', width: 100, align: "center" }}
      addBefore={() => setRef.toggle()}
      accessName={'admin.rule'}
      scroll={{ x: 1480 }}
    />
  )
}

export default Table
