import { AuthProvider } from './libs/context/AuthProvider';
import AppRoute from './routes/route';

function App() {

  return (
    <AuthProvider>
      <AppRoute />
    </AuthProvider>
  )
}

export default App
