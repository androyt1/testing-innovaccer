import React from 'react'
import {Row,Column,Card,Dropdown,Input,Table,Label,Divider,Button,HelpText,Message} from '@innovaccer/design-system'
import axios from 'axios'
import Post from '../component/Post'


const Home = () => {    

 const fetchUsers=async()=>{
    const response=await axios.get(`https://jsonplaceholder.typicode.com/users?_limit=5`)
   return response?.data?.map(user=>({label:`${user?.name}-${user?.email}`,value:`${user?.name}-${user?.email}`}))
 }

 const searchUsers=async(searchTerm)=>{  
    const response=await axios.get(`https://jsonplaceholder.typicode.com/users?q=${searchTerm}`)
    return response?.data?.map(user=>({label:`${user?.name}-${user?.email}`,value:`${user?.name}-${user?.email}`}))
 }

 const fetchOptions =async(searchTerm)=>{ 
    let searchedOptions=[]  
  if(!searchTerm){
    searchedOptions=await fetchUsers()     
  }
  else {
    searchedOptions=await searchUsers(searchTerm)    
  }
  return {
    searchTerm,
    options: searchedOptions,
    count: searchedOptions?.length,
}
 }


 const schema = [
    {
      name: 'name',
      displayName: 'Name',
      width: '50%',
      sorting: false
    },    
    {
      name: 'email',
      displayName: 'Email',
      width: '50%',
      sorting: false
    },    
  ];

  const[selectedUser,setSelectedUser]=React.useState('')
  const[userList,setUserList]=React.useState([])
  const[loading,setLoading]=React.useState(false)
  const[message,setMessage]=React.useState({
    text:'',
    type:''
  })
  const[user,setUser]=React.useState({
    name:'',
    nameError:false,
    nameCaption:'',
    email:'',
    emailError:false,
    emailCaption:''
  })
  function selectUser(value){
    setSelectedUser(value)
  }
  
 
  function validateName(value){
    const regex=/^(?=.{3,30}$)[A-Z][a-z]{0,15}(?:[-' ][A-Z][a-z]{1,14})?$/
    if(!value.match(regex)){       
        setUser({...user,name:value,nameError:true,nameCaption:'Name is Invalid'})
    }else{       
        setUser({...user,name:value,nameError:false,nameCaption:'Looks Good'})
    }
  }

  // project name regex /^[a-zA-Z]{1,30}$/

  function validateEmail(value){
    const regex=/^[^\s][^\s@]*@[^\s@]+\.[^\s@]+[^\s]$/
    if(!value.match(regex)){
        setUser({...user,email:value, emailError:true,emailCaption:'Email is Invalid'})
    }else{
        setUser({...user,email:value,emailError:false,emailCaption:'Looks Good'})
    }
  }


  function addUser(){     
    if(selectedUser===''){
        setMessage({...message,text:'Please select A User to Add',type:'alert'})
        return
    }
    setLoading(true)
    let split=selectedUser.split("-")
    const name=split[0]
    const email=split[1]
    const newUser={name,email}   
    setUserList([...userList,newUser])     
    setTimeout(()=>{
        setLoading(false)
    },500)
    setMessage({...message,text:'New User Created Successfully',type:'success'})
  }

  const{name,email,nameError,nameCaption,emailCaption,emailError}=user
  console.log('name ',name,'email',email)

  function addUserFromForm(){   
    if(name==='' || email===''){
        setMessage({...message,text:'Please select A User to Add',type:'alert'})
        return
    }
    setLoading(true)   
    const newUser={name:name,email:email}   
    setUserList([...userList,newUser])     
    setTimeout(()=>{
        setLoading(false)
    },500)
    setMessage({...message,text:'New User Created Successfully',type:'success'})
  }
 
 

  return (
    <>
    <Row>
        <Column className='mx-auto' size={7} sizeXS={12} sizeS={12}>
            <Card className='p-7'>
                {
                    message?.text && <Row className='mb-6'>
                        <Message appearance={message?.type} description={message?.text} />
                    </Row>
                }
                <Row className='mb-6'>
                    <Column size={3} className='d-flex align-items-center'>
                    <Label>Select User</Label>
                    </Column>
                    <Column size={5}>
                    <Dropdown placeholder='Select User' onChange={selectUser} withSearch={true}  fetchOptions={fetchOptions}   />
                    </Column>
                    <Column size={2}><Button onClick={addUser} appearance='primary' className='ml-3 w-100'>Add User</Button></Column>
                </Row>
                <Divider className='mb-4'/>

<Row className=''>
    <Column className='d-flex align-items-center' size={3}>
        <Label required>Name</Label>
    </Column>
    <Column className='' size={7}>
        <Input type='text' placeholder='Enter Full Name' name='name' error={nameError} onChange={(e)=>validateName(e.target.value)}  onBlur={(e)=>validateName(e.target.value)}/>
    </Column>
</Row>
<Row className='mb-6'>
    <Column size={3}></Column>
    <Column size={7}> <HelpText error={nameError} message={nameCaption} /></Column>
</Row>


<Row className=''>
    <Column className='d-flex align-items-center' size={3}>
        <Label required>Email Address</Label>
    </Column>
    <Column className='' size={7}>
        <Input type='email' name='email' error={emailError} placeholder='Enter Email Address' onChange={(e)=>validateEmail(e.target.value)}  onBlur={(e)=>validateEmail(e.target.value)}/>
    </Column>
</Row>
<Row className='mb-6'>
    <Column size={3}></Column>
    <Column size={7}> <HelpText error={emailError} message={emailCaption} /></Column>
</Row>

<Row className='mb-6'>
    <Column size={2}>
        <Button onClick={addUserFromForm} className='w-100' appearance='primary'>Add User</Button>
    </Column>
</Row>
<Divider className='mb-4'/>
                <Row>                    
                    <Column size={12} className='pt-4'>
                    <Table
          showMenu={false}
          size="compressed"         
          separator={false}
          schema={schema}
          loading={loading}
           data={userList} 
          withHeader={true}
          headerOptions={{
            withSearch: true
          }}
          onSearch={(currData, searchTerm) => {
            return currData.filter(d =>
              d.name.toLowerCase().match(searchTerm.toLowerCase())
            );
          }}
          withPagination={true}
          pageSize={5}
        />
                    </Column>
                </Row>
            </Card>
        </Column>
    </Row>
    <Post/>
    </>
  )
}

export default Home