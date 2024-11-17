import axios from "axios"

const Todo = ({todo, setTodos}) => {
  const onCheckboxChange = () => {
    const taskObject = {
      id: todo.id,
      task: todo.task,
      status: todo.status,
      created: todo.created
    }
    axios
      .put(`/api/todos/${todo.id}`, taskObject)
      .then(response => {
        setTodos(todos => todos.map(t => t.id === todo.id ? response.data : t))
      })
  }

  return (
    <div className="w-full flex justify-between items-center">
      <span className="flex-1">{todo.task}</span>
      <span className="text-sm text-gray-400 mx-4">{todo.created}</span>
      <input
        type="checkbox"
        checked={todo.status === 'c'}
        onChange={onCheckboxChange}
        value={todo.id}
        className="h-4 w-4 border-gray-400"
      />
    </div>
  )
}

export default Todo