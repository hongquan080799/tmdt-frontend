import './App.css';
import Router from './router'
import { UserProvider } from './context/UserContext';
function App() {
  return (
    <div className="App">
      <UserProvider>
        <Router />
      </UserProvider>
    </div>
  );
}

export default App;
