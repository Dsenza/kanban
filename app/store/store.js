import { createStore } from 'redux'
import todoApp from '../reducers/notes.js'

let store = createStore(todoApp)