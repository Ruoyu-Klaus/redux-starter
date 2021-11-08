import { pipe } from 'lodash/fp'
import { applyMiddleware, createStore } from 'redux'

const toLowerCase = str => str.toLowerCase()

const wrapWithType = type => str => `<${type}>${str}</${type}>`

const transform = pipe(toLowerCase, wrapWithType('span'))

console.log(transform('HELLO,WORLD!'))

const reducer = (state = { posts: [], isLoading: false }, action) => {
  switch (action.type) {
    case 'FETCH_POST':
      return { ...state, isLoading: true }
    case 'FETCH_POST_SUCCESS':
      return { ...state, posts: action.posts, isLoading: false }
    default:
      return state
  }
}

const customMiddleware = store => next => action => {
  const { getState } = store
  const dispatch = action => {
    return next(action)
  }
  return action(dispatch, getState)
}

const store = createStore(reducer, applyMiddleware(customMiddleware))

const fetchAction = () => async (dispatch, getState) => {
  const fetchPost = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        return resolve([{ id: 1, title: 'title' }])
      }, 200)
    })
  }
  dispatch({
    type: 'FETCH_POST',
  })
  const response = await fetchPost()
  dispatch({
    type: 'FETCH_POST_SUCCESS',
    posts: response,
  })
}

store.dispatch(fetchAction())
console.table(store.getState())
setTimeout(() => {
  console.log('After fetching')
  console.table(store.getState())
}, 1000)
