import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoApp } from './src/TodoApp'

describe('TodoApp', () => {
  it('renders the initial state of the Todo app', () => {
    render(<TodoApp />)
    const heading = screen.getByRole('heading', {
      level: 2,
      name: /todos/i,
    })
    expect(heading).toBeVisible()

    const newTodoInput = screen.getByRole('textbox', {
      name: /new todo/i,
    })
    expect(newTodoInput).toBeVisible()
    expect(newTodoInput).toBeEnabled()
    expect(newTodoInput).toHaveValue('')

    const addButton = screen.getByRole('button', {
      name: /^add$/i,
    })
    expect(addButton).toBeVisible()
    expect(addButton).toBeEnabled()
    expect(addButton).toHaveAttribute('type', 'submit')

    const filterGroup = screen.getByRole('group', {
      name: /filter todos/i,
    })
    expect(filterGroup).toBeVisible()

    const expectedFilters = [
      { name: /^all$/i, pressed: true },
      { name: /^active$/i, pressed: false },
      { name: /^completed$/i, pressed: false },
    ]

    expectedFilters.forEach(({ name, pressed }) => {
      const button = within(filterGroup).getByRole('button', { name })

      expect(button).toBeVisible()
      expect(button).toBeEnabled()
      expect(button).toHaveAttribute('aria-pressed', String(pressed))
    })

    const remainingCount = screen.getByText(/^0 left$/i)
    expect(remainingCount).toBeVisible()

    const todoList = screen.getByRole('list')
    expect(todoList).toBeVisible()
    expect(within(todoList).queryAllByRole('listitem')).toHaveLength(0)
  })

  it('adds a non-empty todo to the list', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    const newTodoInput = screen.getByRole('textbox', {
      name: /new todo/i,
    })
    const addButton = screen.getByRole('button', {
      name: /^add$/i,
    })

    const todoList = screen.getByRole('list')
    expect(within(todoList).queryAllByRole('listitem')).toHaveLength(0)
    expect(screen.getByText(/^0 left$/i)).toBeVisible()

    await user.type(newTodoInput, 'Test')
    await user.click(addButton)

    const todoCheckbox = within(todoList).getByRole('checkbox', {
      name: /test/i,
    })
    expect(todoCheckbox).toBeVisible()
    expect(todoCheckbox).toBeEnabled()
    expect(todoCheckbox).not.toBeChecked()

    expect(within(todoList).getAllByRole('listitem')).toHaveLength(1)
  
    expect(
      within(todoList).getByRole('button', {
        name: /delete test/i,
      }),
    ).toBeEnabled()

    expect(screen.getByText(/^1 left$/i)).toBeVisible()
    expect(newTodoInput).toHaveValue('')
  })

  it('ignores empty and whitespace-only input', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    const input = screen.getByRole('textbox', {
      name: /new todo/i,
    })
    const addButton = screen.getByRole('button', {
      name: /^add$/i,
    })

    const todoList = screen.getByRole('list')
    const expectNoTodos = () => {
      expect(within(todoList).queryByRole('listitem')).not.toBeInTheDocument()
      expect(screen.getByText(/^0 left$/i)).toBeVisible()
    }
    expectNoTodos()
    expect(input).toHaveValue('')

    await user.type(input, '   ')
    await user.click(addButton)

    expectNoTodos()
    expect(input).toHaveValue('   ')
  })

  it.todo('toggles a todo completed via its checkbox')
  it.todo('deletes a todo via its Delete button')
  it.todo('Active filter shows only not-completed todos')
  it.todo('Completed filter shows only completed todos')
  it.todo('All filter shows every todo again')
  it.todo('shows the count of active todos as "{n} left"')
})
