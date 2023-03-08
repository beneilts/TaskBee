import './App.css';
import { NhostClient, NhostProvider } from '@nhost/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { NhostApolloProvider } from '@nhost/react-apollo'
import { RecoilRoot } from 'recoil'

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute'
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import PageNotFound from './pages/PageNotFound';
import Board from './pages/Board';

// SNIPPET => rafce
// Main color: #FFA500 (orange)
// Complementary color: #2F4F4F (dark slate gray)
// Accent color: #FFFFFF (white)

const nhost = new NhostClient({
    subdomain: process.env.REACT_APP_NHOST_SUBDOMAIN,
    region: process.env.REACT_APP_NHOST_REGION
})

function App() {
    return (
        <NhostProvider nhost={nhost}>
            <NhostApolloProvider nhost={nhost}>
                <RecoilRoot>
                    <BrowserRouter>
                        <Routes>
                            <Route path="sign-up" element={<SignUp />} />
                            <Route path="sign-in" element={<SignIn />} />
                            <Route path="/" element={<ProtectedRoute> <Layout /> </ProtectedRoute>}>
                                <Route index element={<Dashboard />} />
                                <Route path="profile" element={<Profile />} />
                                <Route path="boards/:boardId" element={<Board />} />
                                <Route path="*" element={<PageNotFound />} />
                            </Route>
                        </Routes>
                    </BrowserRouter>

                    <Toaster />
                </RecoilRoot>
            </NhostApolloProvider>
        </NhostProvider>
    );
}

export default App;
