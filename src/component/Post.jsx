import React from 'react'
import { Row,Column,Table } from '@innovaccer/design-system'
import axios from 'axios'

const Post = () => {

    const schema=[
        {
            name: 'userId',
            displayName: 'User ID',
            width: '30%',                
          },
          {
            name: 'title',
            displayName: 'Post Title',
            width: '35%',           
          },
          {
            name: 'body',
            displayName: 'Post Body',
            width: '35%',            
          },
    ]

    const fetchData = async(options) => {
        const {
          page,
          pageSize,
          sortingList,
          filterList,
          searchTerm
        } = options;    
       
        const response=await axios.get(`https://jsonplaceholder.typicode.com/posts?_start=${page}&_limit=${pageSize}`)
        return({
          searchTerm,
          schema,
          count: response?.data?.length,
          data: response?.data,
          totalPage:100
        })
       
      }
    

  return (
    <Row >
        <Column className='mx-auto' size={7} sizeXS={12} sizeS={12}>
        <Table         
          fetchData={fetchData}
          withHeader={true}
          headerOptions={{
            withSearch: true
          }}         
          withPagination={true}
          pageSize={5}         
        />
        </Column>
    </Row>
  )
}

export default Post