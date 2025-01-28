import './App.css';
import './Header/Header.js';
import Header from './Header/Header.js';
import MainContent from './Main/MainContent.js';

function App() {
  return (
    <div className="App">
      <Header/>
      <hr></hr>
      <MainContent/>
    </div>
  );
}

export default App;
