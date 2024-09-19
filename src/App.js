import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <a className="App-link" href="https://example.com" target="_blank" rel="noopener noreferrer">
          <p>Hello from Mr Jenkins - Demo to Steve</p>
        </a>
        <p>Code repo: GitHub</p>
        <p>CI/CD: Jenkins</p>
        <p>Image registry: AWS ECR (Elastic Container Registry)</p>
        <p>Containerised at: AWS ECS (Elastic Container Service)</p>
      </header>
      <p>
        Application version: {process.env.REACT_APP_VERSION}
      </p>
    </div>
  );
}

export default App;
