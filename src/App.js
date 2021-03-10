import routes from './config/routes';
import Footer from './components/FooterComponents/Footer'

function App() {
  return (
    <>
      <div className="view">
        {routes}
        <Footer />
      </div>
    </>
  );
}

export default App;
