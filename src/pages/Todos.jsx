import { useState, useEffect, useMemo } from "react"
import axios from 'axios'
import Todo from '../components/Todo'
import MyInput from "../components/MyInput"
import MyButton from "../components/MyButton"
import MyCross from "../components/MyCross"

const Todos = () => {
  const [todos, setTodos] = useState([])
  const [seeCompleted, setSeeCompleted] = useState(false)
  const [add, setAdd] = useState(false)
  const [newTask, setNewTask] = useState('')

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get('/api/todos')
        setTodos(response.data)
      } catch (error) {
        console.error('Error fetching todos:', error)
      }
    }
    fetchTodos();
  }, [])

  const pending = useMemo(() => todos.filter((todo) => todo.status === 'i'), [todos])
  const complete = useMemo(() => todos.filter((todo) => todo.status === 'c'), [todos])

  const see_completed = () => {
    setSeeCompleted(!seeCompleted)
  }

  const add_task = () => {
    if (!add) {
      setAdd(true)
    }
    else if (!newTask) {
      return
    }
    else {
      const datetime = new Date()
      const taskObject = {
        task: newTask,
        status: 'i',
        created: datetime.toLocaleString('en-UK', { 
          month: "short", 
          year: "numeric", 
          day: "numeric", 
          hour: "numeric", 
          minute: "numeric", 
          second: "numeric", 
          hour12: true 
        })
      }
      axios
        .post('/api/todos', taskObject)
        .then(response => {
          setTodos(todos.concat(response.data))
          setNewTask('')
        })
      setAdd(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-8 flex flex-col items-center bg-black text-white min-h-screen">
      <div className="w-full space-y-1">
        {pending.map((todo) => (
          <Todo 
            todo={todo} 
            key={todo.todo_id} 
            todos={todos} 
            setTodos={setTodos}
          />
        ))}
      </div>

      <button 
        onClick={see_completed}
        className="mt-8 text-white hover:underline"
      >
        see completed tasks
      </button>

      {seeCompleted && (
        <div className="w-full space-y-1 mt-4">
          {complete.map((todo) => (
            <Todo 
              todo={todo} 
              key={todo.todo_id} 
              setTodos={setTodos}
            />
          ))}
        </div>
      )}

      <div className="mt-8 flex items-center space-x-2">
        {add && (
          
          <>
          <MyCross 
            f={setAdd}
          />
            <MyInput
              placeholder = 'your task'
              f = {setNewTask}
              autoFocus
            />
          </>
        )}
        <MyButton
          onClick={add_task}
          text_false="new task"
        />
      </div>
    </div>
  )
}

export default Todos