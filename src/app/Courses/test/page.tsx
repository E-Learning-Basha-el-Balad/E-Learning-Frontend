'use client'
import Sidebar from '../../../components/ui/sidebar'

export default function Home() {
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main content area */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-4">
          <h1>Dashboard</h1>
          <p>Welcome to the Dashboard!</p>
        </main>
      </div>
    </div>
  );
}
