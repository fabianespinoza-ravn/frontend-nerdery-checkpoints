import { fetchUsers, type User } from './api'
import { Component, Suspense, use, useState, type ReactNode } from 'react'

let usersPromise: Promise<User[]> | null = null

function getUsersPromise() {
  if (!usersPromise) {
    usersPromise = fetchUsers()
  }
  return usersPromise
}

type ErrorBoundaryProps = {
  children: ReactNode
  onRetry: () => void
}

type ErrorBoundaryState = {
  hasError: boolean
}

class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <p>Something went wrong.</p>
          <button onClick={this.props.onRetry}>Try again</button>
        </>
      )
    }

    return this.props.children
  }
}

function UsersList(){
  const users = use(getUsersPromise())

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}

export function UsersView() {
  const [boundaryKey, setBoundaryKey] = useState(0)

  function handleRetry() {
    usersPromise = fetchUsers()
    setBoundaryKey((key) => key + 1)
  }

  return (
    <ErrorBoundary key={boundaryKey} onRetry={handleRetry}>
      <Suspense fallback={<p>Loading...</p>}>
        <UsersList />
      </Suspense>
    </ErrorBoundary>
  )
}
