import React from 'react'
import Header from './components/Header'
import { Container } from 'react-bootstrap'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Footer from './components/Footer'
import { Outlet } from 'react-router-dom'
export const App = () => {
  return (
    <>
      <Header />
      <main>
          <Container className='py-4'>
            <Outlet />
          </Container>
      </main>
      <ToastContainer />
      <Footer />
    </>
  )
}
