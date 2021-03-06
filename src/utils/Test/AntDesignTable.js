import React, { useState, useEffect } from "react"
import { Table } from "antd"
import { TableProps } from "antd/lib/table"
// @ts-ignore
import reqwest from "reqwest"

import "antd/dist/antd.css"

const AntDesignTable = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [userList, setUserList] = useState([])
  const [pagination, setPagination] = useState({})

  const customFetch = async (params = {}) => {
    // console.log("params:", params)
    setIsLoading(true)
    const response = await reqwest({
      url: "https://randomuser.me/api",
      method: "get",
      data: {
        results: 100,
      },
      type: "json",
    })
    // console.log("response.results", response.results)
    setUserList(response.results)
    setIsLoading(false)
  }

  useEffect(() => {
    customFetch({})
  }, [])

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => (a.name.first > b.name.first ? 1 : -1),
      render: (name) => `${name.first} ${name.last}`,
      width: "20%",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      filters: [
        { text: "Male", value: "male" },
        { text: "Female", value: "female" },
      ],
      width: "20%",
    },
  ]

  const handleTableChange: TableProps<any>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    setPagination(pagination)
    customFetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    })
  }

  return (
    <div>
      <Table
        columns={columns}
        dataSource={userList}
        loading={isLoading}
        onChange={handleTableChange}
        pagination={pagination}
        rowKey='email'
        scroll={{ x: "calc(700px + 50%)", y: 280 }}
      />
    </div>
  )
}

export default AntDesignTable
