import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todo, setTodo] = useState(false)
  const [hover, setHover] = useState("")
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState("")
  const startEdit = (todo) => {
    setEditingId(todo.id)
    setEditText(todo.title)
  }

  const saveEdit = (id) => {
    setTodos(prev =>
      prev.map(todo => (
        todo.id === id ? { ...todo, title: editText } : todo
      ))
    )
    setEditingId(null)
    setEditText("")
  }
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos")

    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
      setLoading(false)
    } else {
      fetch("https://jsonplaceholder.typicode.com/todos?_limit=5")
        .then(res => res.json())
        .then(data => {
          const formatted = data.map(item => ({
            id: item.id,
            title: item.title,
            done: item.completed
          }))
          setTodos(formatted)
          setLoading(false)
        })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])


  const toggleVisibility = () => {
    setTodo(prev => !prev)
  }

  const handlePost = () => {
    if (hover.trim() === "") return

    setTodos(prev => [
      ...prev,
      {
        id: Date.now(),
        title: hover,
        done: false,
      }
    ])

    setHover("")
    setTodo(false)
  }

  const toggleLike = (id) => {
    setTodos(prev =>
      prev.map((todo =>

        todo.id === id
          ? { ...todo, done: !todo.done }
          : todo
      )
      )
    )
  }

  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id)

    )
  }
  return (
    <>
      <div>
        <h1>
          TO-DO LIST
        </h1>
      </div>

      <div className="todo">
        <button
          onClick={toggleVisibility}>
          Add Todo
        </button>
        {todo && (
          <label>
            <input
              type="text"
              placeholder="Write something"
              value={hover}
              onChange={(e) => setHover(e.target.value)}
            />
            <button onClick={handlePost}>
              SAVE
            </button>
          </label>
        )}
      </div>
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ol>
            {todos.map(todo => (
              <li
                style={{
                  borderBottom: '1px solid gray',


                }}
                key={todo.id}>
                {editingId === todo.id ? (
                  <>
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <button onClick={() => saveEdit(todo.id)}>💾 Save</button>
                  </>
                ) : (
                  <p
                    style={{

                      textDecoration: todo.done ? "line-through" : "none"
                    }}
                  >
                    {todo.title}
                  </p>
                )}
                <button
                  onClick={() => toggleLike(todo.id)}
                  style={{ border: 'none', outline: 'none', backgroundColor: 'black', color: 'white' }}>
                  {todo.done ? "DONE ✅" : "MARK AS DONE"}
                </button> <button
                  onClick={() => deleteTodo(todo.id)}
                >
                  🗑️
                </button><button
                  onClick={() => startEdit(todo)}>
                  ✏️ Edit
                </button>
              </li>
            ))}

          </ol>

        )}
      </div >

    </>
  );

}

export default App
