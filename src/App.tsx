import TopBar from './components/TopBar'
import Header from './components/Header'
import MainBanner from './components/MainBanner'
import CategoryIcons from './components/CategoryIcons'
import PopularProducts from './components/PopularProducts'
import SpecialSection from './components/SpecialSection'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <Header />
      <main>
        <MainBanner />
        <CategoryIcons />
        <PopularProducts />
        <SpecialSection />
      </main>
      <Footer />
    </div>
  )
}

export default App

