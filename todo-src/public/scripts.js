window.addEventListener('load', () => {
	let todoList = []

	const mainEl = document.getElementById('todo-main')
	const todoInput = document.getElementById('todo')
	const todoForm = document.getElementById('todo-form')
	const list = document.getElementById('todo-list')
	const signOutBtn = document.getElementById('signout-btn')



	// // Fetch All and render TODOs
	// const fetchNrder = () => {
	// 	axios('/api/list').then((response) => {
	// 		todoList = [...response.data.todos]
	// 		createList()
	// 	})
	// }

	// Fetch render TODOs with pagination
	const fetchNrder = (toSkip = true, showAlert=true, initial) => {
		const skip = toSkip ? todoList.length : 0
		const limit =  initial? 10 : !showAlert ? todoList.length : todoList.length + 10
		axios(`/api/paged/?skip=${skip}&limit=${limit}`).then((response) => {
			// console.log(response.data)
			if(showAlert && response.data.length===0){
				return alert('No more todos')
			}
			if(toSkip){
				todoList.push(...response.data)
			}else{
				todoList = [...response.data]
			}
			createList()
		})
	}

	const handleAdd = () => {
		event.preventDefault()
		const params = new URLSearchParams()
		params.append('todo', todoInput.value)
		axios
			.post('/api/add', params)
			.then(() => {
				fetchNrder(false)
				todoInput.value = ''
			})
			.catch((error) => {
				console.log(error)
			})
	}

	const handleUpdate = (id, todo) => {
		const newTodo = window.prompt('Update new todo', todo)
		// check if user cancels or its the same todo
		if (newTodo === null || newTodo === todo) {
			return
		} else if (newTodo === '') {
		    return handleDelete(id)
		} else {
			const params = new URLSearchParams()
			params.append('todo', newTodo)

			axios
				.put(`/api/edit/${id}`, params)
				.then(() => {
					fetchNrder(false)
				})
				.catch((error) => {
					console.log(error)
				})
		}
	}

	const handleDelete = (id) => {
		axios
			.delete(`/api/delete/${id}`)
			.then(() => {
				fetchNrder(false, false)
			})
			.catch((error) => {
				console.log(error)
			})
	}

	const handleDeleteAll = () => {
		axios
			.delete('/api/deleteAll')
			.then(() => {
				fetchNrder(false,false)
			})
			.catch((error) => {
				console.log(error)
			})
	}

	const createList = () => {
		list.innerHTML = ''
		todoList.forEach((todo) => {
			const li = document.createElement('li')
			const div = document.createElement('div')
			const buttons = document.createElement('div')
			const editBtn = document.createElement('button')
			const deleteBtn = document.createElement('button')

			div.innerText = todo.todo

			buttons.className = 'actions'
			editBtn.className = 'icon-btn'
			deleteBtn.className = 'icon-btn'

			editBtn.onclick = () => {
				console.log(todo.todo)
				handleUpdate(todo._id, todo.todo)
			}
			editBtn.innerHTML = `
            <svg stroke='currentColor' fill='currentColor' stroke-width=0 view-box='0 0 24 24' height='1em' width='1em'>
				<path d='M7,17.013l4.413-0.015l9.632-9.54c0.378-0.378,0.586-0.88,0.586-1.414s-0.208-1.036-0.586-1.414l-1.586-1.586 c-0.756-0.756-2.075-0.752-2.825-0.003L7,12.583V17.013z M18.045,4.458l1.589,1.583l-1.597,1.582l-1.586-1.585L18.045,4.458z M9,13.417l6.03-5.973l1.586,1.586l-6.029,5.971L9,15.006V13.417z' />
				<path d='M5,21h14c1.103,0,2-0.897,2-2v-8.668l-2,2V19H8.158c-0.026,0-0.053,0.01-0.079,0.01c-0.033,0-0.066-0.009-0.1-0.01H5V5 h6.847l2-2H5C3.897,3,3,3.897,3,5v14C3,20.103,3.897,21,5,21z' />
			</svg>
            `

			deleteBtn.onclick = () => {
				handleDelete(todo._id)
			}
			deleteBtn.innerHTML = `
            <svg stroke='currentColor' fill='currentColor' stroke-width=0 view-box='0 0 24 24' height='1em' width='1em'>
				<path d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z' />
			</svg>
            `

			buttons.appendChild(editBtn)
			buttons.appendChild(deleteBtn)
			div.appendChild(buttons)
			li.appendChild(div)

			list.appendChild(li)
		})
		mainEl.appendChild(list)
	}

	const handleSignout = () => {
		axios
			.post('/api/signout')
			.then(() => {
				location.reload()
			})
			.catch((error) => {
				console.log(error)
			})
	}

	const clearAllSessions = () => {
		axios
			.post('/api/allsignout')
			.then(() => {
				location.reload()
			})
			.catch((error) => {
				console.log(error)
			})
	}

	// initial fetch & render todos
	fetchNrder(true, false, true)

	todoForm.addEventListener('submit', handleAdd)

	signOutBtn.addEventListener('click', handleSignout)

	document.getElementById('clear-all').addEventListener('click', handleDeleteAll)

	document.getElementById('clear-sessions').addEventListener('click', clearAllSessions)

	// load more
	document.getElementById('load-more-btn').addEventListener('click', () => {
		fetchNrder()
	})

	// Infinite loading
	document.addEventListener('wheel', () => {
		let documentHeight = document.body.scrollHeight
		let currentScroll = window.scrollY + window.innerHeight

		if (currentScroll + 20 >= documentHeight && event.deltaY > 0) { // positive delta means scrolling down
			// console.log('You are at the bottom!')
			fetchNrder()
		}
	})
})
