import RestaurantTable from './components/RestaurantTable.tsx'
import './App.css'

function App() {

  return (
    <>
      <div className="app">
        <div className="app-header">
          <div>
            <h1 className="page-title">Restaurantes del Mundo</h1>
          </div>
        </div>
        <div className="app-content">
          <RestaurantTable />
        </div>
      </div>
    </>
  )
}

export default App
