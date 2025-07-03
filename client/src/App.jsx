import {BrowserRouter,Routes,Route} from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Signin from './pages/Signin'
import SignUp from './pages/SignUp'
import About from './pages/About'
import Profile from './pages/Profile'
import Header from './components/Header'
import CreateListing from './pages/CreateListing'
import MyListings from './pages/MyListings'
import EditListing from './pages/EditListing'
import ViewListing from './pages/ViewListing'
import SearchResults from './pages/SearchResults'
import ForgetPassword from './pages/ForgetPassword'
import ResetPassword from './pages/ResetPassword'

export default function App() {
  
  return (
    <BrowserRouter>
    <Header/>
    <Routes>
    <Route path='/' element={<Home/>}></Route>
    <Route path='/sign-in' element={<Signin/>}></Route>
    <Route path='/sign-up' element={<SignUp/>}></Route>
    <Route path='/about' element={<About/>}></Route>
    <Route path='/profile' element={<Profile/>}></Route>
    <Route path='/create-listing' element={<CreateListing/>}></Route>
    <Route path='/my-listings' element={<MyListings/>}></Route>
    <Route path='/edit-listing/:id' element={<EditListing />} />
    <Route path='/view-listing/:id' element={<ViewListing />} />
    <Route path='/search-results' element={<SearchResults />} />
    <Route path='/forget-password' element={<ForgetPassword />} />
    <Route path='/reset-password' element={<ResetPassword />} />
    </Routes>
    </BrowserRouter>
  )
}


