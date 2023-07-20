import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabase = createClient('https://bfuqmsuymvpziqbqworf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmdXFtc3V5bXZwemlxYnF3b3JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk2OTc3MjMsImV4cCI6MjAwNTI3MzcyM30.IXRUzBtmFVl-EWg4aOiqfZuUn6Iv84cgsViP50pZzaY')
const date = new Date()

if (sessionStorage.getItem('username') != undefined) loadapp()
else {
  // logs the table vite_database_table
  // let { data: vite_database_table } = await supabase
  //   .from('vite_database_table')
  //   .select('*')
  // console.log(vite_database_table)
  
  // inserts data into database when enter is pressed in the input
  // const text_input = document.querySelector('.text_input')
  // text_input.addEventListener('keydown', async (e) => {
  //   if (e.key == 'Enter') {
  
  //     console.log(text_input.value)
  
  //     const { error } = await supabase
  //       .from('vite_database_table')
  //       .insert({
  //         text_input: text_input.value
  //       })
  //   }
  // })
  
  
  // signup
  const signupUsernameInput = document.querySelector('.signup > input.username')
  const signupPasswordInput = document.querySelector('.signup > input.password')
  const signupButton = document.querySelector('.signup > button')
  
  signupButton.addEventListener('click', async e => {
    if (signupUsernameInput.value && signupPasswordInput.value) {
      const { error } = await supabase
        .from('users')
        .insert({
          Username: signupUsernameInput.value,
          Password: signupPasswordInput.value
        })
        if (error) {
          if (error.code == '23505') {
            alert('that username already exists change it and try again')
          }
        } else {
          console.log('Signup success')
          sessionStorage.setItem('username', signupUsernameInput.value)
          sessionStorage.setItem('password', signupPasswordInput.value)
          
          loadapp()
        }
    }
  })
  
  
  const loginUsernameInput = document.querySelector('.login > input.username')
  const loginPasswordInput = document.querySelector('.login > input.password')
  const loginButton = document.querySelector('.login > button')
  
  loginButton.addEventListener('click', async e => {
    if (loginUsernameInput.value && loginPasswordInput.value) {
       
      // logs the table users
      let { data: users } = await supabase
        .from('users')
        .select('*')
  
      users.filter(x => {
        if (x.Username == loginUsernameInput.value && x.Password == loginPasswordInput.value) {
          sessionStorage.setItem('username', x.Username)
          sessionStorage.setItem('password', x.Password)
          console.log('Login success')
          loadapp()
          return x
        } 
      })
    }
  })

}

function removeDuplicates(arr) { // https://www.geeksforgeeks.org/how-to-remove-duplicate-elements-from-javascript-array/#
  return arr.filter((item,
      index) => arr.indexOf(item) === index);
}

function loadapp() {
  document.querySelector('.authorization').remove()
  document.querySelector('.container').classList.remove('active')
  let myUsername = sessionStorage.getItem('username')

  // changes the active conversation when run
  function changeConvoHandler(e) {
    const folderItems = [...document.querySelectorAll('.convos > div')]
    folderItems.forEach(item2 => item2.classList.remove('active'))
    e.target.classList.add('active')
    sessionStorage.setItem('activeConvo', e.target.dataset.user)
    fillCurrentConversation()
    setHeader()
  }

  async function fillConvosFolder() {
    const convosWrapper = document.querySelector('.convos')
    let convosWrapperChildren = [...document.querySelectorAll('.convos > *')]
    convosWrapperChildren.forEach(child => child.remove())

    // pulls all messages
    let { data: messages, error } = await supabase
      .from('messages')
      .select('')

    // filters out messages that dont pertain to me
    let convos = messages.map(msg => {
      if (msg.from == myUsername || msg.to == myUsername) return msg
    }).filter(x => {if (x) return x})
    // console.log(convos);

    // returns the usernames of the user thats not me
    convos = convos.map(msg => {
      if (msg.from == myUsername) return msg.to
      else return msg.from
    })
    // console.log(convos);

    // removes duplicate users from messages
    convos = removeDuplicates(convos)
    // console.log(convos);

    // adds each folder item
    convos.forEach((convo, i) => {
      let conversation = document.createElement('div')
      conversation.dataset.user = convo
      let conversationLetter = document.createElement('p')
      conversationLetter.innerHTML = convo[0]
      convosWrapper.appendChild(conversation)
      conversation.appendChild(conversationLetter)

      if (sessionStorage.getItem('activeConvo') == convo) {
        conversation.classList.add('active')
      } 
      if (i == 0 && sessionStorage.getItem('activeConvo') == undefined) {
        conversation.classList.add('active')
        sessionStorage.setItem('activeConvo', convo)
      }
    })

    // allows you to set the current conversation by clicking the item within the convos folder
    const folderItems = [...document.querySelectorAll('.convos > div')]
    folderItems.forEach(item => {
      item.addEventListener('click', changeConvoHandler)
    })
    
    // adds the plus item to send to foreign users
    let newconversation = document.createElement('div')
    newconversation.classList.add('addNewConversation')
    newconversation.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM609.3 512H471.4c5.4-9.4 8.6-20.3 8.6-32v-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2h61.4C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z"/></svg>'
    convosWrapper.appendChild(newconversation)

    // brings the popup to create a new conversation up
    newconversation.addEventListener('click', e => {
      const createNewConversation = document.querySelector('.createNewConversation')
      createNewConversation.classList.toggle('active')
    })
  }
  fillConvosFolder()

  function createNewConvo() {
    // allows you to send messages to a foreign user
    const sendnewconversationmessage = document.querySelector('.createNewConversation button')
    sendnewconversationmessage.addEventListener('click', e => {
      const username = document.querySelector('.createNewConversation .username').value
      const message = document.querySelector('.createNewConversation .message').value
      const me = sessionStorage.getItem('username')

      // sends the message in the db
      async function insertSupabaseRow() {
        await sessionStorage.setItem('activeConvo', username)
        const { error } = await supabase
            .from('messages')
            .insert({
              from: me,
              to: username,
              text: message
            })
      }
      insertSupabaseRow()

      const createNewConversation = document.querySelector('.createNewConversation')
      createNewConversation.classList.add('active')
    })
  }
  createNewConvo()
  
  async function fillCurrentConversation() {
    const activeConvo = sessionStorage.getItem('activeConvo')
    const conversation = document.querySelector('.conversation')

    let messages = [...document.querySelectorAll('.conversation > *')]
    messages.forEach(child => child.remove())
    
    // pulls all messages
    let { data: repullMessages, error } = await supabase
    .from('messages')
    .select('')

    // filters out messages that dont pertain to the current conversation
    let convos = repullMessages.map(msg => {
      if (msg.from == myUsername && msg.to == activeConvo || msg.to == myUsername && msg.from == activeConvo) return msg
    }).filter(x => {if (x) return x})    

    convos.forEach(msg => {
      const messageDiv = document.createElement('div')
      messageDiv.classList.add('message')
      messageDiv.innerHTML = `
      <div class="heading">
        <div class="profilePic">${msg.from[0]}</div>
        <h2>${msg.from}</h2>
      </div>
      <p class="maintext">
        ${msg.text}
      </p>
      `
      conversation.appendChild(messageDiv)
    })

    conversation.scrollTop = conversation.scrollHeight
  }
  fillCurrentConversation()

  function setHeader() {
    const me = sessionStorage.getItem('username')
    const them = sessionStorage.getItem('activeConvo')
    const headerUsername = document.querySelector('.header > .username')
    const headerProfilePic = document.querySelector('.header .profilePic')
    const currentConvo = document.querySelector('.currentConvo')
    const theirProfilePic = document.querySelector('.theirProfilePic')

    headerUsername.innerHTML = me
    headerProfilePic.innerHTML = me[0].toUpperCase()
    currentConvo.innerHTML = them
    theirProfilePic.innerHTML = them[0]
  }
  setHeader()

  function deletingConvos() {
    const deleteConvo = document.querySelector('.deleteConvo')
    
    deleteConvo.addEventListener('click', async e => {
      const them = await sessionStorage.getItem('activeConvo')
      console.log(`delete ${them}'s messages`)

      // deletes every message between you and the person of the active conversation
      const { deleteError1 } = await supabase
        .from('messages')
        .delete()
        .eq('to', them)
      
      const { deleteError2 } = await supabase
        .from('messages')
        .delete()
        .eq('from', them)
    })
  }
  deletingConvos()

  function setInput () {
    const me = sessionStorage.getItem('username')
    const input = document.querySelector('.input input')
    const inputSendBtn = document.querySelector('.input .sendmsg')

    async function handleInput(e) {
      if (e.key == 'Enter' || !e.key) {
        const activeConvo = await sessionStorage.getItem('activeConvo')
        const { error } = await supabase
          .from('messages')
          .insert({
            from: me,
            to: activeConvo,
            text: input.value
          })

        input.value = ''
      }
    }
    input.addEventListener('keydown', handleInput)
    inputSendBtn.addEventListener('click', handleInput)
  }
  setInput()

  async function autoUpdateWhenMessageSent() {    
    const insertMessages = supabase.channel('custom-insert-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (insertPayload) => {
          fillCurrentConversation()
          fillConvosFolder()
          setHeader()
          console.log('insert')
        }
      )
      .subscribe()

    let deleteAgain = true
    const deleteMessages = supabase.channel('custom-delete-channel')
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'messages' },
        (deletePayload) => {
          console.log('delete')
          setTimeout(() => {
            deleteAgain = true  
          }, 1000);
          
          if (deleteAgain) {
            fillCurrentConversation()
            fillConvosFolder()
            setHeader()
            deleteAgain = false
          }
        }
      )
      .subscribe()
  }
  autoUpdateWhenMessageSent()
}