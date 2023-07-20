import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qoktiqjeuydpxhptvnoo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFva3RpcWpldXlkcHhocHR2bm9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODY1ODc3MTgsImV4cCI6MjAwMjE2MzcxOH0.9atSLNVJbX8TdrvTAgP-5n7TqB4czTu8cnRs-_xyI0w'
const supabase = createClient(supabaseUrl, supabaseKey)

async function fixBug() {
  let { data: numbers, error } = await supabase
    .from('numbers')
    .select('*')
  console.log(numbers);
} 
fixBug()

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

setupCounter(document.querySelector('#counter'))
